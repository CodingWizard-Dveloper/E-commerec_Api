const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");

  if (token == null) return res.status(401).json({ message: "unAuthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "unAuthorized" });
    req.user = user;
    next();
  });
};

const generateToken = (userId) => {
  if (!userId) {
    throw new Error("User is required to generate a token");
  }

  // Create payload (you can add more info if needed)
  const payload = { userId };

  // Create token with expiry (example: 1h)
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  return token;
};

module.exports = { authenticateToken, generateToken };
