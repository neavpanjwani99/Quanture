// models/Wishlist.js
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
  location: { type: String },          // optional: geolocation if needed
  account: { type: String, default: "Default" }, // account name or id
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
