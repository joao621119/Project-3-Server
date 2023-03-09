/* const router = require("express").Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const Task = require("../models/Task.model");

// Create

router.post("/projects", async (req, res, next) => {
  // Get the information from the client:
  const { title, description } = req.body;

  try {
    // Reserve the try for async (promises) operations
    // Create something in our Database:
    const project = await Project.create({ title, description });
    // Send it back to the client:
    res.json(project);
  } catch (error) {
    res.json(error);
  }
});

// Read (all)

router.get("/projects", async (req, res, next) => {
  try {
    // Since we want everything we don´t put anything in the (). It returns an array of tasks. It needs the populate to not return only the ids but get an array of objects instead.
    const projects = await Project.find().populate("tasks"); // "tasks" Name of the array in the Project.model Schema
    res.json(projects);
  } catch (error) {
    res.json(error);
  }
});

// Read (by id)

router.get("/projects/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id).populate("tasks");
    res.json(project);
  } catch (error) {
    res.json(error);
  }
});

// Update

router.put("/projects/:id", async (req, res, next) => {
  // :id needs to be the same name as the object you destruct afterwards:
  // In put we need both params and body:
  const { id } = req.params;
  const { title, description } = req.body;
  // Check if the id is a valid mongodb id:
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.json("The provided id is not a valid");
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    ); // {new: true} means this updated project will actually be the updated one
    res.json(updatedProject);
  } catch (error) {
    res.render(error);
  }
});

// Delete

router.delete("/projects/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.json("The provided id is not a valid");
  }

  try {
    // remove the tasks of the project:
    const project = await Project.findById(id);
    await Task.deleteMany({ _id: project.tasks });

    // remove the project:
    await Project.findByIdAndRemove(id);
    res.json({ message: `Project with the id ${id} deleted successfully` });
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
 */
const express = require("express");
const router = express.Router();
module.exports = router