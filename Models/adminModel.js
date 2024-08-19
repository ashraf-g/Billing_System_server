const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Admin schema
const adminSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String },
    isAdmin: { type: Boolean, required: true, unique: true, default: true },
    dateCreated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create and export the Admin model
module.exports = mongoose.model("Admin", adminSchema);
