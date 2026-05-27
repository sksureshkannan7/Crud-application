// src/routes/users.js — All CRUD routes
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ── GET /api/users — Read all users ──────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/users/:id — Read one user ───────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/users — Create a user ──────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role)
    return res.status(400).json({ success: false, error: 'name, email, role are required' });

  try {
    const result = await db.query(
      'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
      [name, email, role]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ success: false, error: 'Email already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PUT /api/users/:id — Update a user ───────────────────────────
router.put('/:id', async (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role)
    return res.status(400).json({ success: false, error: 'name, email, role are required' });

  try {
    const result = await db.query(
      `UPDATE users SET name=$1, email=$2, role=$3 WHERE id=$4 RETURNING *`,
      [name, email, role, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ success: false, error: 'Email already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/users/:id — Delete a user ────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM users WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'User deleted', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
