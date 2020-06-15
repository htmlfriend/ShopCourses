const { Router } = require("express");
const bcrypt = require("bcryptjs");
const router = Router();
const User = require("../models/user");

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Autorizion",
    isLogin: true,
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
  });
});

router.get("/logout", async (req, res) => {
  //clear session
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);
      if (areSame) {
        const user = candidate;
        req.session.user = user;
        req.session.isAuthenticated = true;

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("loginError", "Password is wrong");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "This user is not exist");
      res.redirect("/auth/login#login");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, repeat } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      // if email is busy Try to use another email
      req.flash("registerError", "This email is existed");
      res.redirect("/auth/login#register");
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email: email,
        name: name,
        password: hashPassword,
        cart: { items: [] },
      });
      await user.save();
      res.redirect("/auth/login#login");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
