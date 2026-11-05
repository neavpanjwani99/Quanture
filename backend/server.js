const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Load env variables
dotenv.config();

// Connect DB
connectDB();

// Init app
const app = express();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", limiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Note: In production, you should restrict this to your frontend URL
app.use(cookieParser());

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/userRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes"); 
const contactRoutes = require("./routes/contactRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/watchlist", watchlistRoutes); 
app.use("/api/contact", contactRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error middlewares
app.use(notFound);
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

