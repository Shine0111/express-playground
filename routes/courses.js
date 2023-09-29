const express = require("express");
const router = express.Router();

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

router.get("/", (req, res) => {
  res.send(courses);
});

router.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given id is not found");
  res.send(course);
});

// POST

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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

module.exports = router;
