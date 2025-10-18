const jwt = require("jsonwebtoken");
const { User } = require("../model/user.model");

const authenticateToken = async (req, res, next) => {
  const token = req.headers["accesstoken"]?.replace("Bearer ", "");
  const refreshToken = req.headers["refreshtoken"];

  // If no token is provided, return unauthorized
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    // First, try to verify the access token
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    // If access token is expired and we have a refresh token, try to refresh
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        // Verify the refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Check if user still exists and has this refresh token
        const userDoc = await User.findById(decoded.userId);
        if (!userDoc || userDoc.refreshToken !== refreshToken) {
          return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(
          userDoc._id
        );

        // Update user with new tokens
        userDoc.accessToken = accessToken;
        userDoc.refreshToken = newRefreshToken;
        await userDoc.save();

        // Set the new tokens in response headers for client to update
        res.setHeader("access-token", accessToken);
        res.setHeader("refresh-token", newRefreshToken);

        // Set the user in request and continue
        req.user = { userId: decoded.userId };
        next();
      } catch (refreshErr) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
    } else if (err.name === "TokenExpiredError" && !refreshToken) {
      // Token expired but no refresh token provided
      return res.status(401).json({ message: "Access token expired and no refresh token provided" });
    } else {
      // Other token errors (invalid, malformed, etc.)
      return res.status(401).json({ message: "Invalid access token" });
    }
  }
};

const generateTokens = (userId) => {
  if (!userId) {
    throw new Error("User is required to generate tokens");
  }

  // Create payload
  const payload = { userId };

  // Create access token with short expiry (15 minutes)
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  // Create refresh token with long expiry (5 years)
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "5y" }
  );

  return { accessToken, refreshToken };
};

const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
    return decoded;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

module.exports = { authenticateToken, generateTokens, verifyRefreshToken };
