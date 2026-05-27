// src/pages/RegisterPage.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { register } from "../api";

export default function RegisterPage({ onLogin, onGoLogin }) {
  const [form, setForm]       = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return toast.error('Passwords do not match');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const res = await register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success(`Account created! Welcome, ${res.data.user.username} 🎉`);
      onLogin(res.data.user);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#f87171', '#fb923c', '#2dff9e'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🔐</div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join the CRUD App — it's free!</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. sureshkannan"
              required
              style={styles.input}
            />
          </div>

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
                placeholder="Min 6 characters"
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
            {/* Strength bar */}
            {form.password && (
              <div style={styles.strengthWrap}>
                <div style={styles.strengthBar}>
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      style={{
                        ...styles.strengthSegment,
                        background: n <= strength ? strengthColors[strength] : 'var(--border)',
                      }}
                    />
                  ))}
                </div>
                <span style={{ color: strengthColors[strength], fontSize: '0.7rem' }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
              style={{
                ...styles.input,
                borderColor: form.confirm && form.confirm !== form.password ? '#f87171' : undefined,
              }}
            />
            {form.confirm && form.confirm !== form.password && (
              <span style={{ fontSize: '0.7rem', color: '#f87171' }}>Passwords don't match</span>
            )}
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? '⏳ Creating account...' : '🚀 Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '1.5rem 0 1rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Already have an account?</span>
        </div>

        <button onClick={onGoLogin} style={styles.switchBtn}>
          ← Sign In
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
  logo: { fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' },
  title: {
    fontFamily: 'Segoe UI, sans-serif',
    fontWeight: 800,
    fontSize: '1.6rem',
    color: 'var(--white)',
    textAlign: 'center',
    marginBottom: '0.4rem',
  },
  subtitle: { fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem' },
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
  strengthWrap: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' },
  strengthBar: { display: 'flex', gap: '4px', flex: 1 },
  strengthSegment: { height: '4px', flex: 1, borderRadius: '2px', transition: 'background 0.3s' },
  submitBtn: {
    marginTop: '0.5rem',
    background: 'var(--accent2)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.85rem',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    width: '100%',
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
  },
};
