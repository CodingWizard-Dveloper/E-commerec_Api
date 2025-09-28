const router = require("express").Router();
const { authenticateToken } = require("../../config/Tokens");
const validator = require("../../config/validator");
const {
  getProducts,
  getProduct,
} = require("../../validation/product.vlidation");
const { productController } = require("../../controller");

router.route("/").get(validator(getProducts), productController.getAllProducts);

router.route("/:id").get(validator(getProduct), productController.getProduct)

module.exports = router;
