const jwt = require("jsonwebtoken");

// check if Token exists on request Header and attach token to request as attribute
exports.checkTokenMW = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    req.token = bearerHeader.split(" ")[1];
    next();
  } else {
    res.sendStatus(403);
  }
};

// Verify Token validity and attach token data as request attribute
exports.verifyToken = async (req, res) => {
  return jwt.verify(req.headers.authorization.slice(7), "secretkey");
};

// Issue Token
exports.signToken = (req, res) => {
  console.log("Logged user", req.user);
  return jwt.sign({ userId: req.user._id }, "secretkey", {
    expiresIn: "10 min",
  });
};
