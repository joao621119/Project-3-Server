// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const { isAuthenticated } = require("./middleware/jwt.middleware");

// 👇 Start handling routes here

const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes")
app.use("/auth", authRoutes)

const profileRoutes = require("./routes/profile.routes")
app.use("/", profileRoutes)

const petRoutes = require("./routes/pets.routes")
app.use("/", petRoutes)

/* const commentRoutes = require("./routes/comments.routes")
app.use("/", commentRoutes) */

const associationRoutes = require("./routes/associations.routes")
app.use("/", associationRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
