const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Association = require('../models/Association.model')


//GET | Show all associations
router.get("/associations", async (req, res) => {
    try {
      const associations = await Association.find();
      res.json(associations);
    } catch (error) {
      res.json(error);
    }
  });


//GET | Display a single association:
router.get("/associations/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const association = await Association.findById(id);
      res.json(association);
    } catch (error) {
      res.json(error);
    }
  });


module.exports = router