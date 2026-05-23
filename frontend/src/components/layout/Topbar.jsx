import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <div className="topbar">
      <div className="topbar-title">
        {title}
        {subtitle && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 10 }}>
            {subtitle}
          </span>
        )}
      </div>
      <span className="topbar-badge">
        <i className="bi bi-circle-fill" style={{ fontSize: 7, marginRight: 4 }}></i>
        Live
      </span>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
        Welcome, <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
      </div>
    </div>
  );
}
