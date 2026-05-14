const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  saveUserDetails,
  getProfile,
  upload
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware"); // token verify middleware

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Forgot Password with OTP
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Save user details (only for logged-in users)
router.post("/details", protect, saveUserDetails);

// Fetch logged-in user profile
router.get("/profile", protect, getProfile);

module.exports = router;
