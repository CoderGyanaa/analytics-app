import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/format';

const navItems = [
  { to: '/dashboard', icon: 'bi-grid-fill', label: 'Dashboard' },
  { to: '/sales', icon: 'bi-bag-fill', label: 'Sales' },
  { to: '/analytics', icon: 'bi-bar-chart-fill', label: 'Analytics' },
];

const adminItems = [
  { to: '/team', icon: 'bi-people-fill', label: 'Team' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">IQ</div>
        <div className="sidebar-logo-text">Analyt<span>IQ</span></div>
      </div>

      {/* Main nav */}
      <div style={{ padding: '12px 0' }}>
        <div className="nav-section-label">Main</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${item.icon}`}></i>
            {item.label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="nav-section-label" style={{ marginTop: 8 }}>Admin</div>
            {adminItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="avatar">{getInitials(user?.name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {user?.role}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, padding: 4 }}
            title="Logout"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
