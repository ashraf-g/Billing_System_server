const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Admin = require("../Models/adminModel");

dotenv.config();
// Create transporter using Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Send OTP
exports.sendOtp = async (admin, otp) => {
  try {
    const { email, otp } = admin;

    // Send email with OTP
    const mailOptions = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${otp}`,
    });

    // Send email using async/await
    const info = await transporter.sendMail(mailOptions);
    // console.log(info);
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

exports.sendInvoice = async (invoice) => {};
