import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import './MyProcedures.css';

const statDefs = [
  { icon:'pending_actions', iconBg:'var(--clr-primary-fixed)', iconColor:'var(--clr-primary)', value:'3', label:'En Proceso', badge:'Activo', badgeClass:'badge-blue' },
  { icon:'check_circle', iconBg:'#d1fae5', iconColor:'#065f46', value:'12', label:'Aprobados', badge:'Completado', badgeClass:'badge-success' },
  { icon:'warning', iconBg:'var(--clr-error-container)', iconColor:'var(--clr-error)', value:'1', label:'Observados', badge:'Atención', badgeClass:'badge-error' },
  { icon:'block', iconBg:'var(--clr-surface-container)', iconColor:'var(--clr-outline)', value:'2', label:'Anulados', badge:'Cerrado', badgeClass:'badge-neutral' },
];

const tramites = [
  { exp:'EXP-2024-8902', title:'Diploma de Bachiller', status:'En Revisión', statusClass:'badge-in-review', date:'12 Oct 2024', cost:'S/. 120.00' },
  { exp:'EXP-2024-1102', title:'Certificado de Matrícula', status:'Aprobado', statusClass:'badge-success', date:'15 Sep 2024', cost:'Gratuito' },
  { exp:'EXP-2024-0891', title:'Récord Académico', status:'Aprobado', statusClass:'badge-success', date:'20 Ago 2024', cost:'S/. 15.00' },
  { exp:'EXP-2024-0442', title:'Constancia de Egresado', status:'Observado', statusClass:'badge-error', date:'05 Jul 2024', cost:'S/. 30.00' },
  { exp:'EXP-2024-0201', title:'Reserva de Matrícula', status:'Aprobado', statusClass:'badge-success', date:'10 Jun 2024', cost:'S/. 20.00' },
  { exp:'EXP-2024-0089', title:'Duplicado de Carné', status:'Aprobado', statusClass:'badge-success', date:'02 Mar 2024', cost:'S/. 25.00' },
  { exp:'EXP-2023-9901', title:'Convalidación de Cursos', status:'Anulado', statusClass:'badge-neutral', date:'18 Nov 2023', cost:'S/. 35.00' },
];

export default function MyProcedures() {
  return (
    <>
      <nav className="breadcrumb" aria-label="Ruta de navegación"></nav>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Mis Trámites</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>Historial completo de todas tus solicitudes administrativas</p>
        </div>
        <Link to="/tramite/nuevo" className="btn btn-primary">
          <span className="material-symbols-outlined">add</span>
          Nuevo Trámite
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        {statDefs.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Filters + table */}
      <div className="card animate-on-load">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
          <span className="card-header-title">Todos los trámites</span>
          <div style={{ display: 'flex', gap: 'var(--sp-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: 'var(--clr-outline)' }}>search</span>
              <input type="text" placeholder="Buscar trámite..."
                     style={{ height: '36px', padding: '0 var(--sp-md) 0 34px', border: '1px solid var(--clr-outline-variant)', borderRadius: 'var(--radius-lg)', fontSize: '13px', outline: 'none', background: 'var(--clr-background)' }} />
            </div>
            <select className="form-select" style={{ height: '36px', fontSize: '13px', width: '140px' }}>
              <option value="">Todos los estados</option>
              <option value="activo">En proceso</option>
              <option value="observado">Observado</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>
        </div>
        {/* Table header */}
        <div className="procedure-row" style={{ background: 'var(--clr-surface-container-low)', fontSize: '12px', fontWeight: 700, color: 'var(--clr-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'default' }}>
          <div>Trámite</div>
          <div>Estado</div>
          <div>Fecha</div>
          <div>Costo</div>
          <div></div>
        </div>
        <div>
          {tramites.map((t, i) => (
            <Link to="/seguimiento" key={i} className="procedure-row animate-on-load">
              <div>
                <div className="proc-title">{t.title}</div>
                <div className="proc-exp">{t.exp}</div>
              </div>
              <div><span className={`badge ${t.statusClass}`}>{t.status}</span></div>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>{t.date}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 600, color: 'var(--clr-primary)' }}>{t.cost}</div>
              <div style={{ textAlign: 'right' }}>
                <button className="btn btn-ghost btn-sm">
                  <span className="material-symbols-outlined icon-sm">open_in_new</span>
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination" style={{ marginTop: 'var(--sp-lg)' }} aria-label="Paginación">
        <button className="page-btn"><span className="material-symbols-outlined">chevron_left</span></button>
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn"><span className="material-symbols-outlined">chevron_right</span></button>
      </div>
    </>
  );
}
