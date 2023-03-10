const router = require("express").Router();
const mongoose = require("mongoose");

//What models do we call?:
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const Pet = require("../models/Pet.model");
const Association = require("../models/Association.model");

//Users profiles:

//GET | Check own profile:
router.get("/profile", async (req, res) => {
  const currentUser = req.payload._id;
  try {
    const user = await User.findById(currentUser).populate(
      "reviews interestedInPets petsForAdoption adoptedPets likedAssociations"
    );
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//GET | Find OTHER users' profiles
router.get("/profile/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("reviews  petsForAdoption");
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//PUT | Edit user's OWN profile:
router.put("/profile/edit/:id", async (req, res) => {
  const { id } = req.params;
  const {
    email,
    password,
    name,
    gender,
    description,
    phone,
    age,
    location,
    reviews,
    userType,
    image,
  } = req.body;

  //Confirm user exists through id:
  if (!mongoose.Types.ObjectId.isValid(id))
    res.json("The provided id is not valid.");

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        email,
        password,
        name,
        gender,
        description,
        phone,
        age,
        location,
        userType,
        reviews,
        image,
      },
      { new: true }
    );
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.json(error);
  }
});

//DELETE | Delete user's OWN profile (and their pets + comments + liked associations):
router.delete("/profile/edit/:id", async (req, res) => {
  const { id } = req.params;

  //Confirm user exists through id:
  if (!mongoose.Types.ObjectId.isValid(id))
    res.json("The provided id is not valid.");

  try {
    const user = await User.findById(id);
    const pets = await Pet.find();
    const likedAssociations = await Association.find();

    //Delete ALL user's comments:
    await Comment.deleteMany({ author: user._id });
    //Delete ALL dogs owned by user:
    await Pet.deleteMany({ owner: user._id });

    //Remove user's id from Pet's interestedUsers and adoptedBy:
    pets.map((pet) => {
      if (pet.interestedUsers.includes(user._id)) {
        Pet.findByIdAndUpdate(pet._id, {
          $pull: { interestedUsers: user._id },
        });
      }
      if (pet.adoptedBy.includes(user._id)) {
        Pet.findByIdAndUpdate(pet._id, { $pull: { adoptedBy: user._id } });
      }
    });

    //Remove user's id from Association's usersLikes:
    likedAssociations.map((association) => {
      if (association.usersLikes.includes(user._id)) {
        Association.findByIdAndUpdate(association._id, {
          $pull: { usersLikes: user._id },
        });
      }
    });

    await User.findByIdAndRemove(id);

    res.json({ message: `User with id: ${id} has been deleted.` });
  } catch (error) {
    res.json(error);
  }
});

//GET | View user's list of pets they're interested in:
router.get("/profile/interested/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const list = await User.findById(id).populate("interestedInPets");
    res.json(list);
  } catch (error) {
    res.json(error);
  }
});

//DELETE | Delete a pet from user's interested list:
router.delete("/profile/interested/:id", async (req, res) => {
  const { id } = req.params;

  //Confirm user exists through id:
  if (!mongoose.Types.ObjectId.isValid(id))
    res.json("The provided id is not valid.");

  try {
    const user = await User.findById(id);
    const pets = await Pet.find();

    //Map pets and remove user id from their interestedUsers:
    pets.map((pet) => {
      if (pet.interestedUsers.includes(id))
        Pet.findByIdAndUpdate(pet._id, { $pull: { interestedUsers: id } });
    });

    //Remove Pet id from user's interestedInPets:
    if (user.interestedInPets.includes(pets._id))
      User.findByIdAndUpdate(id, { $pull: { interestedInPets: pets._id } });
  } catch (error) {
    res.json(error);
  }
});

//GET | View user's adopted pets list:
router.get("/profile/adopted/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const list = await User.findById(id).populate("adoptedPets");
    res.json(list);
  } catch (error) {
    res.json(error);
  }
});

//DELETE | Delete a pet from user's adopted pets list:
router.delete("/profile/adopted/:id", async (req, res) => {
  const { id } = req.params;

  //Confirm user exists through id:
  if (!mongoose.Types.ObjectId.isValid(id))
    res.json("The provided id is not valid.");

  try {
    const user = await User.findById(id);
    const pets = await Pet.find();

    //Map pets and remove user id from their adoptedBy:
    pets.map((pet) => {
      if (pet.interestedUsers.includes(user._id))
        Pet.findByIdAndUpdate(pet._id, { $pull: { adoptedBy: user._id } });
    });
    //Remove Pet id from user's adoptedPets:
    if (user.interestedInPets.includes(pets._id))
      User.findByIdAndUpdate(user._id, { $pull: { adoptedPets: pets._id } });
  } catch (error) {
    res.json(error);
  }
});

//GET | View user's list of pets avaliable for adoption:
router.get("/profile/foradapotion/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const list = await User.findById(id).populate("petsForAdoption");
    res.json(list);
  } catch (error) {
    res.json(error);
  }
});

//DELETE | Delete pets from  user's list of pets avaliable for adoption:
router.delete("/profile/foradoption/:id", async (req, res) => {
  const { id } = req.params;

  //Confirm user exists through id:
  if (!mongoose.Types.ObjectId.isValid(id))
    res.json("The provided id is not valid.");

  try {
    const user = await User.findById(id);
    const pets = await Pet.find();

    //Map pets and remove user id from their owner:
    pets.map((pet) => {
      if (pet.interestedUsers.includes(user._id))
        Pet.findByIdAndUpdate(pet._id, { $pull: { owner: user._id } });
    });
    //Remove Pet id from user's petsForAdoption:
    if (user.interestedInPets.includes(pets._id))
      User.findByIdAndUpdate(user._id, {
        $pull: { petsForAdoption: pets._id },
      });
  } catch (error) {
    res.json(error);
  }
});


module.exports = router;