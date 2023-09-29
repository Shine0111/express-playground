"use strict";

var logger = require("./middleware/logger");

var authenticater = require("./middleware/authenticater");

var helmet = require("helmet");

var morgan = require("morgan");

var config = require("config");

var debug = require("debug")("app:startup");

var Joi = require("joi");

var express = require("express");

var app = express(); // Routes

var courses = require("./routes/courses");

var home = require("./routes/home"); // express will load the engine, no need to require


app.set("view engine", "pug");
app.set("views", "./views"); //default
// Configuration

console.log("Application name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host")); // console.log("Mail Password: " + config.get("mail.password"));
// Middlewares

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express["static"]("public"));
app.use(helmet());
app.use("/", home);
app.use("/api/courses", courses);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

app.use(logger);
app.use(authenticater); // dbDebugger

debug("Connected to the db ...");
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Listening on port ".concat(PORT, "..."));
});