// src/routes/auth.js — Register & Login routes
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../db');
const router   = express.Router();

// ── POST /api/auth/register ────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ success: false, error: 'username, email, and password are required' });

  if (password.length < 6)
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });

  try {
    // Hash the password
    const salt         = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO accounts (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, passwordHash]
    );

    const user  = result.rows[0];
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    if (err.code === '23505') {
      const field = err.detail.includes('email') ? 'Email' : 'Username';
      return res.status(409).json({ success: false, error: `${field} already exists` });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/auth/login ───────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, error: 'email and password are required' });

  try {
    const result = await db.query(
      'SELECT * FROM accounts WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ success: false, error: 'Invalid email or password' });

    const account = result.rows[0];
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch)
      return res.status(401).json({ success: false, error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: account.id, username: account.username, email: account.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _omit, ...user } = account;
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/auth/me ───────────────────────────────────────────────
const authMiddleware = require('../middleware/auth');
router.get('/me', authMiddleware, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
