export default function TimelineItem({
  state = 'pending',
  icon = 'radio_button_unchecked',
  title = 'Paso',
  description = '',
  date = ''
}) {
  return (
    <div className="timeline-item">
      <div className={`timeline-dot ${state}`}>
        <span className={`material-symbols-outlined ${state === 'completed' ? 'icon-filled' : ''}`}>
          {icon}
        </span>
      </div>
      <div className="timeline-content">
        <div className="timeline-title">{title}</div>
        {description && <div className="timeline-desc">{description}</div>}
        {date && <div className="timeline-date">{date}</div>}
      </div>
    </div>
  );
}
