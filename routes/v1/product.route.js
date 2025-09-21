const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const validator = require("../../config/validator");
const { authenticateToken } = require("../../config/Tokens");
const {
  addProduct,
  getProducts,
} = require("../../validation/product.vlidation");
const { productController } = require("../../controller");

router
  .route("/")
  .post(
    authenticateToken,
    upload.single("productImage"),
    validator(addProduct),
    productController.addProduct
  )
  .get(authenticateToken, validator(getProducts), productController.getProduct);

module.exports = router;
