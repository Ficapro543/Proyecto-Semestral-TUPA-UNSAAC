import { Link } from 'react-router-dom';

export default function NotificationItem({
  icon = 'notifications',
  iconBg = 'var(--clr-surface-container)',
  iconColor = 'var(--clr-primary)',
  title = 'Notificación',
  description = '',
  time = 'Ahora',
  unread = false,
  targetRoute = ''
}) {
  const Wrapper = targetRoute ? Link : 'div';
  const wrapperProps = targetRoute ? { to: targetRoute, style: { textDecoration: 'none' } } : {};

  return (
    <Wrapper 
      className={`notification-item ${unread ? 'unread' : ''}`}
      {...wrapperProps}
    >
      <div className="notification-icon" style={{ background: iconBg, color: iconColor }}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="text-label-md" style={{ color: 'var(--clr-on-surface)' }}>{title}</div>
        <div className="text-body-sm" style={{ 
          color: 'var(--clr-secondary)', 
          marginTop: '2px', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {description}
        </div>
        <div className="text-label-sm" style={{ color: 'var(--clr-outline)', marginTop: '4px' }}>{time}</div>
      </div>
      {unread && (
        <div style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          background: 'var(--clr-primary)', 
          flexShrink: 0, 
          marginTop: '8px' 
        }}></div>
      )}
    </Wrapper>
  );
}
