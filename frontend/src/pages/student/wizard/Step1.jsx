import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';
import api from '../../../lib/api';
import { useWizard } from '../../../context/WizardContext';
import { Loading, ErrorState } from '../../../components/ui/AsyncState';
import { formatSoles } from '../../../lib/estados';
import './Step1.css';

/** Ícono por categoría; el catálogo real no trae uno por trámite. */
const ICONO_CATEGORIA = {
  'Certificados y Constancias': { icon: 'verified', bg: 'var(--clr-primary-fixed)', color: 'var(--clr-primary)' },
  'Matrícula': { icon: 'school', bg: '#d1fae5', color: '#065f46' },
  'Grados y Títulos': { icon: 'workspace_premium', bg: '#fef3c7', color: '#92400e' },
  'Movilidad Estudiantil': { icon: 'swap_horiz', bg: 'rgba(137,245,231,0.25)', color: 'var(--clr-tertiary-container)' },
  'Bienestar Universitario': { icon: 'restaurant', bg: 'var(--clr-error-container)', color: 'var(--clr-error)' },
};

function iconoDe(nombreCategoria) {
  return (
    ICONO_CATEGORIA[nombreCategoria] || {
      icon: 'description',
      bg: 'var(--clr-surface-container)',
      color: 'var(--clr-primary)',
    }
  );
}

