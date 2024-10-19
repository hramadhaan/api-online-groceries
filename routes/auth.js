const express = require("express");
const { body } = require("express-validator");
const authControllers = require("../controllers/auth");
const router = express.Router();

router.post(
  "/login",
  [body("email").not().isEmpty(), body("password").not().isEmpty()],
  authControllers.loginAccount
);

router.post(
  "/register",
  [
    body("name").not().isEmpty(),
    body("email")
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      }),
    body("password").not().isEmpty(),
    body("phone")
      .not()
      .isEmpty()
      .custom((value) => {
        if (value.length < 10) {
          throw new Error("Phone number must be at least 10 characters");
        }
        return true;
      }),
    body("role").not().isEmpty(),
  ],
  authControllers.registerAccount
);

module.exports = router;
