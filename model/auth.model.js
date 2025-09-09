const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = new mongoose.Schema({
  userName: { type: String, required: true, unique: false },
  password: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, required: false },
  updatedAt: { type: Date, default: Date.now, required: false },
  accessToken: { type: String, required: false, unique: false },
  avatar: { type: JSON, required: false, unique: false },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
});

const store = new mongoose.Schema({
  storeName: { type: String, required: true },
  ownerId: { type: String, required: true, unique: true },
  storeImage: { type: JSON, required: false },
  createdAt: { type: Date, default: Date().now, required: false },
  updatedAt: { type: Date, default: Date().now, required: false },
  description: { type: String, required: true },
});

User.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const UserModel = mongoose.model("users", User);
const storeModel = mongoose.model("stores", store);

module.exports = {
  User: UserModel,
  Store: storeModel,
};
