import { Link } from 'react-router-dom';

export default function ProcedureCard({
  id = '',
  title = 'Procedimiento',
  category = 'Académico',
  description = '',
  cost = 'Gratuito',
  time = '5 días',
  badge = '',
  targetRoute = '/catalogo/detalle'
}) {
  return (
    <Link
      to={targetRoute}
      className="procedure-card card-hover animate-on-load"
      style={{ textDecoration: 'none', display: 'block' }}
      aria-label={`Procedimiento: ${title}`}
    >
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 'var(--sp-md)' }}>
        <span className="badge badge-primary">{category}</span>
        {badge && <span className="badge badge-teal">{badge}</span>}
      </div>
      <h3 className="text-title-md" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-xs)' }}>
        {title}
      </h3>
      <p className="text-body-sm" style={{ color: 'var(--clr-on-surface-variant)', flex: 1, marginBottom: 'var(--sp-lg)' }}>
        {description}
      </p>
      <div style={{
        borderTop: '1px solid var(--clr-outline-variant)',
        paddingTop: 'var(--sp-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-xs)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--clr-on-surface-variant)' }}>
            <span className="material-symbols-outlined icon-md">payments</span>
            <span className="text-label-md">{cost}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--clr-on-surface-variant)' }}>
            <span className="material-symbols-outlined icon-md">schedule</span>
            <span className="text-label-md">{time}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--clr-primary)' }}>
          <span className="material-symbols-outlined icon-md">gavel</span>
          <span className="text-label-sm">Normativa vigente TUPA</span>
        </div>
      </div>
    </Link>
  );
}
