//GET  /pets/ show all pets

//GET /pets/:id/ show single pet
//PUT /pets/:id/ edit single pet
//DELETE /pets/:id delete single pet

//POST /addPets/ add single pet

//FILTERD SEARCH:
//GET /pets/dogs show only dogs
//GET /pets/cats show only cats
//GET /pets/rabbits show only rabbits
//GET /pets/fish show only fish
//GET /pets/birds show only birds
const express = require("express");
const router = express.Router();
module.exports = router