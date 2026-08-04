import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProcedureCard from '../../components/ui/ProcedureCard';
import './Catalog.css';

const procedures = [
  { id:'P001', title:'Diploma de Bachiller', category:'Académico', description:'Solicitud de diploma acreditativo de grado de bachiller otorgado por la UNSAAC.', cost:'S/. 120.00', time:'15 días hábiles', badge:'Frecuente' },
  { id:'P002', title:'Certificado de Matrícula', category:'Académico', description:'Constancia oficial que acredita el estado de matrícula del estudiante en el semestre actual.', cost:'Gratuito', time:'2 días hábiles' },
  { id:'P003', title:'Constancia de Egresado', category:'Académico', description:'Documento que certifica que el alumno ha concluido satisfactoriamente el plan de estudios.', cost:'S/. 30.00', time:'3 días hábiles' },
  { id:'P004', title:'Récord Académico', category:'Académico', description:'Certificado con el historial completo de notas y créditos del estudiante.', cost:'S/. 15.00', time:'1 día hábil', badge:'Popular' },
  { id:'P005', title:'Título Profesional', category:'Académico', description:'Otorgamiento del título profesional con modalidad de tesis o suficiencia profesional.', cost:'S/. 250.00', time:'30 días hábiles' },
  { id:'P006', title:'Homologación de Notas', category:'Académico', description:'Reconocimiento y equivalencia de asignaturas cursadas en otra universidad.', cost:'S/. 45.00', time:'7 días hábiles' },
  { id:'P007', title:'Traslado Externo', category:'Administrativo', description:'Proceso de admisión por traslado desde otra universidad al tercio superior.', cost:'S/. 180.00', time:'20 días hábiles' },
  { id:'P008', title:'Cambio de Especialidad', category:'Administrativo', description:'Solicitud de cambio de programa o especialidad dentro de la misma facultad.', cost:'S/. 60.00', time:'10 días hábiles' },
  { id:'P009', title:'Duplicado de Carné Universitario', category:'Administrativo', description:'Reposición del carné universitario por pérdida, robo o deterioro.', cost:'S/. 25.00', time:'3 días hábiles' },
  { id:'P010', title:'Beca Comedor Universitario', category:'Bienestar', description:'Solicitud de beca parcial o total para el servicio de comedor de la UNSAAC.', cost:'Gratuito', time:'5 días hábiles', badge:'Nuevo' },
  { id:'P011', title:'Reserva de Matrícula', category:'Académico', description:'Suspensión temporal de la matrícula hasta por cuatro semestres académicos.', cost:'S/. 20.00', time:'2 días hábiles' },
  { id:'P012', title:'Convalidación de Cursos', category:'Académico', description:'Validación de asignaturas aprobadas en programas de intercambio o posgrado.', cost:'S/. 35.00', time:'5 días hábiles' },
];

