"use strict";

var express = require("express");

var router = express.Router(); // GET

router.get("/", function (req, res) {
  res.render("index", {
    title: "My express app",
    message: "hello"
  });
});
module.exports = router;