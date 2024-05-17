import jwt from "jsonwebtoken";

const JWS_TOKEN = process.env.JWS_TOKEN;

const fetchuser = (req, res, next) => {

    //  Get the user from the jwt token and add id to req object //
    
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send("Please authenticate using a valid token");
  }

  try {
    const data = jwt.verify(token, JWS_TOKEN);
    req.user = data.user;
    next();
  } catch (err) {
    res.status(401).send("Please authenticate using a valid token");
  }
};

export default fetchuser;
