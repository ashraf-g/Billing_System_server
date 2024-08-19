const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoice_number: { type: String, required: true },
    issue_date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
