const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stockName: { type: String, required: true },
  tradeType: { type: String, enum: ["Buy", "Sell"], required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trade", tradeSchema);
