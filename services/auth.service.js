const { generateToken } = require("../config/Tokens");
const { User, Store } = require("../model/auth.model");
const bcrypt = require("bcryptjs");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

const createUser = async (credentials) => {
  const { userName, password, email, profileImage } = credentials;

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

  const cloudResult = await cloudinary.uploader.upload(profileImage.path);

  newUser.avatar = {
    url: cloudResult?.secure_url,
    publicId: cloudResult?.public_id,
  };

  await newUser.save();

  // Delete the temporary file after successful upload to Cloudinary
  fs.unlink(profileImage.path, (err) => {
    if (err) {
      console.error("Error deleting temporary file:", err);
    } else {
      console.log("Temporary file deleted successfully:", profileImage.path);
    }
  });

  return { status: 200, response: { message: "User Created", token: Token } };
};

const getUser = async (userId) => {
  const myUser = await User.findById(userId);

  if (!myUser) {
    return {
      status: 400,
      data: { message: "An error made", user: null },
    };
  }

  const userToSend = myUser.toObject();

  delete userToSend.password;

  userToSend.avatar = userToSend?.avatar?.url;

  const userStore = await Store.findById(userToSend.storeId);
  if (userStore) {
    userToSend.store = await Store.findById(userToSend.storeId);
    userToSend.store.storeImage = userToSend?.store?.storeImage?.url;
    delete userToSend.storeId;
  }
  return {
    status: 201,
    data: { message: "User exists", user: userToSend },
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

    const verifyPass = await bcrypt.compare(password, isUser.password);

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

const createStore = async (data) => {
  try {
    const { storeName, description, ownerId, storeImage } = data;

    const existingStore = await Store.find({ storeName });
    const existingOwner = await User.findById(ownerId);

    if (existingOwner.storeId) {
      return {
        response: { message: "You are already the owner of a store" },
        status: 401,
      };
    }

    if (existingStore.length) {
      return {
        response: { message: "Store with this name already exists" },
        status: 409,
      };
    }

    const newStore = await Store.create({
      storeName,
      ownerId,
      description,
    });

    const cloudResult = await cloudinary.uploader.upload(storeImage.path);

    newStore.storeImage = {
      url: cloudResult?.secure_url,
      publicId: cloudResult?.public_id,
    };

    await newStore.save();

    const updatedUser = await User.findByIdAndUpdate(
      ownerId,
      { $set: { storeId: newStore._id } },
      { new: true, runValidators: true }
    );

    return {
      response: { message: "Store created successfully", user: updatedUser },
      status: 200,
    };
  } catch (e) {
    return {
      response: { message: `Unknown Error: ${e.message}` },
      status: 400,
    };
  }
};

const changeUser = async (data) => {
  const { userId, userName, email, password, profileImage, avatar } = data;

  const thisUser = await User.findById(userId);

  const updateData = {};

  if (thisUser.userName !== userName) {
    updateData.userName = userName;
  }

  if (thisUser.email !== email) {
    updateData.email = email;
  }

  if (password && !(await bcrypt.compare(password, thisUser.password))) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  if (avatar !== thisUser?.avatar?.url) {
    cloudinary.uploader.destroy(thisUser?.avatar?.publicId);
    const cloudResult = await cloudinary.uploader.upload(profileImage.path);
    updateData.storeImage = {
      url: cloudResult?.secure_url,
      publicId: cloudResult?.public_id,
    };
  }

  // Only update if there are changes
  if (Object.keys(updateData).length > 0) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    const user = await getUser(thisUser._id);

    return {
      status: 200,
      response: {
        message: "User updated successfully",
        user: user?.data?.user,
      },
    };
  }

  return {
    status: 200,
    response: { message: "No changes detected" },
  };
};

module.exports = {
  createUser,
  getUser,
  createStore,
  loginUser,
  changeUser,
};
