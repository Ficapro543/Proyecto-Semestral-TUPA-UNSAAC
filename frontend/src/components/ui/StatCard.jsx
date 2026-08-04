export default function StatCard({
  icon = 'description',
  iconBg = 'var(--clr-primary-fixed)',
  iconColor = 'var(--clr-primary)',
  value = '0',
  label = 'Stat',
  badge = '',
  badgeClass = 'badge-primary',
  onClick
}) {
  const clickableProps = onClick ? {
    onClick,
    role: 'button',
    tabIndex: 0,
    style: { cursor: 'pointer' }
  } : {
    role: 'article'
  };

  return (
    <div className="stat-card animate-on-load" {...clickableProps}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div className="stat-card-icon" style={{ background: iconBg, color: iconColor }}>
          <span className="material-symbols-outlined icon-filled">{icon}</span>
        </div>
        {badge && <span className={`badge ${badgeClass}`}>{badge}</span>}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
