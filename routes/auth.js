import express from "express";
import { User } from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fetchuser from "../middleware/fetchuser.js";

const JWS_TOKEN = process.env.JWS_TOKEN

const router = express.Router();

let success = false;

// Route 1.  Create a User using POST "/api/auth/createuser". NO LOGIN REQUIRED

// router.post(
//   "/createuser",
//   [
//     body("fname", "Enter the First Name").isLength({ min: 5 }),
//     body("lname", "Enter the Last Name").isLength({ min: 5 }),
//     body("email").isEmail().withMessage("Not a valid e-mail address"),
//     body("password", "Password must be atleast 5 characters ").isLength({
//       min: 5,
//     }),
//   ],
router.post(
  "/createuser",async (req, res) => {
    // If there are errors , return Bad Request and the errors

    success = false

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    // Check wether the user with this email exists already

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success ,   errors: "Sorry a user with this email already exists" });
      }

      //       Protect YOur Password by bcrypt genSalt and hash

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //       Create a new User

      user = await User.create({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      //       Get THE JWS TOken //

      const authToken = jwt.sign(data, JWS_TOKEN);
        success =  true
      res.json({ success: success, authToken: authToken });
    } catch (err) {
      // Catch Error
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 2.  Authenticate a User using POST "/api/auth/login". NO LOGIN REQUIRED

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Not a valid e-mail address"),
    body("password", "Password must be atleast 5 characters ").exists(),
  ],
  async (req, res) => {
    // If there are errors , return Bad Request and the errors
    const error = validationResult(req);

    if (!error.isEmpty()) {
      res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({
          success: success,
          errors: "Please try to login with  correct Credentials",
        });
      }

      // Compare Your Password with dataBase password hash //

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success: success,
          errors: "Please try to login with  correct Credentials",
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(payload, JWS_TOKEN);

      success = true;

      res.send({ success: success, authToken: authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3.  Get loggedin  User Details using POST "/api/auth/getuser".  LOGIN REQUIRED

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log(userId)
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
