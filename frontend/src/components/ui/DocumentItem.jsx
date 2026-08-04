export default function DocumentItem({
  name = 'Documento.pdf',
  size = '',
  status = 'pending',
  required = true,
  description = ''
}) {
  const stateMap = {
    pending:  { icon: 'upload_file',    color: 'var(--clr-outline)',  label: 'Pendiente' },
    uploaded: { icon: 'check_circle',   color: 'var(--clr-primary)',  label: 'Cargado' },
    error:    { icon: 'error',          color: 'var(--clr-error)',    label: 'Error' },
    approved: { icon: 'verified',       color: '#065f46',             label: 'Verificado' },
  };
  
  const s = stateMap[status] || stateMap.pending;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', padding: 'var(--sp-md)',
      border: '1px solid var(--clr-outline-variant)', borderRadius: 'var(--radius-lg)',
      background: 'var(--clr-surface-container-lowest)'
    }}>
      <span className="material-symbols-outlined" style={{ color: s.color, fontSize: '28px' }}>
        {s.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="text-label-md" style={{ color: 'var(--clr-on-surface)' }}>
          {name}
          {required && <span style={{ color: 'var(--clr-error)' }}> *</span>}
        </div>
        {description && <div className="text-body-sm" style={{ color: 'var(--clr-secondary)' }}>{description}</div>}
        {size && <div className="text-label-sm" style={{ color: 'var(--clr-outline)' }}>{size}</div>}
      </div>
      <span className={`badge ${
        (status === 'uploaded' || status === 'approved') ? 'badge-success' : 
        (status === 'error' ? 'badge-error' : 'badge-neutral')
      }`}>
        {s.label}
      </span>
    </div>
  );
}
