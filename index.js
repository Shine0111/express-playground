const logger = require("./middleware/logger");
const authenticater = require("./middleware/authenticater");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const debug = require("debug")("app:startup");
const Joi = require("joi");
const express = require("express");
const app = express();
// Routes
const courses = require("./routes/courses");
const home = require("./routes/home");

// express will load the engine, no need to require
app.set("view engine", "pug");
app.set("views", "./views"); //default

// Configuration
console.log("Application name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
// console.log("Mail Password: " + config.get("mail.password"));

// Middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(helmet());
app.use("/", home);
app.use("/api/courses", courses);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}
app.use(logger);
app.use(authenticater);

// dbDebugger
debug("Connected to the db ...");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
