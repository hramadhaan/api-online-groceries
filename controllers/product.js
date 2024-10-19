const { errorHandler } = require("../utils/error-handler");
const Product = require("../models/product");
const Stock = require("../models/stock");

exports.createProduct = async (req, res, next) => {
  try {
    errorHandler(req, res, next);
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const brand = req.body.brand;
    const category = req.body.category;
    const image = req.files;
    const sku = req.body.sku;
    const status = req.body.status;
    let imagesPath = [];
    if (image) {
      imagesPath = image.map((image) => image.location);
    }
    // Stock
    const minimumStock = req.body.minimumStock || 0;
    const stock = req.body.stock;
    let stockId;

    if (minimumStock || stock) {
      const stockData = new Stock({
        currentStock: Number(stock) || 0,
        minimumStock: Number(minimumStock),
      });

      const stockResponse = await stockData.save();
      stockId = stockResponse._id;
    }
    const product = new Product({
      name: name,
      description: description,
      price: Number(price),
      brand: brand,
      category: category,
      image: imagesPath,
      stock: stockId,
      sku: sku,
      status: status,
    });
    const response = await product.save();
    res
      .status(201)
      .json({ message: "Product created", data: response, error: false });
  } catch (error) {
    console.log("Hanif Error: ", error);
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(error);
  }
};

exports.listProduct = async (req, res, next) => {
  try {
    const product = await Product.find().populate([
      "category",
      "stock",
      "brand",
    ]);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: "Product found", data: product, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.showProductDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate([
      "brand",
      "category",
      "stock",
    ]);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: "Product found", data: product, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    if (product.image) {
      product.image.forEach(async (image) => {
        const filePath = image.replace(process.env.SPACES_URL, "");
        await s3
          .deleteObject({
            Bucket: process.env.SPACES_BUCKET,
            Key: filePath,
          })
          .promise();
      });
    }

    res
      .status(200)
      .json({ message: "Product deleted", data: product, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
