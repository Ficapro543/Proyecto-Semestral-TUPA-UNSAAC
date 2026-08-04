import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Notifications.css';

const initialNotifications = [
  { id: 1, icon:'warning', iconBg:'var(--clr-error-container)', iconColor:'var(--clr-error)',
    title:'Observación en tu expediente EXP-2024-8902',
    description:'La Oficina de Grados y Títulos ha emitido una observación en tu trámite de Diploma de Bachiller. Debes resubir el Anexo B antes del 30 de octubre.',
    time:'Hace 2 horas', unread:true, targetRoute:'/estudiante/tramites', type:'observaciones' },
  { id: 2, icon:'payments', iconBg:'var(--clr-tertiary-fixed)', iconColor:'var(--clr-on-tertiary-fixed)',
    title:'Pago verificado — EXP-2024-1102',
    description:'El pago de S/. 15.00 para tu Récord Académico fue confirmado por el sistema. Tu trámite avanza al siguiente paso.',
    time:'Ayer, 15:30', unread:true, targetRoute:'/seguimiento', type:'pagos' },
  { id: 3, icon:'check_circle', iconBg:'#d1fae5', iconColor:'#065f46',
    title:'Trámite aprobado — Certificado de Matrícula',
    description:'Tu solicitud de Certificado de Matrícula (EXP-2024-0891) fue aprobada. Puedes descargarlo desde el portal.',
    time:'Ayer, 10:15', unread:true, targetRoute:'/seguimiento', type:'tramites' },
  { id: 4, icon:'schedule', iconBg:'var(--clr-surface-container)', iconColor:'var(--clr-secondary)',
    title:'Recordatorio — Plazo de observación próximo a vencer',
    description:'El plazo para subsanar la observación en EXP-2024-8902 vence el 30 de octubre. Tienes 5 días restantes.',
    time:'Hace 3 días', unread:false, targetRoute:'/estudiante/tramites', type:'observaciones' },
  { id: 5, icon:'notification_important', iconBg:'#fef3c7', iconColor:'#92400e',
    title:'Nueva política de trámites 2024',
    description:'La UNSAAC actualizó los requisitos para los trámites de Grados y Títulos. Revisa el catálogo actualizado.',
    time:'Hace 5 días', unread:false, targetRoute:'/catalogo', type:'tramites' },
  { id: 6, icon:'info', iconBg:'var(--clr-primary-fixed)', iconColor:'var(--clr-primary)',
    title:'Tu cuenta ha sido verificada',
    description:'Tu correo institucional e.rodriguez@unsaac.edu.pe ha sido verificado satisfactoriamente.',
    time:'Hace 2 semanas', unread:false, targetRoute:'/estudiante/perfil', type:'tramites' },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('todos');

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const filteredNotifs = filter === 'todos' ? notifications :
                         filter === 'no-leidas' ? notifications.filter(n => n.unread) :
                         notifications.filter(n => n.type === filter);

  return (
    <>
      <nav className="breadcrumb" aria-label="Ruta de navegación"></nav>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Notificaciones</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>
            Tienes <strong>{unreadCount}</strong> notificaciones sin leer
          </p>
        </div>
        <button className="btn btn-outline" onClick={markAllRead}>
          <span className="material-symbols-outlined">done_all</span>
          Marcar todas como leídas
        </button>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap', marginBottom: 'var(--sp-lg)' }}>
        <button className={`filter-chip ${filter === 'todos' ? 'active' : ''}`} onClick={() => setFilter('todos')}>Todas</button>
        <button className={`filter-chip ${filter === 'no-leidas' ? 'active' : ''}`} onClick={() => setFilter('no-leidas')}>
          <span className="material-symbols-outlined">circle</span> No leídas ({unreadCount})
        </button>
        <button className={`filter-chip ${filter === 'tramites' ? 'active' : ''}`} onClick={() => setFilter('tramites')}>
          <span className="material-symbols-outlined">description</span> Trámites
        </button>
        <button className={`filter-chip ${filter === 'pagos' ? 'active' : ''}`} onClick={() => setFilter('pagos')}>
          <span className="material-symbols-outlined">payments</span> Pagos
        </button>
        <button className={`filter-chip ${filter === 'observaciones' ? 'active' : ''}`} onClick={() => setFilter('observaciones')}>
          <span className="material-symbols-outlined">warning</span> Observaciones
        </button>
      </div>

      <div className="card animate-on-load">
        <div>
          {filteredNotifs.map(n => (
            <Link to={n.targetRoute} key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
              {n.unread && <div className="unread-dot"></div>}
              <div className="notif-avatar" style={{ background: n.iconBg }}>
                <span className="material-symbols-outlined" style={{ color: n.iconColor }}>{n.icon}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: n.unread ? 700 : 500, color: 'var(--clr-on-surface)', marginBottom: '4px' }}>{n.title}</div>
                <p style={{ fontSize: '13px', color: 'var(--clr-secondary)', lineHeight: 1.55, marginBottom: 'var(--sp-xs)' }}>{n.description}</p>
                <div style={{ fontSize: '12px', color: 'var(--clr-outline)' }}>{n.time}</div>
              </div>
              <span className="material-symbols-outlined" style={{ color: 'var(--clr-outline)', flexShrink: 0 }}>chevron_right</span>
            </Link>
          ))}
        </div>
        <div style={{ padding: 'var(--sp-lg)', textAlign: 'center', borderTop: '1px solid var(--clr-outline-variant)' }}>
          <button className="btn btn-outline">Cargar más notificaciones</button>
        </div>
      </div>
    </>
  );
}
