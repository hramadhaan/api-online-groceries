const Cart = require("../models/cart");
const Product = require("../models/product");

exports.addToCart = async (req, res, next) => {
  try {
    const { product, quantity } = req.body;
    const checkProduct = await Product.findById(product);
    if (!checkProduct) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      const newCart = new Cart({
        user: req.userId,
        items: [{ product, quantity }],
        totalProducts: quantity,
        totalPrice: checkProduct.price * quantity,
      });
      await newCart.save();
      res.status(201).json({
        message: "Product added to cart",
        data: newCart,
        error: false,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (p) => p.product.toString() === product
      );
      if (itemIndex > -1) {
        let productItem = cart.items[itemIndex];
        productItem.quantity = quantity;
        cart.items[itemIndex] = productItem;
        cart.totalProducts = cart.totalProducts + quantity;
        cart.totalPrice = cart.totalPrice + checkProduct.price * quantity;
      } else {
        cart.items.push({ product, quantity });
        cart.totalProducts = cart.totalProducts + quantity;
        cart.totalPrice = cart.totalPrice + checkProduct.price * quantity;
      }
      await cart.save();
      res
        .status(200)
        .json({ message: "Product added to cart", data: cart, error: false });
    }
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate([
      "items.product",
    ]);
    res.status(200).json({ message: "Cart found", data: cart, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndRemove({ user: req.userId });
    if (!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Cart cleared", data: cart, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const { product, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404;
      throw error;
    }
    const itemIndex = cart.items.findIndex(
      (p) => p.product.toString() === product
    );
    if (itemIndex > -1) {
      let productItem = cart.items[itemIndex];
      productItem.quantity = quantity;
      cart.items[itemIndex] = productItem;
      cart.totalProducts = quantity;
      cart.totalPrice = productItem.price * quantity;
    }
    await cart.save();
    res.status(200).json({ message: "Cart updated", data: cart, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
