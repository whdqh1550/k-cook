const path = require("path");

const express = require("express");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");

const db = require("./database/database");
const MongoDBStore = mongodbStore(session);

const defaultRouter = require("./routes/default");
const menuRouter = require("./routes/menu");

const app = express();

const sessionStore = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017",
  databaseName: "kCook",
  collection: "sessions",
});

app.use(express.static("public"));
app.use("/images", express.static("images"));

app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "dreamer",
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 30,
    },
    store: sessionStore,
  })
);

app.use(async function (req, res, next) {
  const user = req.session.user;
  const loggedIn = req.session.loggedIn;
  if (!loggedIn || !user) {
    return next();
  }
  const member = await db.getDB().collection("users").findOne({ _id: user.id });
  const isAdmin = member.isAdmin;

  res.locals.loggedIn = loggedIn;
  res.locals.isAdmin = isAdmin;

  next();
});

app.use("/", defaultRouter);
app.use("/", menuRouter);

app.use(function (req, res) {
  res.status(404).render("404");
});
app.use(function (error, req, res, next) {
  res.render("500");
});

db.connectToDb().then(function () {
  app.listen(1550);
});
