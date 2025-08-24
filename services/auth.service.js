const { generateToken } = require("../config/Tokens");
const { User } = require("../model/auth.model");
const bcrypt = require("bcryptjs");

const createUser = async (credentials) => {
  const { userName, password, email } = credentials;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      response: { message: "User already exists", token: null },
      status: 409,
    };
  }

  const newUser = await User.create({
    userName,
    password,
    email,
  });

  const Token = generateToken(newUser._id);

  newUser.accessToken = Token;

  await newUser.save();

  return { status: 200, response: { message: "User Created", token: Token } };
};

const getUser = async (userId) => {
  const myUser = await User.findById(userId);

  if (myUser) {
    return {
      status: 201,
      data: { message: "User exists", user: myUser },
    };
  }

  return {
    status: 400,
    data: { message: "An error made", user: null },
  };
};

const loginUser = async (credentials) => {
  const { email, password } = credentials;

  try {
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return {
        status: 403,
        data: { message: "User Does not Exist", token: null },
      };
    }

    // Debug logs to check password comparison
    console.log("Input password:", password);
    console.log("Stored hash:", isUser.password);

    const verifyPass = await bcrypt.compare(password, isUser.password);
    console.log("Password verification result:", verifyPass);

    if (!verifyPass) {
      return {
        status: 402,
        data: { message: "Invalid Password", token: null },
      };
    }

    // Generate new token on each login for security
    const newToken = generateToken(isUser._id);

    // Update user with new token
    isUser.accessToken = newToken;
    await isUser.save();

    return {
      status: 200,
      data: {
        message: "Successfully Logged In",
        token: newToken,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      status: 500,
      data: { message: "Internal server error", token: null },
    };
  }
};

module.exports = {
  createUser,
  getUser,
  loginUser,
};
