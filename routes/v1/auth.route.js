const {
  getUser,
  createUser,
  login,
  createStore,
  changeUser,
  deleteStore,
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
  .patch(
    authenticateToken,
    validator(changeUser),
    upload.single("profileImage"),
    authController.changeUser
  );

router.route("/login").post(validator(login), authController.loginUser);

router.route("/refresh").post(authController.refreshToken);
module.exports = router;
