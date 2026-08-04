import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialProcedures = [
  { id: 'P001', name: 'Diploma de Bachiller', cat: 'Académico', cost: 'S/. 120.00', days: '15 días', active: true },
  { id: 'P002', name: 'Certificado de Matrícula', cat: 'Académico', cost: 'Gratuito', days: '2 días', active: true },
  { id: 'P003', name: 'Constancia de Egresado', cat: 'Académico', cost: 'S/. 30.00', days: '3 días', active: true },
  { id: 'P004', name: 'Récord Académico', cat: 'Académico', cost: 'S/. 15.00', days: '1 día', active: true },
  { id: 'P005', name: 'Título Profesional', cat: 'Académico', cost: 'S/. 250.00', days: '30 días', active: true },
  { id: 'P006', name: 'Homologación de Notas', cat: 'Académico', cost: 'S/. 45.00', days: '7 días', active: true },
  { id: 'P007', name: 'Traslado Externo', cat: 'Administrativo', cost: 'S/. 180.00', days: '20 días', active: true },
  { id: 'P008', name: 'Cambio de Especialidad', cat: 'Administrativo', cost: 'S/. 60.00', days: '10 días', active: false },
  { id: 'P009', name: 'Duplicado de Carné Universitario', cat: 'Administrativo', cost: 'S/. 25.00', days: '3 días', active: true },
  { id: 'P010', name: 'Beca Comedor Universitario', cat: 'Bienestar', cost: 'Gratuito', days: '5 días', active: true },
];

export default function ProcedureManagement() {
  const [procedures, setProcedures] = useState(initialProcedures);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoverRowId, setHoverRowId] = useState(null);

  const filteredProcedures = procedures.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setProcedures(procedures.map(p => {
      if (p.id === id) {
        const newStatus = !p.active;
        alert(`${newStatus ? 'Activado: ' : 'Desactivado: '} ${p.name}`);
        return { ...p, active: newStatus };
      }
      return p;
    }));
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Gestión de Procedimientos</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>Administra el catálogo de {procedures.length} procedimientos del TUPA</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
          <button className="btn btn-outline" onClick={() => alert('Exportando catálogo...')}>
            <span className="material-symbols-outlined">download</span> Exportar
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <span className="material-symbols-outlined">add</span> Nuevo procedimiento
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-lg)' }}>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '36px', fontWeight: 800, color: 'var(--clr-primary)' }}>{procedures.length}</div>
          <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Procedimientos totales</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-lg)' }}>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '36px', fontWeight: 800, color: '#065f46' }}>2</div>
          <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Gratuitos</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-lg)' }}>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '36px', fontWeight: 800, color: '#92400e' }}>8</div>
          <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Con costo</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-lg)' }}>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '36px', fontWeight: 800, color: 'var(--clr-primary)' }}>3</div>
          <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Categorías</div>
        </div>
      </div>

      {/* Table */}
      <div className="card animate-on-load">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
          <span className="card-header-title">Catálogo de procedimientos</span>
          <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap', marginLeft: 'auto' }}>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: 'var(--clr-outline)' }}>search</span>
              <input 
                type="text" 
                placeholder="Buscar procedimiento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ height: '36px', padding: '0 var(--sp-md) 0 34px', border: '1px solid var(--clr-outline-variant)', borderRadius: 'var(--radius-lg)', fontSize: '13px', outline: 'none' }} 
              />
            </div>
            <select className="form-select" style={{ height: '36px', fontSize: '13px', width: '140px' }}>
              <option>Todas las categorías</option>
              <option>Académico</option>
              <option>Administrativo</option>
              <option>Bienestar</option>
            </select>
          </div>
        </div>
        
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 100px 80px', gap: 'var(--sp-md)', padding: 'var(--sp-md) var(--sp-lg)', background: 'var(--clr-surface-container-low)', fontSize: '11px', fontWeight: 700, color: 'var(--clr-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div>Código</div><div>Procedimiento</div><div>Categoría</div><div>Costo</div><div>Plazo</div><div>Acciones</div>
        </div>
        
        {/* List */}
        <div>
          {filteredProcedures.map(p => (
            <div 
              key={p.id} 
              className="animate-on-load" 
              style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 100px 80px', gap: 'var(--sp-md)', padding: 'var(--sp-md) var(--sp-lg)', borderBottom: '1px solid var(--clr-outline-variant)', alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s', background: hoverRowId === p.id ? 'var(--clr-surface-container-low)' : '' }}
              onMouseEnter={() => setHoverRowId(p.id)}
              onMouseLeave={() => setHoverRowId(null)}
            >
              <div className="text-mono-sm" style={{ color: 'var(--clr-primary)' }}>{p.id}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-on-surface)' }}>{p.name}</div>
                {!p.active && <span className="badge badge-neutral" style={{ fontSize: '10px' }}>Inactivo</span>}
              </div>
              <div><span className="badge badge-primary" style={{ fontSize: '11px' }}>{p.cat}</span></div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 600, color: 'var(--clr-primary)' }}>{p.cost}</div>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>{p.days}</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => alert(`Editando ${p.name}`)}>
                  <span className="material-symbols-outlined icon-sm">edit</span>
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(p.id)}>
                  <span className="material-symbols-outlined icon-sm">{p.active ? 'toggle_on' : 'toggle_off'}</span>
                </button>
              </div>
            </div>
          ))}
          {filteredProcedures.length === 0 && (
            <div style={{ padding: 'var(--sp-xl)', textAlign: 'center', color: 'var(--clr-secondary)' }}>No se encontraron procedimientos</div>
          )}
        </div>
      </div>

      {/* New procedure modal */}
      {isModalOpen && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="modal open" role="dialog" aria-labelledby="modal-new-proc-title">
            <div className="modal-header">
              <div className="modal-title" id="modal-new-proc-title">Nuevo Procedimiento</div>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
                <div className="form-group">
                  <label className="form-label required" htmlFor="np-code">Código TUPA</label>
                  <input className="form-input" id="np-code" placeholder="Ej. P104" />
                </div>
                <div className="form-group">
                  <label className="form-label required" htmlFor="np-cat">Categoría</label>
                  <select className="form-select w-full" id="np-cat">
                    <option>Académico</option><option>Administrativo</option><option>Bienestar</option><option>Investigación</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
                <label className="form-label required" htmlFor="np-name">Nombre del procedimiento</label>
                <input className="form-input" id="np-name" placeholder="Nombre oficial del procedimiento" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
                <div className="form-group">
                  <label className="form-label required" htmlFor="np-cost">Costo (S/.)</label>
                  <input className="form-input" id="np-cost" type="number" placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label className="form-label required" htmlFor="np-days">Plazo (días hábiles)</label>
                  <input className="form-input" id="np-days" type="number" placeholder="Ej. 15" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="np-desc">Descripción</label>
                <textarea className="form-textarea" id="np-desc" rows="3" placeholder="Descripción breve del procedimiento..."></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => { alert('Procedimiento creado correctamente'); setIsModalOpen(false); }}>
                <span className="material-symbols-outlined">save</span>
                Crear procedimiento
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
