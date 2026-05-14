const express = require("express");
const router = express.Router();
const {
  addConnection,
  tradeFromWatchlist,
  getWatchlist,
} = require("../controllers/watchlistController");
const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, addConnection);
router.post("/trade", protect, tradeFromWatchlist);
router.get("/", protect, getWatchlist);

module.exports = router;
