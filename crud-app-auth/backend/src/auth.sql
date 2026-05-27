-- Run this in your Neon SQL Editor AFTER init.sql

CREATE TABLE IF NOT EXISTS accounts (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(80)  NOT NULL UNIQUE,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,       -- bcrypt hash
  created_at TIMESTAMP    DEFAULT NOW()
);
