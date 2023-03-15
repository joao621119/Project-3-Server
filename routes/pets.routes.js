const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Pet = require("../models/Pet.model");
const User = require("../models/User.model");

const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

//ROUTES:

// POST |  "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("image"), (req, res, next) => {
  // console.log("file is: ", req.file)

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ fileUrl: req.file.path });
});

//GET | Display ALL pets:
router.get("/pets", async (req, res) => {
  try {
    const pets = await Pet.find().populate("owner");
    res.json(pets);
  } catch (error) {
    res.json(error);
  }
});

//GET | Display a SINGLE pet:
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
    console.log(id);
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
    res.json({ message: `The Pet with the id: ${id} has been deleted.` });
  } catch (error) {
    res.json(error);
  }
});

//POST | Add a single pet: // 1
router.post("/pets/add", isAuthenticated, async (req, res) => {
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
  const currentUser = req.payload._id; // 2
  console.log(currentUser);
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
    const createdPet = await Pet.create(data); //3
    console.log(createdPet);
    const myUpdatedUser = await User.findByIdAndUpdate(
      currentUser,
      {
        $push: { petsForAdoption: createdPet._id },
      },
      { new: true }
    );
    console.log(myUpdatedUser);

    const myUpdatedPet = await Pet.findByIdAndUpdate(
      createdPet._id,
      {
        $push: { owner: myUpdatedUser._id },
      },
      { new: true }
    );
    console.log(myUpdatedPet);

    res.status(201).json(myUpdatedUser);
  } catch (error) {
    res.json(error);
  }
});
//PUT | Like a pet
router.put("/pets/like/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.payload._id;
  try {
    console.log(id);
    console.log(userId);
    // Find the pet by ID
    const pet = await Pet.findById(id);
    console.log(pet);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Find the user by ID and update their interestedInPets array
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { interestedInPets: id } },
      { new: true }
    );
    console.log(user);
    // Update the interestedUsers array of the pet with the user who liked the pet
    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      { $addToSet: { interestedUsers: userId } },
      { new: true }
    );
    console.log(updatedPet);
    return res
      .status(200)
      .json({ message: "Pet liked successfully", updatedPet });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//PUT | UNlike a pe
router.put("/pets/unlike/:id", isAuthenticated, async (req, res) => {
  const petId = req.params.id;
  const userId = req.payload._id;

  try {
    // Find the pet by ID
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Find the user by ID and update their interestedInPets array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { interestedInPets: petId } },
      { new: true }
    );

    // Update the interestedUsers array of the pet with the user who liked the pet
    await Pet.findByIdAndUpdate(
      petId,
      { $pull: { interestedUsers: userId } },
      { new: true }
    );

    return res.status(200).json({ message: "Pet unliked successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

/* const currentUser = req.payload._id;
const myUser = await User.findById(currentUser)
const myPetUpdated = await Pet.findByIdAndUpdate(createdPet._id, {$push: {interestedUsers: currentUser}}, {new: true})
res.status(201).json(myPetUpdated); */
