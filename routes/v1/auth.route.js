const {
  getUser,
  createUser,
  login,
  createStore,
  getStore,
} = require("../../validation/auth.validation");
const validator = require("../../config/validator");
const { authenticateToken } = require("../../config/Tokens");
const { authController } = require("../../controller");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .get(authenticateToken, validator(getUser), authController.getUser)
  .post(
    validator(createUser),
    upload.single("profileImage"),
    authController.createUser
  )
  .patch(validator(login), authController.loginUser);

router
  .route("/workspace")
  .post(
    authenticateToken,
    upload.single("storeImage"),
    validator(createStore),
    authController.createStore
  )
module.exports = router;
