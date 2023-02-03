const express = require("express");
const db = require("../database/database");
const router = express.Router();

async function dataRetrive(name) {
  arr = await db
    .getDB()
    .collection("recipe")
    .find({ category: name })
    .toArray();
  return arr;
}

router.get("/banchan", async function (req, res) {
  const banchan = await dataRetrive("Banchan");
  res.render("banchan", { banchans: banchan });
});
router.get("/jjigae", async function (req, res) {
  const jjigae = await dataRetrive("Jjigae");
  res.render("jjigae", { jjigaes: jjigae });
});
router.get("/ramyun", async function (req, res) {
  const ramyun = await dataRetrive("Ramyun");
  res.render("ramyun", { ramyuns: ramyun });
});
router.get("/gogi", async function (req, res) {
  const gogi = await dataRetrive("Gogi");
  res.render("gogi", { gogis: gogi });
});
router.get("/bob", async function (req, res) {
  const bob = await dataRetrive("Bob");
  res.render("bob", { bobs: bob });
});
router.get("/snack", async function (req, res) {
  const snack = await dataRetrive("Snack");
  res.render("snack", { snacks: snack });
});

router.get("/banchan/:name", async function (req, res) {
  console.log(req.params.name);
  const menuName = req.params.name; //id can be varied depends on url variable(:id) if it is :rid it should be paras.rid

  const menus = await dataRetrive("Banchan");
  console.log(menus);

  for (const menu of menus) {
    if (menu.title === menuName) {
      return res.render("menu-detail", { menu: menu });
    }
  }
  return res.status(404).render("404");
});
module.exports = router;
