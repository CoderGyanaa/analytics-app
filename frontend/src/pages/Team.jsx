import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Topbar from '../components/layout/Topbar';
import api from '../services/api';
import { formatDate, getInitials } from '../utils/format';
import { useAuth } from '../context/AuthContext';

const ROLE_COLORS = { admin: '#fc8181', analyst: '#63b3ed', viewer: '#48bb78' };

export default function Team() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'viewer' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/users', form);
      setForm({ name: '', email: '', password: '', role: 'viewer' });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally { setSubmitting(false); }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}`, { role });
      fetchUsers();
    } catch { alert('Failed to update role'); }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await api.put(`/users/${id}`, { isActive: !isActive });
      fetchUsers();
    } catch { alert('Failed to update status'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
  };

  return (
    <AppLayout>
      <Topbar title="Team Management" subtitle={`${users.length} members`} />
      <div className="page-content page-enter">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              Team Members
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              Manage roles and access permissions
            </p>
          </div>
          <button className="btn-iq" onClick={() => setShowForm(!showForm)}>
            <i className={`bi bi-${showForm ? 'x' : 'plus-lg'}`}></i>
            {showForm ? 'Cancel' : 'Add Member'}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="iq-card mb-4">
            <div className="iq-card-title" style={{ marginBottom: 16 }}>New Team Member</div>
            {error && (
              <div style={{ background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)', color: '#fc8181', borderRadius: 9, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}
            <form onSubmit={handleCreate}>
              <div className="row g-3">
                <div className="col-12 col-md-3">
                  <input className="iq-input" placeholder="Full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="col-12 col-md-3">
                  <input type="email" className="iq-input" placeholder="Email address" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                </div>
                <div className="col-12 col-md-2">
                  <input type="password" className="iq-input" placeholder="Password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
                </div>
                <div className="col-12 col-md-2">
                  <select className="iq-select" style={{ width: '100%' }} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                    <option value="viewer">Viewer</option>
                    <option value="analyst">Analyst</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="col-12 col-md-2">
                  <button type="submit" className="btn-iq" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* User cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><div className="iq-spinner"></div></div>
        ) : (
          <div className="row g-3">
            {users.map(u => (
              <div key={u._id} className="col-12 col-md-6 col-xl-4">
                <div className="iq-card" style={{ opacity: u.isActive ? 1 : 0.5 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>
                      {getInitials(u.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                          background: `${ROLE_COLORS[u.role]}22`, color: ROLE_COLORS[u.role]
                        }}>
                          {u.role}
                        </span>
                        <span style={{
                          fontSize: 11, padding: '3px 9px', borderRadius: 20,
                          background: u.isActive ? 'rgba(72,187,120,0.12)' : 'rgba(252,129,129,0.12)',
                          color: u.isActive ? '#48bb78' : '#fc8181'
                        }}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    {u._id !== currentUser?.id && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button
                          onClick={() => handleToggleActive(u._id, u.isActive)}
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 7, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}
                          title={u.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <i className={`bi bi-${u.isActive ? 'pause' : 'play'}-fill`}></i>
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          style={{ background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.2)', color: '#fc8181', borderRadius: 7, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}
                          title="Delete user"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Change Role</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['viewer', 'analyst', 'admin'].map(role => (
                        <button
                          key={role}
                          onClick={() => u._id !== currentUser?.id && handleRoleChange(u._id, role)}
                          disabled={u._id === currentUser?.id}
                          style={{
                            padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600,
                            cursor: u._id === currentUser?.id ? 'not-allowed' : 'pointer',
                            textTransform: 'capitalize', fontFamily: 'inherit', border: '1px solid',
                            background: u.role === role ? `${ROLE_COLORS[role]}22` : 'transparent',
                            borderColor: u.role === role ? ROLE_COLORS[role] + '66' : 'var(--border)',
                            color: u.role === role ? ROLE_COLORS[role] : 'var(--text-muted)'
                          }}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
                    Joined {formatDate(u.createdAt)}
                    {u.lastLogin && ` · Last login ${formatDate(u.lastLogin)}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
