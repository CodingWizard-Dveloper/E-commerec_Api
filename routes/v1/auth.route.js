const {
  getUser,
  createUser,
  login,
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

module.exports = router;
