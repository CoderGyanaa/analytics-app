export default function KPICard({ icon, iconBg, iconColor, label, value, badge, badgeUp }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ background: iconBg }}>
        <i className={`bi ${icon}`} style={{ color: iconColor }}></i>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {badge !== undefined && (
        <div className={`kpi-badge ${badgeUp ? 'up' : 'down'}`}>
          <i className={`bi bi-arrow-${badgeUp ? 'up' : 'down'}-short`}></i>
          {Math.abs(badge)}%
          <span style={{ fontWeight: 400, opacity: 0.7, marginLeft: 2 }}>vs prev</span>
        </div>
      )}
    </div>
  );
}
