const { body } = require("express-validator/check");
const User = require("../models/user");

// use sanitization with validator.js
exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Enter valid email")
    .custom(async (value, { req }) => {
      try {
        const candidate = await User.findOne({ email: value });
        if (candidate) {
          return Promise.reject("User with this email exists");
        }
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail(),
  body("password", "Passwort will be more than 6 symbols")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password not the same");
      }
      return true;
    })
    .trim(),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name needs to be more than 3 symbols")
    .trim(),
];

exports.loginValidator = [];

exports.courseValidators = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Min length of name is 3 symbols")
    .trim(),
  body("price").isNumeric().withMessage("Enter correct price"),
  body("img", "Enter correct url of the picture").isURL(),
];
