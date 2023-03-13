const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Pet = require("../models/Pet.model");
const User = require("../models/User.model");

//GET | Show all pets:
router.get("/pets", async (req, res) => {
  try {
    const pets = await Pet.find().populate("owner");
    res.json(pets);
  } catch (error) {
    res.json(error);
  }
});

//GET | Display a single pet:
router.get("/pets/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pet = await Pet.findById(id).populate("owner");
    res.json(pet);
  } catch (error) {
    res.json(error);
  }
});

//PUT | Edit a single pet:
router.put("/pets/edit/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    species,
    breed,
    age,
    weight,
    birthDate,
    gender,
    sterilized,
    image,
    description,
    location,
  } = req.body;

  //Confirm user exists through id:
  if (!mongoose.Types.ObjectId.isValid(id))
    res.json("The provided id is not valid.");

  try {
    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      {
        name,
        species,
        breed,
        age,
        weight,
        birthDate,
        gender,
        sterilized,
        image,
        description,
        location,
      },
      { new: true }
    );
    res.status(200).json(updatedPet);
  } catch (error) {
    res.json(error);
  }
});

//DELETE | Delete a pet:
router.delete("/pets/edit/:id", async (req, res) => {
  const { id } = req.params;

  //Confirm pet exists through id:
  if (!mongoose.Types.ObjectId.isValid(id))
    res.json("The provided id is not valid.");

  try {
    const users = await User.find();

    //Remove pet's id from user's interestedInPets, petsForAdoption and adoptedPets
    users.map((user) => {
      //Remove the pet's id from User's interestedInPets:
      if (user.interestedInPets.includes(id)) {
        User.findByIdAndUpdate(user._id, { $pull: { interestedInPets: id } });
      }
      //Remove the pet's id from User's petsForAdoption:
      if (user.petsForAdoption.includes(id)) {
        User.findByIdAndUpdate(user._id, { $pull: { petsForAdoption: id } });
      }
      //Remove the pet's id from User's adoptedPets:
      if (user.adoptedPets.includes(id)) {
        User.findByIdAndUpdate(user._id, { $pull: { adoptedPets: id } });
      }
    });

    //Remove the pet:
    await Pet.findByIdAndRemove(id);
    res.json({ messag: `The Pet with the id: ${id} has been deleted.` });
  } catch (error) {
    res.json(error);
  }
});

//POST | Add a single pet:
router.post("/pets/add", async (req, res) => {
  const data = ({
    name,
    species,
    breed,
    age,
    weight,
    birthDate,
    gender,
    sterilized,
    image,
    description,
    location,
  } = req.body);

  try {
    // Check if requirements are provided as empty strings:
    if (
      name === "" ||
      species === "" ||
      gender === "" ||
      description === "" ||
      location === ""
    ) {
      res.status(400).json({
        message:
          "Provide name, species, gender, image, description and location",
      });
      return;
    }
    const createdPet = await Pet.create(data);

    res.status(201).json(createdPet);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
