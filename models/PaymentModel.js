const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  id: String,
  status: String,
  status_detail: String,
  amount: Number,
  email: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
