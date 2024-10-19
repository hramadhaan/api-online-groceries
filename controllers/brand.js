const Brand = require("../models/brand");
const Product = require("../models/product");
const { s3 } = require("../services/storage-aws");
const { errorHandler } = require("../utils/error-handler");

exports.createBrand = async (req, res, next) => {
  try {
    errorHandler(req, res, next);
    const name = req.body.name;
    const icon = req.file;
    const imagePath = req.file ? icon.location : "";
    const brand = new Brand({
      name: name,
      icon: imagePath,
    });
    await brand.save();
    res
      .status(201)
      .json({ message: "Brand created", data: brand, error: false });
  } catch (error) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(error);
  }
};

exports.listBrand = async (req, res, next) => {
  try {
    const brand = await Brand.find();
    if (!brand) {
      const error = new Error("Brand not found");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: "Brand found", data: brand, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndRemove(req.params.id);
    if (!brand) {
      const error = new Error("Brand not found");
      error.statusCode = 404;
      throw error;
    }

    if (brand.icon) {
      const filePath = brand.icon.replace(process.env.SPACES_URL, "");
      await s3
        .deleteObject({
          Bucket: process.env.SPACES_BUCKET,
          Key: filePath,
        })
        .promise();
    }
    res
      .status(200)
      .json({ message: "Brand deleted", data: brand, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.productsByBrand = async (req, res, next) => {
  try {
    const brandId = req.params.id;
    const brand = await Brand.findById(brandId);
    if (!brand) {
      const error = new Error("Brand not found");
      error.statusCode = 404;
      throw error;
    }

    const products = await Product.find({ brand: brandId }).populate([
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
      .json({ message: "Products found", data: products, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
