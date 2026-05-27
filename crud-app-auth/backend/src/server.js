// src/server.js — Express server entry point

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────
app.use(
  cors({
    origin: "https://crud-application-m2la.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

// ── Public routes (no auth needed) ───────────────────────────────
app.use("/api/auth", authRouter);

// ── Protected routes (JWT required) ──────────────────────────────
app.use("/api/users", authMiddleware, usersRouter);

// ── Health check ──────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🚀 CRUD API is running!",
    status: "ok",
  });
});

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ── Global error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);

  console.log(`📋 Auth endpoints:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/me`);

  console.log(`📋 Protected CRUD endpoints (JWT required):`);
  console.log(`   GET    /api/users`);
  console.log(`   POST   /api/users`);
  console.log(`   PUT    /api/users/:id`);
  console.log(`   DELETE /api/users/:id\n`);
});