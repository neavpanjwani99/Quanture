const express = require("express");
const router = express.Router();
const { 
  placeTrade, 
  getTrades, 
  getHoldings, 
  getPortfolio, 
  emailPortfolio,
  emailTransactions  
} = require("../controllers/tradeController");
const { protect } = require("../middleware/authMiddleware");

// Place a trade
router.post("/", protect, placeTrade);

// Get logged-in user's trade history
router.get("/", protect, getTrades);

// Get holdings (net qty per stock)
router.get("/holdings", protect, getHoldings);

// Full portfolio (detailed P/L: realized + unrealized)
router.get("/portfolio", protect, getPortfolio);

// Email portfolio summary to logged-in user
router.post("/portfolio/email", protect, emailPortfolio);

// Email transaction history CSV to logged-in user
router.post("/email-transactions", protect, emailTransactions);

module.exports = router;
