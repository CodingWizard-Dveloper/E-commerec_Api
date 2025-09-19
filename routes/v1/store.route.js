const {
  createStore,
  deleteStore,
  updateStore,
  getStore,
} = require("../../validation/store.validation");
const validator = require("../../config/validator");
const { authenticateToken } = require("../../config/Tokens");
const { storeController } = require("../../controller");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .get(
    authenticateToken,
    validator(getStore),
    storeController.getStore
  )
  .post(
    authenticateToken,
    upload.single("storeImage"),
    validator(createStore),
    storeController.createStore
  )
  .delete(
    authenticateToken,
    validator(deleteStore),
    storeController.deleteStore
  )
  .patch(
    authenticateToken,
    upload.single("storeImage"),
    validator(updateStore),
    storeController.updateStore
  )

module.exports = router;
