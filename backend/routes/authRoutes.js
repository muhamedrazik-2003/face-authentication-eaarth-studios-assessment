const express = require("express");
const router = express.Router();
const authController = require('../controller/authController')
const upload = require("../middleware/multer");
const jwtMiddleware = require("../middleware/authMiddleware");

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
router.patch("/user/status",jwtMiddleware, authController.changeAccountStatus);
router.get("/users/all",jwtMiddleware, authController.getAllUsers);

module.exports = router;