export default function Step1() {
  const navigate = useNavigate();
  const wizard = useWizard();

  const [tramites, setTramites] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [filtro, setFiltro] = useState('todos');
  const [search, setSearch] = useState('');
  const [seleccionado, setSeleccionado] = useState(wizard.codTramite);
  const [creando, setCreando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const [lista, cats] = await Promise.all([
        api.listProcedures({ limit: 100 }),
        api.getCategories(),
      ]);
      setTramites(lista.data || []);
      setCategorias(cats || []);
    } catch (err) {
      setError(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const tramiteSel = tramites.find((t) => t.cod_tramite === seleccionado);

  const visibles = tramites.filter((t) => {
    const coincideCat = filtro === 'todos' || t.nombre_categoria === filtro;
    const q = search.toLowerCase();
    const coincideBusqueda =
      !q ||
      t.nombre_tramite.toLowerCase().includes(q) ||
      t.cod_tramite.toLowerCase().includes(q);
    return coincideCat && coincideBusqueda;
  });

  /**
   * Crea el borrador en el backend y guarda el id para los pasos siguientes.
   * Si ya había un borrador para el mismo trámite se reutiliza, para no dejar
   * solicitudes huérfanas cada vez que el usuario vuelve al paso 1.
   */
  const continuar = async () => {
    if (!tramiteSel) return;
    setCreando(true);
    setError(null);

    try {
      if (wizard.idSolicitud && wizard.codTramite === tramiteSel.cod_tramite) {
        navigate('/tramite/paso2');
        return;
      }

      const res = await api.createRequest(tramiteSel.cod_tramite);
      wizard.update({
        idSolicitud: res.solicitud.id_solicitud,
        codTramite: tramiteSel.cod_tramite,
        tramite: tramiteSel,
        numeroExpediente: null,
        voucherSubido: false,
        documentosSubidos: {},
      });
      navigate('/tramite/paso2');
    } catch (err) {
      setError(err);
      setCreando(false);
    }
  };

  return (
    <>
      <WizardStepper currentStep={1} />

      {cargando ? (
        <Loading label="Cargando catálogo de trámites…" />
      ) : error && tramites.length === 0 ? (
        <ErrorState error={error} onRetry={cargar} />
      ) : (
        <div className="wizard-grid">
          <div style={{ minWidth: 0 }}>
            <div style={{ marginBottom: 'var(--sp-xl)' }}>
              <h1 className="text-headline-md" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-xs)' }}>
                Selecciona el procedimiento
              </h1>
              <p className="text-body-md" style={{ color: 'var(--clr-secondary)' }}>
                Elige el trámite que deseas iniciar. Puedes buscar por nombre o filtrar por categoría.
              </p>
            </div>

            <div style={{ position: 'relative', marginBottom: 'var(--sp-md)' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--clr-outline)' }}>search</span>
              <input
                type="text"
                placeholder="Buscar procedimiento…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', height: '44px', padding: '0 var(--sp-md) 0 40px', background: 'var(--clr-surface-container-lowest)', border: '1px solid var(--clr-outline-variant)', borderRadius: 'var(--radius-lg)', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--sp-xs)', flexWrap: 'wrap', marginBottom: 'var(--sp-lg)' }}>
              <button className={`filter-chip ${filtro === 'todos' ? 'active' : ''}`} onClick={() => setFiltro('todos')}>
                Todos
              </button>
              {categorias.map((c) => (
                <button
                  key={c.id_categoria}
                  className={`filter-chip ${filtro === c.nombre_categoria ? 'active' : ''}`}
                  onClick={() => setFiltro(c.nombre_categoria)}
                >
                  {c.nombre_categoria}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              {visibles.map((t) => {
                const ic = iconoDe(t.nombre_categoria);
                return (
                  <div
                    key={t.cod_tramite}
                    className={`proc-option ${seleccionado === t.cod_tramite ? 'selected' : ''}`}
                    onClick={() => setSeleccionado(t.cod_tramite)}
                  >
                    <div className="proc-option-icon" style={{ background: ic.bg }}>
                      <span className="material-symbols-outlined" style={{ color: ic.color }}>{ic.icon}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--clr-on-surface)' }}>{t.nombre_tramite}</div>
                        {t.nombre_categoria && <span className="badge badge-primary" style={{ fontSize: '10px' }}>{t.nombre_categoria}</span>}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', marginBottom: 'var(--sp-xs)' }}>{t.descripcion}</div>
                      <div style={{ display: 'flex', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>{formatSoles(t.precio)}</span>
                        <span style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>{t.dias_habiles} días hábiles</span>
                        <span className="text-mono-sm" style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>{t.cod_tramite}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {visibles.length === 0 && (
                <div style={{ padding: 'var(--sp-xl)', textAlign: 'center', color: 'var(--clr-secondary)' }}>
                  No hay trámites que coincidan con la búsqueda.
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', minWidth: 0 }}>
            <div className="card">
              <div className="card-header"><span className="card-header-title">Tu selección</span></div>
              <div className="card-body">
                {!tramiteSel ? (
                  <div className="empty-state" style={{ padding: 'var(--sp-xl) 0' }}>
                    <span className="material-symbols-outlined">touch_app</span>
                    <div className="empty-state-title">Selecciona un trámite</div>
                    <div className="empty-state-desc">Haz clic en uno de los procedimientos de la lista</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)', fontSize: '14px' }}>
                    <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--clr-primary)', marginBottom: 'var(--sp-sm)' }}>
                      {tramiteSel.nombre_tramite}
                    </div>
                    <Fila label="Código" valor={<span className="text-mono-sm">{tramiteSel.cod_tramite}</span>} />
                    <Fila label="Costo" valor={<strong>{formatSoles(tramiteSel.precio)}</strong>} />
                    <Fila label="Plazo" valor={`${tramiteSel.dias_habiles} días hábiles`} />
                    <Fila label="Unidad" valor={tramiteSel.unidad_responsable || '—'} />
                  </div>
                )}
              </div>
            </div>

            {error && <ErrorState error={error} />}

            <div className="alert alert-info">
              <span className="material-symbols-outlined">info</span>
              <div>Al continuar se creará un borrador de solicitud que podrás retomar más tarde.</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--sp-md)', flexWrap: 'wrap', paddingTop: 'var(--sp-lg)', borderTop: '1px solid var(--clr-outline-variant)', marginTop: 'var(--sp-xl)' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/catalogo')}>
          <span className="material-symbols-outlined">arrow_back</span> Volver al catálogo
        </button>
        <button className="btn btn-primary btn-lg" disabled={!tramiteSel || creando} onClick={continuar}>
          {creando ? 'Creando borrador…' : 'Continuar a Requisitos'}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </>
  );
}

function Fila({ label, valor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--sp-md)' }}>
      <span style={{ color: 'var(--clr-secondary)' }}>{label}</span>
      <span style={{ textAlign: 'right' }}>{valor}</span>
    </div>
  );
}
