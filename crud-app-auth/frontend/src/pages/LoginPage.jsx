// src/pages/LoginPage.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { login } from '../api';

export default function LoginPage({ onLogin, onGoRegister }) {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success(`Welcome back, ${res.data.user.username}! 👋`);
      onLogin(res.data.user);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>🔒</div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to your CRUD App account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{ ...styles.input, paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={styles.eyeBtn}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>Don't have an account?</span>
        </div>

        <button onClick={onGoRegister} style={styles.switchBtn}>
          Create Account →
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: '1rem',
  },
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
  },
  logo: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontFamily: 'Segoe UI, sans-serif',
    fontWeight: 800,
    fontSize: '1.6rem',
    color: 'var(--white)',
    textAlign: 'center',
    marginBottom: '0.4rem',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--muted)',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.05em' },
  input: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  eyeBtn: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: 0,
  },
  submitBtn: {
    marginTop: '0.5rem',
    background: 'var(--accent)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    padding: '0.85rem',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
  },
  divider: {
    textAlign: 'center',
    margin: '1.5rem 0 1rem',
  },
  dividerText: {
    fontSize: '0.78rem',
    color: 'var(--muted)',
  },
  switchBtn: {
    width: '100%',
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--accent)',
    borderRadius: '8px',
    padding: '0.75rem',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
import axios from "axios";
import API_URL from "./api";

axios.get(`${API_URL}/api/users`);