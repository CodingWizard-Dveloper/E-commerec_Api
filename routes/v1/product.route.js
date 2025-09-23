const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const validator = require("../../config/validator");
const { authenticateToken } = require("../../config/Tokens");
const {
  addProduct,
  getProducts,
  deleteProduct,
} = require("../../validation/product.vlidation");
const { productController } = require("../../controller");

router
  .route("/:storeId")
  .post(
    authenticateToken,
    upload.single("productImage"),
    validator(addProduct),
    productController.addProduct
  )
  .get(
    authenticateToken,
    validator(getProducts),
    productController.getProductsForAdmin
  );

router
  .route("/:storeId/:productId")
  .delete(
    authenticateToken,
    validator(deleteProduct),
    productController.deleteProduct
  );

module.exports = router;
