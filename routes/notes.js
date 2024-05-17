import express from "express";
import fetchuser from "../middleware/fetchuser.js";
import { Notes } from "../models/Notes.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello notes API");
});

// Route 1. Get all the Notes using GET "api/notes/fetchallnotes" Login required //

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    // Catch Error
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2. Add a new Notes using  POST "api/notes/addnote" Login required //

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Please Enter a Note").isLength({ min: 5 }),
    body("description", "Description must be atleast 5 Character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //   console.log(req.user.id)

      // If there are errors , return Bad Request and the errors
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const saveNote = await note.save();

      res.json(saveNote);
    } catch (err) {
      // Catch Error
      console.error(err.message);
      res.status(500).send("Internal1 Server Error");
    }
  }
);

// Route 3. Update an existing Notes using  PUT "api/notes/updatenote" Login required //

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // Create a newNote Object

    let newNote = {};

    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it

    let note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    // Catch Error
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 4. Delete an existing Notes using  Delete "api/notes/deleteNote/:id" Login required //

router.delete("/deleteNote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be Delete  and Delete it

    let note = await Notes.findById(req.params.id);

    console.log(note.user)
    console.log(req)


    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Your Note has been Deleted ", note: note });
  } catch (err) {
    // Catch Error
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
