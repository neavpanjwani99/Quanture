const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stockSymbol: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
  location: { type: String }, 
});

module.exports = mongoose.model("Connection", connectionSchema);
