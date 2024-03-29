const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const Recaptcha = require("recaptcha2");
const db = require("../database/database");

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storageConfig });
const router = express.Router();

const recaptcha = new Recaptcha({
  siteKey: "6LctRqwkAAAAAEw-TuBTasVIZKAeanmxi2Ca10-c",
  secretKey: "6LctRqwkAAAAAKnZ3kqS-OyggnKqVqGR8y7zjUxH",
});
// router.get("/signUp", function (req, res) {
//   let sessionInput = req.session.inputData;
//   if (!sessionInput) {
//     sessionInput = {
//       hasError: false,
//       message: "",
//       username: "",
//       password: "",
//       passwordConfirm: "",
//     };
//   }
//   req.session.inputData = null;

//   res.render("signUp", { inputData: sessionInput });
// });
// router.post("/signup", async function (req, res) {
//   const userData = req.body;
//   const enteredUserName = userData.userName;
//   const enteredPassword = userData.password;
//   const enteredPasswordConfirm = userData.confirmPassword;
//   if (
//     !enteredUserName ||
//     !enteredPassword ||
//     !enteredPasswordConfirm ||
//     enteredPassword.trim() < 8 ||
//     enteredPassword !== enteredPasswordConfirm
//   ) {
//     req.session.inputData = {
//       hasError: true,
//       message: "invalid input",
//       username: enteredUserName,
//       password: enteredPassword,
//       passwordConfirm: enteredPasswordConfirm,
//     };
//     req.session.save(function () {
//       return res.redirect("/signup");
//     });
//     return;
//   }
//   const exist = await db
//     .getDB()
//     .collection("users")
//     .findOne({ userName: enteredUserName });
//   if (exist) {
//     req.session.inputData = {
//       hasError: true,
//       message: "username already exist",
//       username: enteredUserName,
//       password: enteredPassword,
//       passwordConfirm: enteredPasswordConfirm,
//     };
//     req.session.save(function () {
//       return res.redirect("/signup");
//     });
//     return;
//   }
//   const hashPassword = await bcrypt.hash(enteredPassword, 3);
//   const user = {
//     userName: enteredUserName,
//     password: hashPassword,
//   };
//   await db.getDB().collection("users").insertOne(user);

//   res.redirect("/login");
// });
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
  const recaptchaResponse = req.body["g-recaptcha-response"];

  // Verify reCAPTCHA
  const recaptchaValid = await recaptcha
    .validate(recaptchaResponse)
    .catch(() => false);

  if (!recaptchaValid) {
    req.session.inputError = {
      hasError: true,
      message: "reCAPTCHA verification failed",
      username: enteredUserName,
    };
    req.session.save(function () {
      return res.redirect("/logIn");
    });
    return;
  }

  // Find user in database by entered user name
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

  // Verify password using bcrypt
  const passwordEqual = await bcrypt.compare(enteredPassword, exist.password);
  if (!passwordEqual) {
    req.session.inputError = {
      hasError: true,
      message: "Invalid Data",
      username: enteredUserName,
    };
    req.session.save(function () {
      return res.redirect("/logIn");
    });
    return;
  }

  // Set session user data and redirect to home page
  req.session.user = {
    id: exist._id,
    username: exist.userName,
  };
  req.session.loggedIn = true;
  req.session.save(function () {
    return res.redirect("/");
  });
});
router.get("/upload", function (req, res) {
  if (!res.locals.isAdmin) {
    return res.status(401).redirect("/");
  }

  res.render("upload");
});
router.post("/upload", function (req, res) {
  const steps = req.body.steps;
  res.render("uploadrecipe", { steps: steps });
});

router.post("/recipeUpload", upload.array("image"), async function (req, res) {
  const uploadFiles = req.files;
  const userData = req.body;
  const title = userData.title;
  const thumbnail = uploadFiles[0];
  const ingredientPicture = uploadFiles[1];
  const category = userData.category;
  const ingredient = userData.ingredient;
  const reference = userData.reference;
  const step = userData.step;
  let imgPath = [];

  for (let i = 2; i < uploadFiles.length; i++) {
    imgPath.push(uploadFiles[i].path);
  }

  await db.getDB().collection("recipe").insertOne({
    title: title,
    thumbnail: thumbnail,
    ingredientPicture: ingredientPicture,
    category: category,
    ingredient: ingredient,
    reference: reference,
    step: step,
    imgPath: imgPath,
  });
  res.redirect("/");
});
module.exports = router;
