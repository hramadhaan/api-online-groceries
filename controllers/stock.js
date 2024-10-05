const { errorHandler } = require("../utils/error-handler");
const Product = require("../models/product");

exports.changeStockOnProduct = async (req, res, next) => {
  try {
    errorHandler(req, res, next);

    const { id, newStock, newMinimumStock } = req.body;

    const product = await Product.findById(id);

    if (newStock) {
      product.currentStock = product.currentStock + Number(newStock);
    }

    if (newMinimumStock) {
      product.minimumStock = newMinimumStock;
    }

    const response = await product.save();

    res
      .status(200)
      .json({ message: "Stock updated", product: response, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
