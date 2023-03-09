//TO DO:

//GET /profile/interestedList
//DELETE /profile/interestedList

//GET /profile/adopted

//GET /profile/toadopt
//DELTE /profile/toadopt

const router = require("express").Router();
const mongoose = require("mongoose");

//What models do we call?:
const User = require('../models/User.model')
const Comment = require('../models/Comment.model')
const Pet = require('../models/Pet.model')

//User profile

//GET | Find other users' profiles
router.get("/profile/:id", async (req, res) => {

    const {id} = req.params

    try {
        const user = await User.findById(id).populate("reviews interestedPets petsToAdopt adoptedPets")
        res.json(user)
    } catch (error) {
        res.json(error)
    }
})

//PUT | Edit user's profile
router.put("/profile/edit/:id", async (req, res) => {

    const {id} = req.params
    const {email, password, name, gender, description, phone, age, location, userType, interestedPets, petsToAdopt, adoptedPets, reviews, image} = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) res.json("The provided id is not valid.")

    try {
        const updatedUser = await User.findByIdAndUpdate(id, 
            {email, password, name, gender, description, phone, age, location, userType, interestedPets, petsToAdopt, adoptedPets, reviews, image},
            {new: true}
            )
            console.log(updatedUser)
            res.status(200).json(updatedUser)
    } catch (error) {
        res.json(error)
    }
})

//DELETE | Delete user's profile
router.delete("/profile/edit/:id", async (req, res) => {

    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) res.json("The provided id is not valid.")

    try {
        const user = await User.findById(id)
        await Comment.deleteMany({_id: user.reviews})
        await Pet.deleteMany({_id: user.interestedPets})
        await Pet.deleteMany({_id: user.petsToAdopt})
        await Pet.deleteMany({_id: user.adoptedPets})

        await User.findByIdAndRemove(id)

        res.json({message: `User with id: ${id} has been deleted.`})
    } catch (error) {
        res.json(error)
    }
})





module.exports = router