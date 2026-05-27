// src/components/UserForm.jsx
import { useState, useEffect } from 'react';

const ROLES = ['Developer', 'Designer', 'Manager', 'Intern', 'Tester', 'DevOps', 'User'];

export default function UserForm({ onSubmit, editingUser, onCancel, loading }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'Developer' });

  // When editingUser changes, populate the form
  useEffect(() => {
    if (editingUser) {
      setForm({ name: editingUser.name, email: editingUser.email, role: editingUser.role });
    } else {
      setForm({ name: '', email: '', role: 'Developer' });
    }
  }, [editingUser]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>
        {editingUser ? '✏️ Edit User' : '➕ Add New User'}
      </h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Suresh Kannan"
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Email Address</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="e.g. suresh@example.com"
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div style={styles.actions}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '⏳ Saving...' : editingUser ? '💾 Update User' : '✅ Create User'}
          </button>
          {editingUser && (
            <button type="button" className="btn-cancel" onClick={onCancel}>
              ✕ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--white)',
    marginBottom: '1.2rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.05em' },
  actions: { display: 'flex', gap: '0.75rem', marginTop: '0.5rem' },
};
