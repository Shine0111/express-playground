const logger = require("./logger");
const authenticater = require("./authenticater");
const helmet = require("helmet");
const morgan = require("morgan");

const config = require("config");
require("debug")("app:startup");

const Joi = require("joi");
const express = require("express");
const app = express();

// Middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(helmet());

// Configuration
console.log("Application name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled...");
}

app.use(logger);

app.use(authenticater);

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

// GET

app.get("/", (req, res) => {
  res.send("Hello world!!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given id is not found");
  res.send(course);
});

// POST

app.post("/api/courses", (req, res) => {
  //Valid
  const { error } = validateCourse(req.body);
  //Invalid -> 400 - Bad Request
  if (error) {
    //400: Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

// PUT

app.put("/api/courses/:id", (req, res) => {
  //Look up the course
  //If not exist -> 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course with the given id is not found");
    return;
  }

  //Valid
  const { error } = validateCourse(req.body);
  //Invalid -> 400 - Bad Request
  if (error) {
    //400: Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }

  //Update the course and return the updated course to the client
  course.name = req.body.name;
  res.send(course);
});

// DELETE

app.delete("/api/courses/:id", (req, res) => {
  // Look up the course
  // Not exist -> 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course with the given id is not found");
    return;
  }

  // delete course
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  // return the deleted course
  res.send(course);
});

// UTILITY FUNCTIONS

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
