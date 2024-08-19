const express = require("express");

const router = express.Router();

// import Controller
const {
  createAdmin,
  loginAdmin,
  updateAdmin,
  changePassword,
  sendOtp,
  verifyOtp,
  resetPassword,
} = require("../Controllers/adminController");

// create admin
router.post("/admin/create", createAdmin);

// login admin
router.post("/admin/login", loginAdmin);

// update admin
router.put("/admin/update/:id", updateAdmin);

// change password
router.put("/admin/change-password/:id", changePassword);

// send OTP
router.post("/admin/send-otp", sendOtp);

// verify OTP
router.post("/admin/verify-otp", verifyOtp);

// reset password
router.put("/admin/reset-password", resetPassword);

module.exports = router;

// End of File: server\routes\adminRoutes.js
