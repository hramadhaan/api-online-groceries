const Category = require("../models/category");
const Product = require("../models/product");
const { s3 } = require("../services/storage-aws");
const { errorHandler } = require("../utils/error-handler");

exports.createCategory = async (req, res, next) => {
  try {
    errorHandler(req, res, next);

    const name = req.body.name;
    const level = req.body.level;
    const parent = req.body.parent;
    const image = req.file;

    const imagePath = req.file ? image.location : "";

    if (level && Number(level) > 3) {
      const error = new Error("Maximum level is 3");
      error.statusCode = 400;
      throw error;
    }

    const category = new Category({
      name: name,
      level: level,
      parent: parent,
      image: imagePath,
    });
    await category.save();
    res
      .status(201)
      .json({ message: "Category created", category: category, error: false });
  } catch (error) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(error);
  }
};

exports.listCategory = async (req, res, next) => {
  const id = req.params.id ?? null;
  try {
    const category = await Category.find({ parent: id })
      .populate({
        path: "children",
        populate: {
          path: "children",
          model: "Category",
        },
      })
      .exec();
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: "Category found", category: category, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }
    if (category?.image) {
      const filePath = category.image.replace(process.env.SPACES_URL, "");
      const params = {
        Bucket: process.env.SPACES_BUCKET,
        Key: filePath,
      };
      await s3.deleteObject(params).promise();
    }

    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted", error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.productByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    const products = await Product.find({ category: categoryId }).populate([
      "brand",
      "category",
      "stock",
    ]);
    if (!products) {
      const error = new Error("Products not found");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: "Products found", category: products, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
