const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.log("No token found in headers");
    return res.status(401).json({ msg: "Not authorized" });
  }
  console.log("Received Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      console.log("User not found in database");
      return res.status(401).json({ msg: "Invalid token" });
    }

    next();
  } catch (err) {
    console.log("JWT Verification Error:", err.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// Restrict to event owners
exports.ownership = (model) => async (req, res, next) => {
  const doc = await model.findById(req.params.id);
  if (doc.owner.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ msg: "Not authorized to modify this resource" });
  }
  next();
};
