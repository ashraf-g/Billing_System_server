const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    unit_price: { type: Number, required: true },
  },
  { timestamps: true }
);

serviceSchema.index({ name: "text" });

module.exports = mongoose.model("Service", serviceSchema);
