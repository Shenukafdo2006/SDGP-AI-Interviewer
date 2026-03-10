const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");

const aiInterviewRoutes = require("./routes/aiInterviewRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/interview", aiInterviewRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;