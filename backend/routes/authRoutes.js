const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { upload } = require("../middleware/multer");

router.post("/verify-user", authController.VerfiyExistingUser);
router.post(
  "/register",
  upload.fields([
    { name: "idImage", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  authController.registerUser
);

router.post("/login-face-auth",upload.single('selfie'), authController.loginWithFaceAuthentication);

module.exports = router;