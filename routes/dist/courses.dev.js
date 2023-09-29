"use strict";

var express = require("express");

var router = express.Router();
var courses = [{
  id: 1,
  name: "course1"
}, {
  id: 2,
  name: "course2"
}, {
  id: 3,
  name: "course3"
}];
router.get("/", function (req, res) {
  res.send(courses);
});
router.get("/:id", function (req, res) {
  var course = courses.find(function (c) {
    return c.id === parseInt(req.params.id);
  });
  if (!course) res.status(404).send("The course with the given id is not found");
  res.send(course);
}); // POST

router.post("/", function (req, res) {
  //Valid
  var _validateCourse = validateCourse(req.body),
      error = _validateCourse.error; //Invalid -> 400 - Bad Request


  if (error) {
    //400: Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }

  var course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
}); // PUT

router.put("/:id", function (req, res) {
  //Look up the course
  //If not exist -> 404
  var course = courses.find(function (c) {
    return c.id === parseInt(req.params.id);
  });

  if (!course) {
    res.status(404).send("The course with the given id is not found");
    return;
  } //Valid


  var _validateCourse2 = validateCourse(req.body),
      error = _validateCourse2.error; //Invalid -> 400 - Bad Request


  if (error) {
    //400: Bad Request
    res.status(400).send(error.details[0].message);
    return;
  } //Update the course and return the updated course to the client


  course.name = req.body.name;
  res.send(course);
}); // DELETE

router["delete"]("/:id", function (req, res) {
  // Look up the course
  // Not exist -> 404
  var course = courses.find(function (c) {
    return c.id === parseInt(req.params.id);
  });

  if (!course) {
    res.status(404).send("The course with the given id is not found");
    return;
  } // delete course


  var index = courses.indexOf(course);
  courses.splice(index, 1); // return the deleted course

  res.send(course);
}); // UTILITY FUNCTIONS

function validateCourse(course) {
  var schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(course, schema);
}

module.exports = router;