import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import TimelineItem from '../../components/ui/TimelineItem';
import NotificationItem from '../../components/ui/NotificationItem';
import './Dashboard.css';

export default function StudentDashboard() {
  const activities = [
    { icon: 'upload_file', bg: 'var(--clr-surface-container-highest)', color: 'var(--clr-primary)',
      title: <>Documento <code>DNI_Copia.pdf</code> subido</>, desc: 'Hoy a las 10:45 · Trámite de Grado', route: '/estudiante/tramites' },
    { icon: 'payments', bg: 'var(--clr-tertiary-fixed)', color: 'var(--clr-on-tertiary-fixed)',
      title: <>Pago confirmado para <strong>Trámite de Diploma</strong></>, desc: 'Ayer · Expediente EXP-2024-1102', route: '/seguimiento' },
    { icon: 'rule', bg: 'var(--clr-error-container)', color: 'var(--clr-error)',
      title: <>Nueva observación en <strong>Trámite de Grado</strong></>, desc: '24 Oct 2024 · Acción requerida: Resubir Anexo B', route: '/estudiante/notificaciones' },
    { icon: 'check_circle', bg: '#d1fae5', color: '#065f46',
      title: <>Solicitud <strong>Certificado de Matrícula</strong> aprobada</>, desc: '20 Oct 2024 · Expediente EXP-2024-0891', route: '/seguimiento' },
  ];

  const timelineSteps = [
    { state: 'completed', icon: 'check', title: 'Solicitud presentada', date: '12 Oct 2024' },
    { state: 'completed', icon: 'check', title: 'Pago confirmado', date: '15 Oct 2024' },
    { state: 'active',    icon: 'schedule', title: 'Revisión administrativa', date: 'Desde 18 Oct 2024', description: 'En proceso...' },
    { state: 'pending',   icon: 'radio_button_unchecked', title: 'Aprobación final del Decano', date: 'Previsto 05 Nov 2024' },
  ];

  const notifs = [
    { icon: 'warning', iconBg: 'var(--clr-error-container)', iconColor: 'var(--clr-error)',
      title: 'Observación en tu expediente', description: 'Debes resubir el Anexo B antes del 30 Oct.',
      time: 'Hace 2 horas', unread: true, targetRoute: '/estudiante/notificaciones' },
    { icon: 'payments', iconBg: 'var(--clr-tertiary-fixed)', iconColor: 'var(--clr-on-tertiary-fixed)',
      title: 'Pago verificado', description: 'El pago de S/120 fue confirmado.',
      time: 'Ayer', unread: false, targetRoute: '/seguimiento' },
  ];

  return (
    <>
      <nav className="breadcrumb" aria-label="Ruta de navegación"></nav>

      <section className="animate-on-load" style={{ marginBottom: 'var(--sp-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
          <div>
            <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>
              Buen día, Elena 👋
            </h1>
            <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>
              Aquí tienes un resumen de tu estado administrativo actual.
            </p>
          </div>
          <Link to="/tramite/nuevo" className="btn btn-primary" aria-label="Iniciar nuevo trámite" style={{ textDecoration: 'none' }}>
            <span className="material-symbols-outlined">add</span>
            Nuevo Trámite
          </Link>
        </div>
      </section>

      <section className="animate-on-load stagger-1" style={{ marginBottom: 'var(--sp-xl)' }} aria-labelledby="stats-title">
        <h2 id="stats-title" className="sr-only">Resumen de trámites</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-lg)' }}>
          <StatCard
            icon="pending_actions" iconBg="var(--clr-primary-fixed)" iconColor="var(--clr-primary)"
            value="3" label="Trámites Activos" badge="Activo" badgeClass="badge-blue"
          />
          <StatCard
            icon="check_circle" iconBg="#d1fae5" iconColor="#065f46"
            value="12" label="Aprobados" badge="Completado" badgeClass="badge-success"
          />
          <StatCard
            icon="warning" iconBg="var(--clr-error-container)" iconColor="var(--clr-error)"
            value="1" label="Observaciones" badge="Atención" badgeClass="badge-error"
          />
          <StatCard
            icon="payments" iconBg="var(--clr-primary-fixed)" iconColor="var(--clr-on-primary-fixed-variant)"
            value="S/240" label="Pagos Recientes" badge="Confirmado" badgeClass="badge-success"
          />
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--sp-xl)' }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-xl)', minWidth: 0 }}>
          
          <section className="animate-on-load stagger-2" aria-labelledby="qa-title">
            <h2 id="qa-title" className="text-headline-sm" style={{ marginBottom: 'var(--sp-md)', color: 'var(--clr-on-surface)' }}>
              Acciones Rápidas
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-md)' }}>
              <Link to="/tramite/nuevo" className="quick-action-card qa-primary">
                <span className="material-symbols-outlined icon-xl">rocket_launch</span>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div className="text-headline-sm" style={{ color: 'inherit' }}>Iniciar Trámite</div>
                  <div className="text-label-sm" style={{ opacity: 0.75, marginTop: '4px' }}>Nueva solicitud administrativa</div>
                </div>
                <span className="qa-bg-icon material-symbols-outlined">add_circle</span>
              </Link>
              <Link to="/seguimiento" className="quick-action-card qa-white">
                <span className="material-symbols-outlined icon-xl" style={{ color: 'var(--clr-primary)' }}>location_searching</span>
                <div>
                  <div className="text-headline-sm">Rastrear Expediente</div>
                  <div className="text-label-sm" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>Estado en tiempo real</div>
                </div>
                <span className="qa-bg-icon material-symbols-outlined" style={{ color: 'var(--clr-primary)' }}>track_changes</span>
              </Link>
              <Link to="/estudiante/tramites" className="quick-action-card qa-white">
                <span className="material-symbols-outlined icon-xl" style={{ color: 'var(--clr-primary)' }}>upload_file</span>
                <div>
                  <div className="text-headline-sm">Subir Documentos</div>
                  <div className="text-label-sm" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>Adjuntar archivos pendientes</div>
                </div>
                <span className="qa-bg-icon material-symbols-outlined" style={{ color: 'var(--clr-primary)' }}>cloud_upload</span>
              </Link>
              <Link to="/catalogo" className="quick-action-card qa-white">
                <span className="material-symbols-outlined icon-xl" style={{ color: 'var(--clr-primary)' }}>menu_book</span>
                <div>
                  <div className="text-headline-sm">Catálogo TUPA</div>
                  <div className="text-label-sm" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>Explorar procedimientos</div>
                </div>
                <span className="qa-bg-icon material-symbols-outlined" style={{ color: 'var(--clr-primary)' }}>list_alt</span>
              </Link>
            </div>
          </section>

          <section className="card animate-on-load stagger-3" aria-labelledby="activity-title">
            <div className="card-header">
              <span className="card-header-title" id="activity-title">Actividad Reciente</span>
              <Link to="/estudiante/tramites" className="btn btn-ghost btn-sm">Ver todo</Link>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div>
                {activities.map((a, i) => (
                  <Link to={a.route} key={i} className="activity-item">
                    <div className="activity-avatar" style={{ background: a.bg, color: a.color }}>
                      <span className="material-symbols-outlined">{a.icon}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="text-body-md" style={{ color: 'var(--clr-on-surface)' }}>{a.title}</p>
                      <p className="text-label-sm" style={{ color: 'var(--clr-secondary)', marginTop: '2px' }}>{a.desc}</p>
                    </div>
                    <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--clr-outline)', flexShrink: 0 }}>chevron_right</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="card-footer">
              <Link to="/estudiante/tramites" className="btn btn-outline btn-sm w-full" style={{ textDecoration: 'none' }}>
                Ver historial completo
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
          <section className="tracking-mini-card animate-on-load stagger-2" aria-labelledby="tracking-title">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-lg)' }}>
              <div>
                <div className="text-label-sm" style={{ color: 'var(--clr-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Expediente activo</div>
                <div className="text-headline-sm" style={{ color: 'var(--clr-primary)', marginTop: '4px' }} id="tracking-title">EXP-2024-8902</div>
              </div>
              <span className="badge badge-in-review">En Revisión</span>
            </div>

            <div className="timeline" style={{ '--timeline-gap': 'var(--sp-md)' }}>
              {timelineSteps.map((step, i) => (
                <TimelineItem key={i} {...step} />
              ))}
            </div>

            <Link to="/seguimiento" className="btn btn-outline w-full" style={{ marginTop: 'var(--sp-lg)', textDecoration: 'none' }}>
              Ver historial completo
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </section>

          <div className="help-card animate-on-load stagger-3" role="complementary" aria-label="Asistente virtual">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="text-headline-sm" style={{ color: 'var(--clr-tertiary-fixed)', marginBottom: 'var(--sp-sm)' }}>¿Necesitas ayuda?</div>
              <p className="text-body-sm" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 'var(--sp-md)' }}>
                Nuestro asistente virtual puede guiarte con los requisitos y plazos de cada trámite.
              </p>
              <button className="btn btn-teal btn-sm" onClick={() => {}}>
                <span className="material-symbols-outlined">smart_toy</span>
                Consultar Asistente
              </button>
            </div>
          </div>

          <section className="card animate-on-load stagger-4" aria-labelledby="notif-title">
            <div className="card-header">
              <span className="card-header-title" id="notif-title">Notificaciones</span>
              <Link to="/estudiante/notificaciones" className="btn btn-ghost btn-sm">Ver todas</Link>
            </div>
            <div style={{ padding: 'var(--sp-sm)' }}>
              {notifs.map((n, i) => <NotificationItem key={i} {...n} />)}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
