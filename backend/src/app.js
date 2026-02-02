const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working 🚀" });
});

module.exports = app;