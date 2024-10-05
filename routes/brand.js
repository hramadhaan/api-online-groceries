const express = require("express");
const multer = require("multer");

const brandControllers = require("../controllers/brand");
const { storageSpaces } = require("../services/storage-aws");

const router = express.Router();

router.post(
  "/add",
  multer({
    storage: storageSpaces("/brands"),
    limits: { fileSize: 1024 * 1024 * 2 },
  }).single("image"),
  brandControllers.createBrand
);

router.get("/delete/:id", brandControllers.deleteBrand);

router.get("/list", brandControllers.listBrand);

module.exports = router;
