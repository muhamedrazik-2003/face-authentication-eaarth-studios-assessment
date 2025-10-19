require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookiesParser = require("cookie-parser");
const dbConnect = require("./config/dbConnection");
const { loadModels } = require("./config/faceapiConfig");

dbConnect();

const server = express();

server.use(cookiesParser());
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

(async () => {
  await loadModels();
})();

server.use((req, res, next) => {
  const error = new Error(`Route ${req.method} ${req.path} not found`);
  error.statusCode = 404;
  next(error);
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 UNHANDLED REJECTION:", {
    message: reason?.message || reason,
    name: reason?.name,
    stack: reason?.stack,
    promise,
  });
});
