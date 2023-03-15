const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const Association = require("../models/Association.model");

//ROUTES:

//GET | Display ALL associations
router.get("/associations", async (req, res) => {
  try {
    const associations = await Association.find();
    res.json(associations);
  } catch (error) {
    res.json(error);
  }
});


//GET | Display a SINGLE association:
router.get("/associations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const association = await Association.findById(id);
    res.json(association);
  } catch (error) {
    res.json(error);
  }


  //PUT | Like an association
  router.put("/associations/like/:id", isAuthenticated, async (req, res) => {
    const associationId = req.params.id;
    const userId = req.user._id;

    try {
      // Find the association by ID
      const association = await Association.findById(associationId);

      if (!association) {
        return res.status(404).json({ message: "Association not found" });
      }

      // Find the user by ID and update their likedAssociations array
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { likedAssociations: associationId } },
        { new: true }
      );

      // Update the usersLikes array of the association with the user who liked it
      await Association.findByIdAndUpdate(
        associationId,
        { $addToSet: { usersLikes: userId } },
        { new: true }
      );

      return res.status(200).json({ message: "Association liked successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });


  //PUT | UNlike an association
  router.put("/associations/unlike/:id", isAuthenticated, async (req, res) => {
    const associationId = req.params.id;
    const userId = req.user._id;

    try {
      // Find the association by ID
      const association = await Association.findById(associationId);

      if (!association) {
        return res.status(404).json({ message: "Association not found" });
      }

      // Find the user by ID and update their likedAssociations array
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { likedAssociations: associationId } },
        { new: true }
      );

      // Update the usersLikes array of the association with the user who liked it
      await Association.findByIdAndUpdate(
        associationId,
        { $pull: { usersLikes: userId } },
        { new: true }
      );

      return res.status(200).json({ message: "Association unliked successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
});

module.exports = router;

