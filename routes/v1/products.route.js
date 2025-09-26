const router = require("express").Router();
const { authenticateToken } = require("../../config/Tokens");
const validator = require("../../config/validator");
const { getProducts } = require("../../validation/product.vlidation");
const { productController } = require("../../controller");

router
  .route("/")
  .get(
    validator(getProducts),
    productController.getAllProducts
  );

module.exports = router;
