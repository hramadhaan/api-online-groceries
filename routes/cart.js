const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const cartControllers = require("../controllers/cart");
const isAuth = require("../middleware/authentication");

router.post(
  "/add",
  [
    body("productId").not().isEmpty(),
    body("quantity").not().isEmpty(),
    body("quantity").isNumeric(),
  ],
  isAuth,
  cartControllers.addToCart
);
router.get("/list", isAuth, cartControllers.getCart);
router.post("/update", isAuth, cartControllers.updateCart);
router.post("/clear", isAuth, cartControllers.clearCart);

module.exports = router;
