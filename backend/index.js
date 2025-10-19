require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookiesParser = require('cookie-parser');
const dbConnect = require('./config/dbConnection');

dbConnect();

const server = express()

server.use(express.json());
server.use(cookiesParser());
server.use(cors());

server.use((req, res, next) => {
  const error = new Error(`Route ${req.method} ${req.path} not found`);
  error.statusCode = 404;
  next(error);
});

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 UNHANDLED REJECTION:", {
    message: reason?.message || reason,
    name: reason?.name,
    stack: reason?.stack,
    promise,
  });
});