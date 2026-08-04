import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import ProcedureCard from '../../components/ui/ProcedureCard';
import { Loading, ErrorState, EmptyState } from '../../components/ui/AsyncState';
import { formatSoles } from '../../lib/estados';
import './Catalog.css';

const RANGOS_COSTO = [
  { key: 'todos', label: 'Todos', test: () => true },
  { key: 'gratis', label: 'Gratuito', test: (p) => Number(p.precio) === 0 },
  { key: 'bajo', label: 'S/. 1 – S/. 50', test: (p) => Number(p.precio) > 0 && Number(p.precio) <= 50 },
  { key: 'medio', label: 'S/. 50 – S/. 200', test: (p) => Number(p.precio) > 50 && Number(p.precio) <= 200 },
  { key: 'alto', label: 'Más de S/. 200', test: (p) => Number(p.precio) > 200 },
];

export default function Catalog() {
  const [tramites, setTramites] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [categoria, setCategoria] = useState('todos');
  const [costo, setCosto] = useState('todos');
  const [search, setSearch] = useState('');
  const [orden, setOrden] = useState('nombre');

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const [lista, cats] = await Promise.all([
        api.listProcedures({ limit: 200 }),
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

  const visibles = useMemo(() => {
    const rango = RANGOS_COSTO.find((r) => r.key === costo) || RANGOS_COSTO[0];
    const q = search.trim().toLowerCase();

    const lista = tramites.filter((t) => {
      const okCat = categoria === 'todos' || t.nombre_categoria === categoria;
      const okCosto = rango.test(t);
      const okBusqueda =
        !q ||
        t.nombre_tramite.toLowerCase().includes(q) ||
        (t.descripcion || '').toLowerCase().includes(q) ||
        t.cod_tramite.toLowerCase().includes(q);
      return okCat && okCosto && okBusqueda;
    });

    const ordenado = [...lista];
    if (orden === 'nombre') ordenado.sort((a, b) => a.nombre_tramite.localeCompare(b.nombre_tramite));
    if (orden === 'costo') ordenado.sort((a, b) => Number(a.precio) - Number(b.precio));
    if (orden === 'rapidez') ordenado.sort((a, b) => a.dias_habiles - b.dias_habiles);
    return ordenado;
  }, [tramites, categoria, costo, search, orden]);

  const conteoPorCategoria = (nombre) => tramites.filter((t) => t.nombre_categoria === nombre).length;

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
                {cargando
                  ? 'Cargando procedimientos vigentes…'
                  : `${tramites.length} procedimiento${tramites.length === 1 ? '' : 's'} vigente${tramites.length === 1 ? '' : 's'} en el TUPA.`}
              </p>
            </div>
            <Link to="/login" className="btn btn-teal">
              <span className="material-symbols-outlined" aria-hidden="true">login</span> Iniciar trámite
            </Link>
          </div>

          <div style={{ position: 'relative', marginTop: 'var(--sp-xl)', maxWidth: '600px' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: 'var(--clr-outline)' }} aria-hidden="true">search</span>
            <input
              type="text"
              placeholder="Buscar procedimiento… ej: constancia, matrícula, título"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', height: '50px', padding: '0 var(--sp-md) 0 46px', border: 'none', borderRadius: 'var(--radius-xl)', fontSize: '15px', outline: 'none', boxShadow: 'var(--shadow-lg)' }}
              aria-label="Buscar procedimientos"
            />
          </div>
        </div>
      </section>

      <div className="catalog-content">
        <div className="catalog-inner">
          <aside className="filter-panel" aria-label="Filtros de búsqueda">
            <div className="filter-panel-title">
              Filtros
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setCategoria('todos'); setCosto('todos'); setSearch(''); }}
              >
                Limpiar
              </button>
            </div>

            <div className="filter-section">
              <div className="filter-section-label">Categoría</div>
              <div className="filter-option">
                <label className="form-check">
                  <input type="radio" name="cat" checked={categoria === 'todos'} onChange={() => setCategoria('todos')} />
                  <span>Todas</span>
                </label>
                <span className="filter-count">{tramites.length}</span>
              </div>
              {categorias.map((c) => (
                <div className="filter-option" key={c.id_categoria}>
                  <label className="form-check">
                    <input
                      type="radio" name="cat"
                      checked={categoria === c.nombre_categoria}
                      onChange={() => setCategoria(c.nombre_categoria)}
                    />
                    <span>{c.nombre_categoria}</span>
                  </label>
                  <span className="filter-count">{conteoPorCategoria(c.nombre_categoria)}</span>
                </div>
              ))}
            </div>

            <div className="filter-section">
              <div className="filter-section-label">Costo</div>
              {RANGOS_COSTO.map((r) => (
                <div className="filter-option" key={r.key}>
                  <label className="form-check">
                    <input type="radio" name="cost" checked={costo === r.key} onChange={() => setCosto(r.key)} />
                    <span>{r.label}</span>
                  </label>
                  <span className="filter-count">{tramites.filter(r.test).length}</span>
                </div>
              ))}
            </div>
          </aside>

          <main style={{ minWidth: 0 }}>
            <div className="catalog-topbar">
              <div className="catalog-count" aria-live="polite">
                Mostrando <strong>{visibles.length}</strong> de {tramites.length} procedimientos
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-sm)', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', color: 'var(--clr-secondary)' }} htmlFor="orden">Ordenar:</label>
                <select
                  id="orden" className="form-select"
                  style={{ height: '36px', fontSize: '13px', width: '160px' }}
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                >
                  <option value="nombre">Nombre A–Z</option>
                  <option value="costo">Menor costo</option>
                  <option value="rapidez">Mayor rapidez</option>
                </select>
              </div>
            </div>

            {cargando ? (
              <Loading label="Cargando catálogo…" />
            ) : error ? (
              <ErrorState error={error} onRetry={cargar} />
            ) : visibles.length === 0 ? (
              <EmptyState
                icon="search_off"
                title="No se encontraron procedimientos"
                description="Prueba con otro término o limpia los filtros."
              />
            ) : (
              <div className="catalog-grid">
                {visibles.map((t) => (
                  <ProcedureCard
                    key={t.cod_tramite}
                    id={t.cod_tramite}
                    title={t.nombre_tramite}
                    category={t.nombre_categoria || 'General'}
                    description={t.descripcion || ''}
                    cost={formatSoles(t.precio)}
                    time={`${t.dias_habiles} días hábiles`}
                    targetRoute="/login"
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
