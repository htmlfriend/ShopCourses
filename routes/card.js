const { Router } = require("express");
const Card = require("../models/card");
const Courses = require("../models/course");

const router = Router();

router.post("/add", async (req, res) => {
  const courseID = await Courses.getById(req.body.id);
  await Card.add(courseID);
  res.redirect("/card");
});

router.get("/", async (req, res) => {
  const card = await Card.fetch();

  res.render("card", {
    title: "Cart",
    isCard: true,
    courses: card.courses,
    price: card.price,
  });
});

router.delete("/remove/:id", async (req, res) => {
  const card = await Card.remove(req.params.id);
  res.status(200).json(card);
});
module.exports = router;
