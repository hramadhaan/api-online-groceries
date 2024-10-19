const express = require("express");
const multer = require("multer");
// const { body } = require("express-validator");

const categoryControllers = require("../controllers/category");
const { storageSpaces } = require("../services/storage-aws");
const isAuth = require("../middleware/authentication");

const router = express.Router();

router.post(
  "/add",
  multer({
    storage: storageSpaces("/categories"),
    limits: { fileSize: 1024 * 1024 * 2 },
  }).single("image"),
  isAuth,
  categoryControllers.createCategory
);

router.get("/delete/:id", isAuth, categoryControllers.deleteCategory);

router.get("/list/:id?", categoryControllers.listCategory);

module.exports = router;
