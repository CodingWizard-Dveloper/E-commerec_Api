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

const generateTokens = (userId) => {
  if (!userId) {
    throw new Error("User is required to generate tokens");
  }

  // Create payload
  const payload = { userId };

  // Create access token with short expiry (15 minutes)
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

  // Create refresh token with long expiry (7 days)
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

const generateToken = (userId) => {
  if (!userId) {
    throw new Error("User is required to generate a token");
  }

  // Create payload (you can add more info if needed)
  const payload = { userId };

  // Create token with expiry (example: 15m for testing, change to longer for production)
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

  return token;
};

const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

module.exports = { authenticateToken, generateToken, generateTokens, verifyRefreshToken };
