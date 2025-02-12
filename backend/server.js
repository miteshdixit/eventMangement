const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const socket = require("./utils/socket");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Start Server
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Initialize Socket.IO
const io = socket.init(server);
// Attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/events", require("./routes/eventRoutes"));

// Error Handling Middleware
app.use(require("./middleware/error"));
