const express = require("express");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("index");
});

router.get("/about", function (req, res) {
  res.render("about");
});

router.get("/logIn", function (req, res) {
  res.render("logIn");
});
router.get("/contact", function (req, res) {
  res.render("contact");
});

router.get("/search", function (req, res) {
  res.render("search");
});

module.exports = router;
