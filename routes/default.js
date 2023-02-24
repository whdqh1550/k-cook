const express = require("express");

const db = require("../database/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("index");
});

router.get("/about", function (req, res) {
  res.render("about");
});

router.get("/contact", function (req, res) {
  res.render("contact");
});

router.get("/search", async function (req, res) {
  const { keyword } = req.query;
  let recipe = [];
  if (keyword) {
    recipe = await db
      .getDB()
      .collection("recipe")
      .find({
        title: {
          $regex: new RegExp(keyword, "i"),
        },
      })
      .toArray();
  }

  res.render("search", { recipes: recipe });
});

router.post("/logout", function (req, res) {
  req.session.user = null;
  req.session.loggedIn = false;
  req.session.destroy(function () {
    res.redirect("/");
  });
});

module.exports = router;
