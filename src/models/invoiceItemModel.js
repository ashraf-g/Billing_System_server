const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
  {
    invoice_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    quantity: { type: Number, required: true },
    total_price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InvoiceItem", invoiceItemSchema);
