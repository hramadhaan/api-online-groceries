const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");

const productControllers = require("../controllers/product");
const { storageSpaces } = require("../services/storage-aws");
const isAuth = require("../middleware/authentication");

const router = express.Router();

router.post(
  "/add",
  multer({
    storage: storageSpaces("/products"),
    limits: { fileSize: 1024 * 1024 * 2 },
  }).array("images", 5),
  [
    body("name").not().isEmpty(),
    body("price").not().isEmpty(),
    body("category").not().isEmpty(),
  ],
  isAuth,
  productControllers.createProduct
);

router.get("/list", productControllers.listProduct);

module.exports = router;
