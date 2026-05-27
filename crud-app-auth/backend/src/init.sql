-- Run this SQL in your Neon dashboard SQL editor to create the table

CREATE TABLE IF NOT EXISTS users (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(150) NOT NULL UNIQUE,
  role      VARCHAR(80)  NOT NULL DEFAULT 'User',
  created_at TIMESTAMP   DEFAULT NOW()
);

-- Optional: seed some sample data to get started
INSERT INTO users (name, email, role) VALUES
  ('Suresh Kannan',  'suresh@example.com',  'Developer'),
  ('Priya Sharma',   'priya@example.com',   'Designer'),
  ('Rahul Kumar',    'rahul@example.com',   'Manager')
ON CONFLICT (email) DO NOTHING;
