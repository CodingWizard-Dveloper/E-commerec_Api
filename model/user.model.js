const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = new mongoose.Schema({
  userName: { type: String, required: true, unique: false },
  password: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, default: Date.now(), required: false },
  accessToken: { type: String, required: false, unique: false },
  avatar: { type: JSON, required: false, unique: false },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
});

const Store = new mongoose.Schema({
  storeName: { type: String, required: true },
  ownerId: { type: String, required: true, unique: true },
  storeImage: { type: JSON, required: false },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, default: Date.now(), required: false },
  description: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["electronics", "fashion", "living", "cosmetics", "books", "sports"],
  },
  itemSelled: { type: Number, required: false },
  totalRevenue: { type: Number, required: false },
  customers: { type: JSON, required: false },
});

const products = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true, min: 6, max: 60 },
  productImage: { type: JSON, required: false },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, default: Date().now, required: false },
  storeId: { type: String, required: true },
  ownerId: { type: String, required: true },
  totalProducts: { type: Number, required: true },
  price: { type: Number, required: true },
  type: {
    type: String,
    required: true,
    enum: ["electronics", "fashion", "living", "cosmetics", "books", "sports"],
  },
  itemSelled: { type: Number, required: false },
});

User.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const UserModel = mongoose.model("users", User);
const storeModel = mongoose.model("stores", Store);
const productModel = mongoose.model("products", products);

module.exports = {
  User: UserModel,
  Store: storeModel,
  Product: productModel,
};
