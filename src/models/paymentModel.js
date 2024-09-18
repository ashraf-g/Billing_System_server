const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    invoice_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    payment_date: { type: Date, required: true },
    amount: { type: Number, required: true },
    payment_method: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Debit Card",
        "Credit Card",
        "Bank Transfer",
        "Check",
      ],
      required: true,
    },
    transaction_id: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
