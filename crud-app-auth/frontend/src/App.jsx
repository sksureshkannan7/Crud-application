// src/App.jsx — Main application with auth flow
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserForm     from './components/UserForm';
import UserTable    from './components/UserTable';
import { getUsers, createUser, updateUser, deleteUser } from './api';

export default function App() {
  const [authPage,     setAuthPage]     = useState('login'); // 'login' | 'register'
  const [currentUser,  setCurrentUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const [users,        setUsers]        = useState([]);
  const [editingUser,  setEditingUser]  = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSave,  setLoadingSave]  = useState(false);
  const [search,       setSearch]       = useState('');

  // ── Logout ────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setUsers([]);
    toast.success('Logged out!');
  };

  // ── Fetch users ───────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoadingFetch(true);
    try {
      const res = await getUsers();
      setUsers(res.data.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Failed to load users.');
      }
    } finally {
      setLoadingFetch(false);
    }
  }, []);

  useEffect(() => { if (currentUser) fetchUsers(); }, [currentUser, fetchUsers]);

  // ── Create / Update ───────────────────────────────────────────────
  const handleSubmit = async (formData) => {
    setLoadingSave(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        toast.success('✅ User updated!');
        setEditingUser(null);
      } else {
        await createUser(formData);
        toast.success('🎉 User created!');
      }
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoadingSave(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('🗑️ User deleted');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  // ── Auth screens ──────────────────────────────────────────────────
  if (!currentUser) {
    if (authPage === 'register')
      return <RegisterPage onLogin={setCurrentUser} onGoLogin={() => setAuthPage('login')} />;
    return <LoginPage onLogin={setCurrentUser} onGoRegister={() => setAuthPage('register')} />;
  }

  // ── Main app ──────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <h1 style={styles.logo}>Suresh CRUD App</h1>
            <p style={styles.subtitle}>React · Node.js · PostgreSQL · Neon</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{users.length}</span>
              <span style={styles.statLabel}>Users</span>
            </div>
            <div style={styles.userBadge}>
              <div style={styles.avatar}>{currentUser.username?.[0]?.toUpperCase()}</div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--white)', fontWeight: 600 }}>
                  {currentUser.username}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{currentUser.email}</div>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
                ⎋ Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <UserForm
          onSubmit={handleSubmit}
          editingUser={editingUser}
          onCancel={() => setEditingUser(null)}
          loading={loadingSave}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by name, email or role..."
          style={{ marginBottom: '1rem' }}
        />
        <UserTable
          users={filtered}
          onEdit={setEditingUser}
          onDelete={handleDelete}
          loading={loadingFetch}
        />
      </main>

      <footer style={styles.footer}>
        <p>Built with ❤️ by Suresh Kannan · React + Node.js + PostgreSQL (Neon)</p>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: '1rem 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerInner: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logo: { fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)' },
  subtitle: { fontSize: '0.7rem', color: 'var(--muted)', marginTop: '2px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
  statBox: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '0.4rem 1rem',
    textAlign: 'center',
  },
  statNum: { display: 'block', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' },
  statLabel: { fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase' },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '0.5rem 0.8rem',
  },
  avatar: {
    width: '30px', height: '30px',
    borderRadius: '50%',
    background: 'var(--accent)',
    color: '#000',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '0.85rem',
    flexShrink: 0,
  },
  logoutBtn: {
    background: 'rgba(248,113,113,0.1)',
    border: '1px solid rgba(248,113,113,0.3)',
    color: '#f87171',
    borderRadius: '6px',
    padding: '0.3rem 0.7rem',
    fontSize: '0.72rem',
    cursor: 'pointer',
    fontWeight: 600,
  },
  main: { flex: 1, maxWidth: '1000px', margin: '0 auto', padding: '2rem', width: '100%' },
  footer: {
    borderTop: '1px solid var(--border)',
    padding: '1rem 2rem',
    textAlign: 'center',
    color: 'var(--muted)',
    fontSize: '0.78rem',
  },
};
