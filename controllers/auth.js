const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/error-handler");

exports.registerAccount = async (req, res, next) => {
  try {
    errorHandler(req, res, next);
    const { name, email, password, phone, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      role: role,
    });
    await user.save();
    res.status(201).json({ message: "User created", data: user, error: false });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.loginAccount = async (req, res, next) => {
  try {
    errorHandler(req, res, next);
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET_KEY
    );
    res.status(200).json({
      message: "Login success",
      data: {
        user,
        token,
      },
      error: false,
    });
  } catch (error) {
    if (!res.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
