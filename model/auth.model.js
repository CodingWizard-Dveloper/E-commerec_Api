const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { required } = require("joi");

const User = new mongoose.Schema({
  userName: { type: String, required: true, unique: false },
  password: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
  accessToken: { type: String, required: false, unique: true },
});

User.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const UserModel = mongoose.model("users", User);

module.exports = {
  User: UserModel,
};
