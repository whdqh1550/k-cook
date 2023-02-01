const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/database");
const { renderFile } = require("ejs");
const { ExplainVerbosity } = require("mongodb");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("index");
});

router.get("/about", function (req, res) {
  res.render("about");
});

router.get("/signUp", function (req, res) {
  let sessionInput = req.session.inputData;
  if (!sessionInput) {
    sessionInput = {
      hasError: false,
      message: "",
      username: "",
      password: "",
      passwordConfirm: "",
    };
  }
  req.session.inputData = null;

  res.render("signUp", { inputData: sessionInput });
});
router.post("/signup", async function (req, res) {
  const userData = req.body;
  const enteredUserName = userData.userName;
  const enteredPassword = userData.password;
  const enteredPasswordConfirm = userData.confirmPassword;
  if (
    !enteredUserName ||
    !enteredPassword ||
    !enteredPasswordConfirm ||
    enteredPassword.trim() < 8 ||
    enteredPassword !== enteredPasswordConfirm
  ) {
    req.session.inputData = {
      hasError: true,
      message: "invalid input",
      username: enteredUserName,
      password: enteredPassword,
      passwordConfirm: enteredPasswordConfirm,
    };
    req.session.save(function () {
      return res.redirect("/signup");
    });
    return;
  }
  const exist = await db
    .getDB()
    .collection("users")
    .findOne({ userName: enteredUserName });
  if (exist) {
    req.session.inputData = {
      hasError: true,
      message: "username already exist",
      username: enteredUserName,
      password: enteredPassword,
      passwordConfirm: enteredPasswordConfirm,
    };
    req.session.save(function () {
      return res.redirect("/signup");
    });
    return;
  }
  const hashPassword = await bcrypt.hash(enteredPassword, 3);
  const user = {
    userName: enteredUserName,
    password: hashPassword,
  };
  await db.getDB().collection("users").insertOne(user);

  res.redirect("/login");
});

router.get("/logIn", function (req, res) {
  let sessionInput = req.session.inputError;
  if (!sessionInput) {
    sessionInput = {
      hasError: false,
      message: "",
    };
  }
  req.session.inputError = null;

  res.render("logIn", { inputData: sessionInput });
});
router.post("/logIn", async function (req, res) {
  const userData = req.body;
  const enteredUserName = userData.userName;
  const enteredPassword = userData.password;
  const exist = await db
    .getDB()
    .collection("users")
    .findOne({ userName: enteredUserName });
  if (!exist) {
    req.session.inputError = {
      hasError: true,
      message: "Invalid data",
      username: enteredUserName,
    };
    req.session.save(function () {
      return res.redirect("/logIn");
    });
    return;
  }
  const passwordEqual = await bcrypt.compare(enteredPassword, exist.password);
  if (!passwordEqual) {
    req.session.inputError = {
      hasError: true,
      message: "testing",
      username: enteredUserName,
    };
    req.session.save(function () {
      return res.redirect("/logIn");
    });
    return;
  }
  req.session.user = {
    id: exist._id,
    username: exist.userName,
  };
  req.session.loggedIn = true;

  res.redirect("/");
});

router.get("/contact", function (req, res) {
  res.render("contact");
});

router.get("/search", function (req, res) {
  res.render("search");
});

router.post("/logout", function (req, res) {
  req.session.user = null;
  req.session.loggedIn = false;
  req.session.destroy(function () {
    res.redirect("/");
  });
});

module.exports = router;
