import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { email: 'admin@demo.com', password: 'Admin@123' },
      analyst: { email: 'analyst@demo.com', password: 'Analyst@123' },
      viewer: { email: 'viewer@demo.com', password: 'Viewer@123' }
    };
    setForm(creds[role]);
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52,
            background: 'linear-gradient(135deg, #63b3ed 0%, #b794f4 100%)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: '#fff',
            margin: '0 auto 14px'
          }}>IQ</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Sign in to your AnalytIQ dashboard
          </p>
        </div>

        {/* Demo credentials */}
        <div style={{
          background: 'rgba(99,179,237,0.06)',
          border: '1px solid rgba(99,179,237,0.2)',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 22
        }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
            Demo accounts
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['admin', 'analyst', 'viewer'].map(role => (
              <button
                key={role}
                onClick={() => fillDemo(role)}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', borderRadius: 7, padding: '5px 12px',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                  fontFamily: 'inherit', transition: 'all 0.15s'
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)',
              color: '#fc8181', borderRadius: 9, padding: '10px 14px',
              fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8
            }}>
              <i className="bi bi-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
              Email address
            </label>
            <input
              type="email"
              name="email"
              className="iq-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              className="iq-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-iq" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? (
              <>
                <span className="iq-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span>
                Signing in...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-right-circle-fill"></i>
                Sign in to Dashboard
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
