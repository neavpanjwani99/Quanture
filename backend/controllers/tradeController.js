const Trade = require("../models/Trade");
const User = require("../models/User");
const sendEmail = require("../utils/emailService");

// Place a trade
const placeTrade = async (req, res) => {
  try {
    const { stockName, tradeType, price, quantity } = req.body;
    if (!stockName || !tradeType || !price || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // SELL logic check
    if (tradeType === "Sell") {
      const trades = await Trade.find({ user: req.user._id, stockName });

      let totalBought = 0, totalSold = 0;
      trades.forEach((t) => {
        if (t.tradeType === "Buy") totalBought += t.quantity;
        if (t.tradeType === "Sell") totalSold += t.quantity;
      });

      const availableQty = totalBought - totalSold;

      if (availableQty < quantity) {
        return res.status(400).json({
          message: `Insufficient shares! Available: ${availableQty}, Tried to sell: ${quantity}`,
        });
      }
    }

    const trade = await Trade.create({
      user: req.user._id,
      stockName,
      tradeType,
      price,
      quantity,
      total: price * quantity,
    });

    res.status(201).json({ message: "Trade recorded", trade });
  } catch (error) {
    console.error("Place Trade Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get holdings (net qty per stock)
const getHoldings = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id });

    const holdings = {};

    trades.forEach((t) => {
      if (!holdings[t.stockName]) holdings[t.stockName] = 0;

      if (t.tradeType === "Buy") holdings[t.stockName] += t.quantity;
      else if (t.tradeType === "Sell") holdings[t.stockName] -= t.quantity;
    });

    res.json(holdings);
  } catch (error) {
    console.error("Get Holdings Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all trades (history)
const getTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ timestamp: -1 });
    res.json(trades);
  } catch (error) {
    console.error("Get Trades Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- NEW HELPERS ---------- //
const computePortfolioFromTrades = (trades, getCurrentPriceForStock = null) => {
  const portfolio = {};

  for (const t of trades) {
    const s = t.stockName;
    if (!portfolio[s]) {
      portfolio[s] = {
        stock: s,
        netQuantity: 0,
        avgBuyPrice: 0,
        realizedPL: 0,
        totalBuyQty: 0,
        totalBuyValue: 0,
      };
    }
    const node = portfolio[s];

    if (t.tradeType === "Buy") {
      node.totalBuyQty += t.quantity;
      node.totalBuyValue += t.price * t.quantity;
      node.netQuantity += t.quantity;
      node.avgBuyPrice =
        node.netQuantity > 0 ? node.totalBuyValue / node.totalBuyQty : 0;
    } else if (t.tradeType === "Sell") {
      const realized = (t.price - node.avgBuyPrice) * t.quantity;
      node.realizedPL += realized;
      node.netQuantity -= t.quantity;
    }
  }

  const result = [];
  for (const stock in portfolio) {
    const node = portfolio[stock];
    const currentPrice = getCurrentPriceForStock
      ? getCurrentPriceForStock(stock, node)
      : node.avgBuyPrice || 0;

    const cost = node.avgBuyPrice * Math.max(0, node.netQuantity);
    const currentValue = currentPrice * Math.max(0, node.netQuantity);
    const unrealizedPL = currentValue - cost;
    const unrealizedPLPercent = cost > 0 ? (unrealizedPL / cost) * 100 : 0;

    result.push({
      stock,
      quantity: Math.max(0, node.netQuantity),
      avgBuyPrice: Number((node.avgBuyPrice || 0).toFixed(2)),
      currentPrice: Number(currentPrice.toFixed(2)),
      cost: Number(cost.toFixed(2)),
      currentValue: Number(currentValue.toFixed(2)),
      unrealizedPL: Number(unrealizedPL.toFixed(2)),
      unrealizedPLPercent: Number(unrealizedPLPercent.toFixed(2)),
      realizedPL: Number(node.realizedPL.toFixed(2)),
    });
  }

  return result;
};

// Email transactions CSV to user
const emailTransactions = async (req, res) => {
  try {
    const { transactions, email } = req.body;

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ message: "No transactions provided." });
    }
    if (!email) return res.status(400).json({ message: "Email is required." });

    // Build CSV string
    let csv = "Stock,Type,Date,Shares,Price\n";
    transactions.forEach(t => {
      csv += `${t.symbol},${t.type},${t.date},${t.shares},${t.price}\n`;
    });

    // HTML email with CSV table
    let html = `<h3>Transaction History</h3>`;
    html += `<p>Total Transactions: ${transactions.length}</p>`;
    html += `<table border="1" cellpadding="6" style="border-collapse:collapse">
      <thead><tr>
        <th>Stock</th><th>Type</th><th>Date</th><th>Shares</th><th>Price</th>
      </tr></thead><tbody>`;
    transactions.forEach(t => {
      html += `<tr>
        <td>${t.symbol}</td>
        <td>${t.type}</td>
        <td>${t.date}</td>
        <td>${t.shares}</td>
        <td>₹${t.price}</td>
      </tr>`;
    });
    html += `</tbody></table>`;

    // Send email
    await sendEmail(email, "Your Transaction History – Quanture", html, csv);

    res.json({ message: "Transactions emailed successfully." });
  } catch (err) {
    console.error("Email Transactions Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get portfolio (detailed P/L)
const getPortfolio = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ timestamp: 1 });
    const lastPriceMap = {};
    trades.forEach((t) => {
      lastPriceMap[t.stockName] = t.price;
    });

    const portfolio = computePortfolioFromTrades(trades, (stock, node) => {
      return lastPriceMap[stock] || node.avgBuyPrice || 0;
    });

    const totalRealized = portfolio.reduce(
      (acc, p) => acc + (p.realizedPL || 0),
      0
    );

    res.json({ totalRealized: Number(totalRealized.toFixed(2)), portfolio });
  } catch (err) {
    console.error("Get Portfolio Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Email portfolio to user (login or guest)
const emailPortfolio = async (req, res) => {
  try {
    let email = "";
    let trades = [];

    const token = req.headers.authorization?.split(" ")[1];

    if (token && req.user) {
      // Logged in user
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });
      email = user.email;
      trades = await Trade.find({ user: req.user._id }).sort({ timestamp: 1 });
    } else {
      // Guest user, email from request body
      email = req.body.email;
      trades = req.body.holdings || []; // Frontend can send holdings array for guest
      if (!email) return res.status(400).json({ message: "Email is required for guest users." });
    }

    // Compute portfolio (for logged in user, compute from trades; for guest, use passed holdings)
    let portfolio = [];
    let totalRealized = 0;

    if (trades.length > 0) {
      const lastPriceMap = {};
      trades.forEach((t) => { lastPriceMap[t.stockName] = t.price; });
      portfolio = computePortfolioFromTrades(trades, (stock, node) => lastPriceMap[stock] || node.avgBuyPrice || 0);
      totalRealized = portfolio.reduce((acc, p) => acc + (p.realizedPL || 0), 0);
    } else if (req.body.holdings) {
      // For guest: assume frontend sends holdings array with structure [{symbol, shares, invested, price}]
      portfolio = req.body.holdings.map(h => {
        const currentValue = h.price * h.shares;
        const unrealizedPL = currentValue - h.invested;
        const unrealizedPLPercent = h.invested > 0 ? (unrealizedPL / h.invested) * 100 : 0;
        return {
          stock: h.symbol,
          quantity: h.shares,
          avgBuyPrice: h.invested / h.shares,
          currentPrice: h.price,
          cost: h.invested,
          currentValue,
          unrealizedPL,
          unrealizedPLPercent,
          realizedPL: 0,
        };
      });
      totalRealized = portfolio.reduce((acc, p) => acc + (p.realizedPL || 0), 0);
    }

    // Prepare HTML
    let html = `<h3>Portfolio Summary</h3>`;
    html += `<p>Total Realized P&L: ₹${totalRealized.toFixed(2)}</p>`;
    html += `<table border="1" cellpadding="6" style="border-collapse:collapse">`;
    html += `<thead><tr><th>Stock</th><th>Qty</th><th>Avg Buy</th><th>Current</th><th>Unrealized (₹)</th><th>Unrealized %</th><th>Realized (₹)</th></tr></thead><tbody>`;
    for (const p of portfolio) {
      html += `<tr>
        <td>${p.stock}</td>
        <td>${p.quantity}</td>
        <td>₹${p.avgBuyPrice.toFixed(2)}</td>
        <td>₹${p.currentPrice.toFixed(2)}</td>
        <td>₹${p.unrealizedPL.toFixed(2)}</td>
        <td>${p.unrealizedPLPercent.toFixed(2)}%</td>
        <td>₹${p.realizedPL.toFixed(2)}</td>
      </tr>`;
    }
    html += `</tbody></table>`;

    await sendEmail(email, "Your Portfolio Summary – Quanture", html);

    res.json({ message: "Portfolio emailed successfully." });
  } catch (err) {
    console.error("Email Portfolio Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Export all controllers
module.exports = {
  placeTrade,
  getTrades,
  getHoldings,
  getPortfolio,
  emailPortfolio,
  emailTransactions, 
};

