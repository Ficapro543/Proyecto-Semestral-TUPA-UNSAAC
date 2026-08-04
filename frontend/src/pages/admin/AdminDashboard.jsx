import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const urgentItems = [
  { id: 1, name: 'Elena Rodríguez', exp: 'EXP-2024-8902', tramite: 'Diploma de Bachiller', date: '12 Oct', status: 'En Revisión', sc: 'badge-in-review' },
  { id: 2, name: 'Juan Mamani', exp: 'EXP-2024-8891', tramite: 'Título Profesional', date: '10 Oct', status: 'Obs. Pendiente', sc: 'badge-error' },
  { id: 3, name: 'María Ccoa', exp: 'EXP-2024-8870', tramite: 'Certif. de Matrícula', date: '08 Oct', status: 'Verificando pago', sc: 'badge-warning' },
  { id: 4, name: 'Carlos Ttito', exp: 'EXP-2024-8844', tramite: 'Constancia de Egresado', date: '06 Oct', status: 'En Revisión', sc: 'badge-in-review' },
  { id: 5, name: 'Rosa Quispe', exp: 'EXP-2024-8801', tramite: 'Récord Académico', date: '01 Oct', status: 'Pendiente', sc: 'badge-neutral' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Dashboard Administrativo</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>
            Panel de control · UNSAAC · <span style={{ textTransform: 'capitalize' }}>{today}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
          <button className="btn btn-outline" onClick={() => navigate('/admin/reportes')}>
            <span className="material-symbols-outlined">bar_chart</span>
            Generar reporte
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/cola')}>
            <span className="material-symbols-outlined">inbox</span>
            Cola de pendientes
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div className="admin-metric animate-on-load" onClick={() => navigate('/admin/cola')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-metric-value" style={{ color: 'var(--clr-primary)' }}>47</div>
              <div className="admin-metric-label">Trámites Pendientes</div>
            </div>
            <div style={{ width: '44px', height: '44px', background: 'var(--clr-primary-fixed)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '22px', color: 'var(--clr-primary)' }}>pending_actions</span>
            </div>
          </div>
          <div className="admin-metric-change" style={{ color: 'var(--clr-error)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_upward</span>
            +12% esta semana
          </div>
        </div>

        <div className="admin-metric animate-on-load stagger-1" onClick={() => navigate('/admin/validacion')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-metric-value" style={{ color: '#92400e' }}>13</div>
              <div className="admin-metric-label">Requieren Validación</div>
            </div>
            <div style={{ width: '44px', height: '44px', background: '#fef3c7', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '22px', color: '#92400e' }}>fact_check</span>
            </div>
          </div>
          <div className="admin-metric-change" style={{ color: '#92400e' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
            5 con plazo hoy
          </div>
        </div>

        <div className="admin-metric animate-on-load stagger-2" onClick={() => navigate('/admin/cola')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-metric-value" style={{ color: '#065f46' }}>128</div>
              <div className="admin-metric-label">Aprobados este mes</div>
            </div>
            <div style={{ width: '44px', height: '44px', background: '#d1fae5', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '22px', color: '#065f46' }}>check_circle</span>
            </div>
          </div>
          <div className="admin-metric-change" style={{ color: '#065f46' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_upward</span>
            +8% vs mes anterior
          </div>
        </div>

        <div className="admin-metric animate-on-load stagger-3" onClick={() => navigate('/admin/usuarios')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-metric-value" style={{ color: 'var(--clr-tertiary-container)' }}>2,341</div>
              <div className="admin-metric-label">Usuarios activos</div>
            </div>
            <div style={{ width: '44px', height: '44px', background: 'rgba(137,245,231,0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '22px', color: 'var(--clr-tertiary-container)' }}>group</span>
            </div>
          </div>
          <div className="admin-metric-change" style={{ color: 'var(--clr-secondary)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>person_add</span>
            +34 nuevos hoy
          </div>
        </div>

        <div className="admin-metric animate-on-load stagger-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-metric-value" style={{ color: 'var(--clr-error)' }}>8</div>
              <div className="admin-metric-label">Observaciones activas</div>
            </div>
            <div style={{ width: '44px', height: '44px', background: 'var(--clr-error-container)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '22px', color: 'var(--clr-error)' }}>warning</span>
            </div>
          </div>
          <div className="admin-metric-change" style={{ color: 'var(--clr-error)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>priority_high</span>
            3 con plazo venciendo
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--sp-xl)' }}>
        {/* Queue preview */}
        <div>
          <div className="card animate-on-load">
            <div className="card-header">
              <span className="card-header-title">Trámites Pendientes — Urgentes</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/cola')}>Ver todos</button>
            </div>
            <div className="queue-row" style={{ background: 'var(--clr-surface-container-low)', fontSize: '11px', fontWeight: 700, color: 'var(--clr-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'default' }}>
              <div>Solicitante / Expediente</div>
              <div>Trámite</div>
              <div>Fecha</div>
              <div>Estado</div>
              <div></div>
            </div>
            
            {urgentItems.map(item => (
              <div key={item.id} className="queue-row" onClick={() => navigate('/admin/detalle')}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--clr-secondary)' }}>{item.exp}</div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>{item.tramite}</div>
                <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>{item.date}</div>
                <div><span className={`badge ${item.sc}`}>{item.status}</span></div>
                <div>
                  <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); navigate('/admin/detalle'); }}>
                    <span className="material-symbols-outlined icon-sm">open_in_new</span>
                  </button>
                </div>
              </div>
            ))}
            
            <div style={{ padding: 'var(--sp-md)', textAlign: 'center' }}>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/cola')}>Ver toda la cola de pendientes</button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
          {/* Quick actions */}
          <div className="card animate-on-load stagger-1">
            <div className="card-header"><span className="card-header-title">Acciones rápidas</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              <button className="btn btn-primary w-full" onClick={() => navigate('/admin/cola')}>
                <span className="material-symbols-outlined">inbox</span> Cola de pendientes (47)
              </button>
              <button className="btn btn-outline w-full" onClick={() => navigate('/admin/validacion')}>
                <span className="material-symbols-outlined">fact_check</span> Validar documentos (13)
              </button>
              <button className="btn btn-ghost w-full" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/usuarios')}>
                <span className="material-symbols-outlined">group</span> Gestión de usuarios
              </button>
              <button className="btn btn-ghost w-full" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/reportes')}>
                <span className="material-symbols-outlined">bar_chart</span> Reportes y estadísticas
              </button>
              <button className="btn btn-ghost w-full" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/procedimientos')}>
                <span className="material-symbols-outlined">list_alt</span> Gestión de trámites
              </button>
            </div>
          </div>

          {/* System status */}
          <div className="card animate-on-load stagger-2">
            <div className="card-header"><span className="card-header-title">Estado del sistema</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px' }}>Portal estudiantil</span>
                <span className="badge badge-success">Operativo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px' }}>Verificación de pagos</span>
                <span className="badge badge-success">Operativo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px' }}>Envío de notificaciones</span>
                <span className="badge badge-warning">Lento</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px' }}>Carga de documentos</span>
                <span className="badge badge-success">Operativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