export default function Catalog() {
  const [activeTab, setActiveTab] = useState('todos');
  const [activeView, setActiveView] = useState('grid');

  return (
    <>
      <section className="catalog-hero" aria-labelledby="catalog-heading">
        <div className="catalog-hero-inner">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-lg)' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--clr-tertiary-fixed)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--sp-sm)' }}>
                Portal TUPA · UNSAAC
              </div>
              <h1 id="catalog-heading" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 'var(--sp-sm)' }}>
                Catálogo de Procedimientos<br />Administrativos
              </h1>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', maxWidth: '520px' }}>
                103 procedimientos vigentes clasificados por facultad, área y tipo de trámite.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
              <div className="view-toggle" role="group" aria-label="Cambiar vista">
                <button className={`view-btn ${activeView === 'grid' ? 'active' : ''}`} onClick={() => setActiveView('grid')} title="Vista cuadrícula">
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button className={`view-btn ${activeView === 'list' ? 'active' : ''}`} onClick={() => setActiveView('list')} title="Vista lista">
                  <span className="material-symbols-outlined">view_list</span>
                </button>
                <button className={`view-btn ${activeView === 'accordion' ? 'active' : ''}`} onClick={() => setActiveView('accordion')} title="Vista acordeón">
                  <span className="material-symbols-outlined">view_agenda</span>
                </button>
              </div>
              <Link to="/login" className="btn btn-teal">
                <span className="material-symbols-outlined">login</span>
                Iniciar trámite
              </Link>
            </div>
          </div>

          {/* Search in hero */}
          <div style={{ position: 'relative', marginTop: 'var(--sp-xl)', maxWidth: '600px' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: 'var(--clr-outline)' }}>search</span>
            <input type="text" placeholder="Buscar procedimiento... ej: diploma, matrícula, constancia"
                   style={{ width: '100%', height: '50px', padding: '0 var(--sp-md) 0 46px', border: 'none', borderRadius: 'var(--radius-xl)', fontSize: '15px', outline: 'none', boxShadow: 'var(--shadow-lg)' }}
                   aria-label="Buscar procedimientos" />
          </div>
        </div>
      </section>

      <div className="catalog-content">
        <div className="catalog-inner">
          {/* FILTER PANEL */}
          <aside className="filter-panel" aria-label="Filtros de búsqueda">
            <div className="filter-panel-title">
              Filtros
              <button className="btn btn-ghost btn-sm" onClick={() => {}}>Limpiar</button>
            </div>

            <div className="filter-section">
              <div className="filter-section-label">Área</div>
              <div className="filter-option"><label className="form-check"><input type="checkbox" defaultChecked /><span>Académica</span></label><span className="filter-count">47</span></div>
              <div className="filter-option"><label className="form-check"><input type="checkbox" /><span>Administrativa</span></label><span className="filter-count">28</span></div>
              <div className="filter-option"><label className="form-check"><input type="checkbox" /><span>Bienestar</span></label><span className="filter-count">15</span></div>
              <div className="filter-option"><label className="form-check"><input type="checkbox" /><span>Investigación</span></label><span className="filter-count">13</span></div>
            </div>

            <div className="filter-section">
              <div className="filter-section-label">Costo</div>
              <div className="filter-option"><label className="form-check"><input type="radio" name="cost" defaultChecked /><span>Todos</span></label></div>
              <div className="filter-option"><label className="form-check"><input type="radio" name="cost" /><span>Gratuito</span></label><span className="filter-count">22</span></div>
              <div className="filter-option"><label className="form-check"><input type="radio" name="cost" /><span>S/. 1 – S/. 50</span></label><span className="filter-count">38</span></div>
              <div className="filter-option"><label className="form-check"><input type="radio" name="cost" /><span>S/. 50 – S/. 200</span></label><span className="filter-count">31</span></div>
              <div className="filter-option"><label className="form-check"><input type="radio" name="cost" /><span>Más de S/. 200</span></label><span className="filter-count">12</span></div>
            </div>

            <div className="filter-section">
              <div className="filter-section-label">Plazo de atención</div>
              <div className="filter-option"><label className="form-check"><input type="checkbox" /><span>Inmediato (mismo día)</span></label><span className="filter-count">8</span></div>
              <div className="filter-option"><label className="form-check"><input type="checkbox" /><span>1–3 días hábiles</span></label><span className="filter-count">34</span></div>
              <div className="filter-option"><label className="form-check"><input type="checkbox" /><span>4–10 días hábiles</span></label><span className="filter-count">41</span></div>
              <div className="filter-option"><label className="form-check"><input type="checkbox" /><span>Más de 10 días</span></label><span className="filter-count">20</span></div>
            </div>

            <div className="filter-section">
              <div className="filter-section-label">Otros</div>
              <div className="filter-option"><label className="form-check"><input type="checkbox" /><span>Solo digitales</span></label></div>
              <div className="filter-option"><label className="form-check"><input type="checkbox" /><span>Con presencia física</span></label></div>
            </div>

            <button className="btn btn-primary w-full">Aplicar filtros</button>
          </aside>

          {/* CATALOG GRID */}
          <main>
            <div className="catalog-topbar">
              <div className="catalog-count" aria-live="polite">Mostrando <strong>{procedures.length}</strong> procedimientos académicos</div>
              <div style={{ display: 'flex', gap: 'var(--sp-sm)', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Ordenar:</label>
                <select className="form-select" style={{ height: '36px', fontSize: '13px', width: '160px' }} aria-label="Ordenar procedimientos">
                  <option>Relevancia</option>
                  <option>Nombre A–Z</option>
                  <option>Menor costo</option>
                  <option>Mayor rapidez</option>
                </select>
              </div>
            </div>

            {/* Category tabs */}
            <div className="tabs" style={{ marginBottom: 'var(--sp-lg)' }}>
              <div className={`tab-item ${activeTab === 'todos' ? 'active' : ''}`} onClick={() => setActiveTab('todos')}>Todos (103)</div>
              <div className={`tab-item ${activeTab === 'academico' ? 'active' : ''}`} onClick={() => setActiveTab('academico')}>Académico (47)</div>
              <div className={`tab-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>Administrativo (28)</div>
              <div className={`tab-item ${activeTab === 'bienestar' ? 'active' : ''}`} onClick={() => setActiveTab('bienestar')}>Bienestar (15)</div>
              <div className={`tab-item ${activeTab === 'investigacion' ? 'active' : ''}`} onClick={() => setActiveTab('investigacion')}>Investigación (13)</div>
            </div>

            <div className="catalog-grid">
              {procedures.map(p => (
                <ProcedureCard key={p.id} {...p} targetRoute="/catalogo/detalle" />
              ))}
            </div>

            <div className="pagination" aria-label="Paginación" style={{ marginTop: 'var(--sp-xl)' }}>
              <button className="page-btn"><span className="material-symbols-outlined">chevron_left</span></button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <span style={{ color: 'var(--clr-outline)' }}>…</span>
              <button className="page-btn">8</button>
              <button className="page-btn"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
