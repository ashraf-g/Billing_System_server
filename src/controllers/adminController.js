const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const otpGenerator = require("otp-generator");
const { sendOtp } = require("../Utils/mail");

//! Create a new admin
exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // empty fields validation
    await Promise.all([
      body("username", "Enter a valid username").isLength({ min: 3 }),
      body("email", "Enter a valid email").isEmail().run(req),
      body("password", "Password must be at least 5 characters").isLength({
        min: 5,
      }),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username already exists" });
    }
    // Check if the email already exists
    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = new Admin({ username, email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.error(error);
  }
};

//! Login
exports.signIn = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Validate request fields
    if (!identifier || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // identify the user by email or username
    const admin = await Admin.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    // If user not found, return an error
    if (!admin) return res.status(401).json({ error: "User Not Found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiry
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.error(error);
  }
};

//! Update admin details
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    const updatedAdmin = {};

    // Update admin fields
    if (username) updatedAdmin.username = username;
    if (email) updatedAdmin.email = email;

    // Update admin
    await Admin.findByIdAndUpdate(id, updatedAdmin, { new: true });

    res.json({ message: "Admin details updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.error(error);
  }
};

//! Change password

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Find admin by id
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//! send otp

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate request fields
    if (!email) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // find email
    const admin = await Admin.findOne({ email });
    // If user not found, return an error
    if (!admin) return res.status(401).json({ error: "User Not Found" });
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialCharacters: false,
      digits: true,
    });
    admin.otp = otp;
    await admin.save();
    await sendOtp(admin, otp);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.error(error);
  }
};

//! verify otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    // Validate request fields
    if (!email || !otp) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // find email
    const admin = await Admin.findOne({ email });
    // If user not found, return an error
    if (!admin) return res.status(401).json({ error: "User Not Found" });
    if (admin.otp === otp) {
      res.json({ message: "OTP verified successfully" });
      admin.otp = null;
      await admin.save();
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};

//! reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate request fields
    if (!email || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // find email
    const admin = await Admin.findOne({ email });
    // If user not found, return an error
    if (!admin) return res.status(401).json({ error: "User Not Found" });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
