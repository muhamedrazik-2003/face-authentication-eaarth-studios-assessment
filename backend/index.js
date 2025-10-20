require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookiesParser = require("cookie-parser");
const dbConnect = require("./config/dbConnection");
const helmet = require('helmet')
const { loadModels } = require("./config/faceapiConfig");
const authRouter = require('./routes/authRoutes');

dbConnect();

const server = express();

server.use(cookiesParser());
server.use(helmet());
server.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://127.0.0.1:5173/:5173",
    credentials: true,
  })
);
server.use(express.json({ limit: "10mb" }));
server.use(express.urlencoded({ extended: true, limit: "10mb" }));

async function initializeModels() {
  try {
    await loadModels();
    console.log("✅ Face models loaded successfully");
  } catch (err) {
    console.error("❌ Failed to load face models:", err);
  }
}

initializeModels();

server.get("/", (req, res) => {
  res.send("<h1>🚀 Face Authentication Server is running!</h1>");
});
   
server.use('/api', authRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.use((req, res, next) => {
  const error = new Error(`Route ${req.method} ${req.path} not found`);
  error.statusCode = 404;
  next(error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 UNHANDLED REJECTION:", {
    message: reason?.message || reason,
    name: reason?.name,
    stack: reason?.stack,
    promise,
  });
});
