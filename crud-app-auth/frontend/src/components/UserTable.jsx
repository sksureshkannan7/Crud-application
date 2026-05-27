// src/components/UserTable.jsx
const ROLE_COLORS = {
  Developer: '#2dff9e',
  Designer:  '#c084fc',
  Manager:   '#fb923c',
  Intern:    '#38bdf8',
  Tester:    '#fbbf24',
  DevOps:    '#f87171',
  User:      '#7a8fa8',
};

export default function UserTable({ users, onEdit, onDelete, loading }) {
  if (loading) return <div style={styles.center}>⏳ Loading users...</div>;
  if (users.length === 0) return (
    <div style={styles.empty}>
      <div style={{ fontSize: '3rem' }}>📭</div>
      <p>No users yet. Add one above!</p>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>👥 All Users</h2>
        <span style={styles.count}>{users.length} record{users.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Desktop table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={{ ...styles.td, color: 'var(--muted)', fontSize: '0.8rem' }}>{user.id}</td>
                <td style={{ ...styles.td, fontWeight: 600, color: 'var(--white)' }}>{user.name}</td>
                <td style={{ ...styles.td, color: 'var(--muted)' }}>{user.email}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    color: ROLE_COLORS[user.role] || '#7a8fa8',
                    background: (ROLE_COLORS[user.role] || '#7a8fa8') + '18',
                    border: `1px solid ${(ROLE_COLORS[user.role] || '#7a8fa8')}40`,
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ ...styles.td, color: 'var(--muted)', fontSize: '0.8rem' }}>
                  {new Date(user.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-edit" onClick={() => onEdit(user)} style={{ padding: '0.4rem 0.8rem' }}>
                      ✏️ Edit
                    </button>
                    <button className="btn-danger" onClick={() => onDelete(user.id)} style={{ padding: '0.4rem 0.8rem' }}>
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem 1.5rem',
    borderBottom: '1px solid var(--border)',
  },
  title: { fontSize: '1.1rem', fontWeight: 700, color: 'var(--white)' },
  count: {
    background: 'var(--border)',
    color: 'var(--muted)',
    padding: '0.2rem 0.7rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: 'rgba(0,0,0,0.2)' },
  th: {
    padding: '0.8rem 1rem',
    textAlign: 'left',
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--muted)',
    fontWeight: 600,
  },
  td: { padding: '0.9rem 1rem', fontSize: '0.88rem', verticalAlign: 'middle' },
  rowEven: { borderTop: '1px solid var(--border)' },
  rowOdd: { borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' },
  badge: {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  center: { padding: '3rem', textAlign: 'center', color: 'var(--muted)' },
  empty: {
    padding: '4rem',
    textAlign: 'center',
    color: 'var(--muted)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
};
