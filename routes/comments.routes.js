const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Comment = require("../models/Comment.model");
const User = require("../models/User.model");

//POST | Add a comment/review:
router.post("/comments/add", async (req, res) => {
  const data = ({ text } = req.body);

  try {
    // Check if requirements are provided as empty strings:
    if (text === "") {
      res.status(400).json({ message: "Provide text" });
      return;
    }
    const createdComment = await Comment.create(data);

    res.status(201).json(createdComment);
  } catch (error) {
    res.json(error);
  }
});

//PUT | Edit a single comment:
router.put("/comments/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  //Confirm user exists through id:
  if (!mongoose.Types.ObjectId.isValid(id))
    res.json("The provided id is not valid.");

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    res.json(error);
  }
});

//DELETE | Delete a comments:
router.delete("/comments/edit/:id", async (req, res) => {
  const { id } = req.params;

  //Confirm pet exists through id:
  if (!mongoose.Types.ObjectId.isValid(id))
    res.json("The provided id is not valid.");

  try {
    const users = await User.find();

    //Remove comment's id from user's review:
    users.map((user) => {
      //Remove the Comment's id from User's reviews:
      if (user.reviews.includes(id)) {
        User.findByIdAndUpdate(user._id, { $pull: { reviews: id } });
      }
    });

    //Remove the comment:
    await Comment.findByIdAndRemove(id);
    res.json({ messag: `The Comment with the id: ${id} has been deleted.` });
  } catch (error) {
    res.json(error);
  }
});


module.exports = router;