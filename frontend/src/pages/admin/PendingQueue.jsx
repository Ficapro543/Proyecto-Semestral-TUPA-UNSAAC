import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import './PendingQueue.css';

const statsDef = [
  { icon: 'pending_actions', iconBg: 'var(--clr-primary-fixed)', iconColor: 'var(--clr-primary)', value: '47', label: 'Total pendientes', badgeClass: 'badge-blue' },
  { icon: 'warning', iconBg: 'var(--clr-error-container)', iconColor: 'var(--clr-error)', value: '8', label: 'Urgentes', badgeClass: 'badge-error' },
  { icon: 'schedule', iconBg: '#fef3c7', iconColor: '#92400e', value: '5', label: 'Plazo hoy', badgeClass: 'badge-warning' },
  { icon: 'check_circle', iconBg: '#d1fae5', iconColor: '#065f46', value: '128', label: 'Resueltos (mes)', badgeClass: 'badge-success' },
];

const queueData = [
  { id: 1, priority: 'urgente', priorityColor: 'var(--clr-error)', name: 'Elena Rodríguez Quispe', exp: 'EXP-2024-8902', tramite: 'Diploma de Bachiller', date: '12 Oct 2024', status: 'En Revisión', sc: 'badge-in-review' },
  { id: 2, priority: 'urgente', priorityColor: 'var(--clr-error)', name: 'Juan Carlos Mamani', exp: 'EXP-2024-8891', tramite: 'Título Profesional', date: '10 Oct 2024', status: 'Obs. Pendiente', sc: 'badge-error' },
  { id: 3, priority: 'normal', priorityColor: '#92400e', name: 'María Lucía Ccoa', exp: 'EXP-2024-8870', tramite: 'Certif. de Matrícula', date: '08 Oct 2024', status: 'Verificando pago', sc: 'badge-warning' },
  { id: 4, priority: 'normal', priorityColor: '#92400e', name: 'Carlos Ttito Flores', exp: 'EXP-2024-8844', tramite: 'Constancia de Egresado', date: '06 Oct 2024', status: 'En Revisión', sc: 'badge-in-review' },
  { id: 5, priority: 'normal', priorityColor: '#92400e', name: 'Rosa Quispe Huillca', exp: 'EXP-2024-8801', tramite: 'Récord Académico', date: '01 Oct 2024', status: 'Pendiente', sc: 'badge-neutral' },
  { id: 6, priority: 'baja', priorityColor: 'var(--clr-outline)', name: 'Luis Condori Apaza', exp: 'EXP-2024-8780', tramite: 'Reserva de Matrícula', date: '28 Sep 2024', status: 'Pendiente', sc: 'badge-neutral' },
  { id: 7, priority: 'baja', priorityColor: 'var(--clr-outline)', name: 'Ana Corimanya', exp: 'EXP-2024-8760', tramite: 'Duplicado de Carné', date: '25 Sep 2024', status: 'Pendiente', sc: 'badge-neutral' },
];

export default function PendingQueue() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');

  const filteredQueue = queueData.filter(item => {
    const matchesFilter = filter === 'todos' || item.priority === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.exp.toLowerCase().includes(search.toLowerCase()) || item.tramite.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Cola de Pendientes</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}><strong>47</strong> trámites esperando revisión administrativa</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
          <button className="btn btn-outline" onClick={() => alert('Exportando a Excel...')}>
            <span className="material-symbols-outlined">download</span> Exportar
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/validacion')}>
            <span className="material-symbols-outlined">fact_check</span>
            Ir a validación
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        {statsDef.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Filters */}
      <div className="card animate-on-load">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
          <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap' }}>
            <button className={`filter-chip ${filter === 'todos' ? 'active' : ''}`} onClick={() => setFilter('todos')}>Todos (47)</button>
            <button className={`filter-chip ${filter === 'urgente' ? 'active' : ''}`} onClick={() => setFilter('urgente')}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--clr-error)', display: 'inline-block' }}></span>
              Urgente (8)
            </button>
            <button className={`filter-chip ${filter === 'normal' ? 'active' : ''}`} onClick={() => setFilter('normal')}>Normal (31)</button>
            <button className={`filter-chip ${filter === 'baja' ? 'active' : ''}`} onClick={() => setFilter('baja')}>Baja (8)</button>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-sm)', marginLeft: 'auto' }}>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: 'var(--clr-outline)' }}>search</span>
              <input 
                type="text" 
                placeholder="Buscar expediente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ height: '36px', padding: '0 var(--sp-md) 0 34px', border: '1px solid var(--clr-outline-variant)', borderRadius: 'var(--radius-lg)', fontSize: '13px', outline: 'none' }} 
              />
            </div>
            <select className="form-select" style={{ height: '36px', fontSize: '13px', width: '150px' }}>
              <option>Todos los tipos</option>
              <option>Grados y Títulos</option>
              <option>Administrativo</option>
              <option>Bienestar</option>
            </select>
          </div>
        </div>

        {/* Table header */}
        <div className="queue-item" style={{ background: 'var(--clr-surface-container-low)', cursor: 'default', fontSize: '11px', fontWeight: 700, color: 'var(--clr-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div></div>
          <div>Solicitante / Expediente</div>
          <div>Trámite</div>
          <div>Fecha</div>
          <div>Estado</div>
          <div>Acción</div>
        </div>
        
        {/* Table body */}
        <div>
          {filteredQueue.map(item => (
            <div key={item.id} className="queue-item animate-fade-in" onClick={() => navigate('/admin/detalle')}>
              <div className="priority-dot" style={{ background: item.priorityColor }}></div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--clr-secondary)' }}>{item.exp}</div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>{item.tramite}</div>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>{item.date}</div>
              <div><span className={`badge ${item.sc}`}>{item.status}</span></div>
              <div>
                <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate('/admin/detalle'); }}>
                  Revisar
                </button>
              </div>
            </div>
          ))}
          {filteredQueue.length === 0 && (
            <div style={{ padding: 'var(--sp-xl)', textAlign: 'center', color: 'var(--clr-secondary)' }}>
              No se encontraron trámites que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
