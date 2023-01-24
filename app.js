const path = require("path");

const express = require("express");

const defaultRouter = require("./routes/default");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", defaultRouter);

app.listen(1550);
