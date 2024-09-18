const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoice_number: { type: String, required: true, unique: true },
    issue_date: { type: Date, required: true },
    due_date: { type: Date },
    total_amount: { type: Number },
    status: {
      type: String,
      enum: ["pending", "paid", "partial_paid"],
      required: true,
      default: "pending",
    },
    customer: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      contact_number: { type: String, required: true },
      email: { type: String, required: true },
    },
    invoiceEmail: {
      type: String,
      enum: ["sent", "unsent"],
      required: true,
      default: "unsent",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
