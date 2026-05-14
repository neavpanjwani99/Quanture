const Connection = require("../models/Connection");
const Trade = require("../models/Trade");

// Add stock to watchlist
const addConnection = async (req, res) => {
  try {
    const { stockSymbol, price, location } = req.body;
    const user = req.user._id;

    const existing = await Connection.findOne({ user, stockSymbol });
    if (existing) return res.status(400).json({ message: "Stock already in watchlist" });

    const connection = await Connection.create({
      user,
      stockSymbol,
      price,
      location,
      addedAt: new Date(),
    });

    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Buy/Sell trade from watchlist
const tradeFromWatchlist = async (req, res) => {
  try {
    const { stockSymbol, tradeType, price, quantity } = req.body;
    const user = req.user._id;

    const trade = await Trade.create({
      user,
      stockSymbol,
      tradeType,
      price,
      quantity,
      total: price * quantity,
      date: new Date(),
    });

    res.json(trade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all watchlist stocks
const getWatchlist = async (req, res) => {
  try {
    const user = req.user._id;
    const connections = await Connection.find({ user }).sort({ addedAt: -1 });
    res.json(connections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addConnection, tradeFromWatchlist, getWatchlist };
