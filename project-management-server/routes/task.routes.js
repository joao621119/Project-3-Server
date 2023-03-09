/* const router = require("express").Router();

// Import the model
const Task = require("../models/Task.model");
const Project = require("../models/Project.model");

// Create

router.post("/tasks", async (req, res, next) => {
  // The task needs to relate to the Id of a specific project
  const { title, description, project } = req.body;

  try {
    const task = await Task.create({ title, description, project });

    // Pass the task inside the project
    await Project.findByIdAndUpdate(project, { $push: { tasks: task._id } });

    res.json(task);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
 */
const express = require("express");
const router = express.Router();
module.exports = router