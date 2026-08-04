import { useState, useEffect, useCallback } from 'react';
import api from '../../lib/api';
import { Loading, ErrorState, EmptyState } from '../../components/ui/AsyncState';
import { formatSoles } from '../../lib/estados';

export default function ProcedureManagement() {
  const [tramites, setTramites] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [alternando, setAlternando] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      // active_only=false para que el admin vea también los desactivados.
      const lista = await api.listProcedures({ limit: 200, active_only: 'false' });
      setTramites(lista.data || []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const alternarVigencia = async (t) => {
    setAlternando(t.cod_tramite);
    try {
      const res = await api.toggleProcedure(t.cod_tramite);
      setTramites((prev) =>
        prev.map((x) => (x.cod_tramite === t.cod_tramite ? { ...x, vigente: res.tramite.vigente } : x))
      );
    } catch (err) {
      setError(err);
    } finally {
      setAlternando(null);
    }
  };

  const q = search.trim().toLowerCase();
  const visibles = tramites.filter(
    (t) =>
      !q ||
      t.nombre_tramite.toLowerCase().includes(q) ||
      t.cod_tramite.toLowerCase().includes(q)
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Gestión de Trámites</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>
            {tramites.filter((t) => t.vigente).length} vigentes de {tramites.length} en el catálogo
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: 'var(--clr-outline)' }} aria-hidden="true">search</span>
          <input
            type="text"
            placeholder="Buscar trámite…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ height: '38px', padding: '0 var(--sp-md) 0 34px', border: '1px solid var(--clr-outline-variant)', borderRadius: 'var(--radius-lg)', fontSize: '13px', outline: 'none', minWidth: '240px', maxWidth: '100%' }}
            aria-label="Buscar trámites"
          />
        </div>
      </div>

      {error && <ErrorState error={error} onRetry={cargar} />}

      {cargando ? (
        <Loading label="Cargando catálogo…" />
      ) : visibles.length === 0 ? (
        <EmptyState icon="search_off" title="No se encontraron trámites" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--sp-lg)' }}>
          {visibles.map((t) => (
            <div key={t.cod_tramite} className="card" style={{ opacity: t.vigente ? 1 : 0.65 }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-md)', marginBottom: 'var(--sp-sm)' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--clr-primary)' }}>
                      {t.nombre_tramite}
                    </div>
                    <div className="text-mono-sm" style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>
                      {t.cod_tramite}
                    </div>
                  </div>
                  <span className={`badge ${t.vigente ? 'badge-success' : 'badge-neutral'}`} style={{ flexShrink: 0 }}>
                    {t.vigente ? 'Vigente' : 'Inactivo'}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--clr-secondary)', marginBottom: 'var(--sp-md)' }}>
                  {t.descripcion || 'Sin descripción registrada.'}
                </p>

                <div style={{ display: 'flex', gap: 'var(--sp-md)', flexWrap: 'wrap', fontSize: '13px', marginBottom: 'var(--sp-md)' }}>
                  <span><strong>{formatSoles(t.precio)}</strong></span>
                  <span>{t.dias_habiles} días hábiles</span>
                  {t.nombre_categoria && <span className="badge badge-primary" style={{ fontSize: '10px' }}>{t.nombre_categoria}</span>}
                </div>

                <button
                  className={`btn btn-sm w-full ${t.vigente ? 'btn-outline' : 'btn-primary'}`}
                  disabled={alternando === t.cod_tramite}
                  onClick={() => alternarVigencia(t)}
                >
                  {t.vigente ? 'Desactivar del catálogo' : 'Reactivar en el catálogo'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
