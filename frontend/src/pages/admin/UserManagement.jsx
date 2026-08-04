import { useState, useEffect, useCallback } from 'react';
import api from '../../lib/api';
import { Loading, ErrorState, EmptyState } from '../../components/ui/AsyncState';
import { formatFecha, nombreCompleto } from '../../lib/estados';
import './UserManagement.css';

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [alternando, setAlternando] = useState(null);

  const cargar = useCallback(async (q = '') => {
    setCargando(true);
    try {
      const params = { limit: 100 };
      if (q.trim()) params.search = q.trim();
      setUsuarios(await api.listUsers(params));
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setCargando(false);
    }
  }, []);

  // Búsqueda con retardo: evita una petición por cada tecla.
  useEffect(() => {
    const t = setTimeout(() => cargar(search), 350);
    return () => clearTimeout(t);
  }, [search, cargar]);

  const alternarActivo = async (u) => {
    setAlternando(u.id_usuario);
    try {
      const res = await api.toggleUser(u.id_usuario);
      setUsuarios((prev) =>
        prev.map((x) => (x.id_usuario === u.id_usuario ? { ...x, activo: res.user.activo } : x))
      );
    } catch (err) {
      setError(err);
    } finally {
      setAlternando(null);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Usuarios</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>
            {usuarios.length} usuario{usuarios.length === 1 ? '' : 's'} registrado{usuarios.length === 1 ? '' : 's'}
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: 'var(--clr-outline)' }} aria-hidden="true">search</span>
          <input
            type="text"
            placeholder="Buscar por DNI, nombre o correo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ height: '38px', padding: '0 var(--sp-md) 0 34px', border: '1px solid var(--clr-outline-variant)', borderRadius: 'var(--radius-lg)', fontSize: '13px', outline: 'none', minWidth: '260px', maxWidth: '100%' }}
            aria-label="Buscar usuarios"
          />
        </div>
      </div>

      {error && <ErrorState error={error} onRetry={() => cargar(search)} />}

      {cargando ? (
        <Loading label="Cargando usuarios…" />
      ) : usuarios.length === 0 ? (
        <EmptyState icon="group_off" title="No se encontraron usuarios" />
      ) : (
        <div className="card">
          <div className="table-scroll">
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Nombre</th>
                  <th style={th}>DNI</th>
                  <th style={th}>Código</th>
                  <th style={th}>Correo institucional</th>
                  <th style={th}>Registro</th>
                  <th style={th}>Estado</th>
                  <th style={th}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id_usuario} style={{ borderTop: '1px solid var(--clr-outline-variant)' }}>
                    <td style={td}>{nombreCompleto(u)}</td>
                    <td style={{ ...td, fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>{u.dni}</td>
                    <td style={{ ...td, fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>{u.codigo_universitario || '—'}</td>
                    <td style={td}>{u.email_institucional}</td>
                    <td style={td}>{formatFecha(u.created_at)}</td>
                    <td style={td}>
                      <span className={`badge ${u.activo ? 'badge-success' : 'badge-neutral'}`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={td}>
                      <button
                        className={`btn btn-sm ${u.activo ? 'btn-outline' : 'btn-primary'}`}
                        disabled={alternando === u.id_usuario}
                        onClick={() => alternarActivo(u)}
                      >
                        {u.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

const th = {
  textAlign: 'left', padding: 'var(--sp-md)', fontSize: '11px', fontWeight: 700,
  color: 'var(--clr-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em',
  background: 'var(--clr-surface-container-low)', whiteSpace: 'nowrap',
};
const td = { padding: 'var(--sp-md)', fontSize: '13px', whiteSpace: 'nowrap' };
