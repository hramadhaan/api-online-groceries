const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization",
    });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(authHeader, process.env.JWT_SECRET_KEY);
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (!decodedToken) {
    res.status(401).json({
      success: false,
      message: "Please provie that the token",
    });
  }

  req.userId = decodedToken.userId;
  req.role = decodedToken.role;
  next();
};
