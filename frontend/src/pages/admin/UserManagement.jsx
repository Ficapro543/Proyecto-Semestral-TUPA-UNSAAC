import { useState } from 'react';
import './UserManagement.css';

const colors = ['#002045', '#065f46', '#92400e', '#003d37', '#1a365d'];
const initialUsers = [
  { id: 1, initials: 'ER', color: colors[0], name: 'Elena Rodríguez Quispe', email: 'e.rodriguez@unsaac.edu.pe', code: '201900456', role: 'estudiante', lastAccess: 'Hace 2 horas', status: 'activo' },
  { id: 2, initials: 'JM', color: colors[1], name: 'Juan Carlos Mamani', email: 'j.mamani@unsaac.edu.pe', code: '201800321', role: 'estudiante', lastAccess: 'Ayer', status: 'activo' },
  { id: 3, initials: 'MC', color: colors[2], name: 'María Lucía Ccoa', email: 'm.ccoa@unsaac.edu.pe', code: '202000789', role: 'estudiante', lastAccess: 'Hace 3 días', status: 'activo' },
  { id: 4, initials: 'CQ', color: colors[3], name: 'Dr. Carlos Quispe M.', email: 'c.quispe@unsaac.edu.pe', code: 'ADM-012', role: 'admin', lastAccess: 'Hoy', status: 'activo' },
  { id: 5, initials: 'RT', color: colors[4], name: 'Rosa Ttito', email: 'r.ttito@unsaac.edu.pe', code: '202100101', role: 'estudiante', lastAccess: 'Hace 1 semana', status: 'suspendido' },
  { id: 6, initials: 'LA', color: colors[0], name: 'Luis Apaza', email: 'l.apaza@unsaac.edu.pe', code: '201700634', role: 'estudiante', lastAccess: 'Hace 2 semanas', status: 'activo' },
];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = users.filter(u => {
    const matchesFilter = filter === 'todos' || u.role === filter || u.status === filter;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase()) || 
                          u.code.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'activo' ? 'suspendido' : 'activo';
        alert(newStatus === 'suspendido' ? 'Cuenta suspendida' : 'Cuenta reactivada');
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Gestión de Usuarios</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>2,341 usuarios registrados en el sistema</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
          <button className="btn btn-outline" onClick={() => alert('Exportando usuarios...')}>
            <span className="material-symbols-outlined">download</span> Exportar
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <span className="material-symbols-outlined">person_add</span>
            Nuevo usuario
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-lg)' }}>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '36px', fontWeight: 800, color: 'var(--clr-primary)' }}>2,341</div>
          <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Usuarios totales</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-lg)' }}>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '36px', fontWeight: 800, color: '#065f46' }}>2,298</div>
          <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Estudiantes</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-lg)' }}>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '36px', fontWeight: 800, color: '#92400e' }}>43</div>
          <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Administrativos</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-lg)' }}>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '36px', fontWeight: 800, color: 'var(--clr-error)' }}>12</div>
          <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Cuentas suspendidas</div>
        </div>
      </div>

      {/* Filter tabs + table */}
      <div className="card animate-on-load">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
          <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap' }}>
            <button className={`filter-chip ${filter === 'todos' ? 'active' : ''}`} onClick={() => setFilter('todos')}>Todos</button>
            <button className={`filter-chip ${filter === 'estudiante' ? 'active' : ''}`} onClick={() => setFilter('estudiante')}>Estudiantes</button>
            <button className={`filter-chip ${filter === 'admin' ? 'active' : ''}`} onClick={() => setFilter('admin')}>Administrativos</button>
            <button className={`filter-chip ${filter === 'suspendido' ? 'active' : ''}`} onClick={() => setFilter('suspendido')}>Suspendidos</button>
          </div>
          <div style={{ marginLeft: 'auto', position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: 'var(--clr-outline)' }}>search</span>
            <input 
              type="text" 
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ height: '36px', padding: '0 var(--sp-md) 0 34px', border: '1px solid var(--clr-outline-variant)', borderRadius: 'var(--radius-lg)', fontSize: '13px', outline: 'none' }} 
            />
          </div>
        </div>
        
        {/* Table header */}
        <div className="user-row" style={{ background: 'var(--clr-surface-container-low)', cursor: 'default', fontSize: '11px', fontWeight: 700, color: 'var(--clr-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div></div>
          <div>Usuario</div>
          <div>Rol</div>
          <div>Último acceso</div>
          <div>Estado</div>
          <div></div>
        </div>
        
        {/* User list */}
        <div>
          {filteredUsers.map(u => (
            <div key={u.id} className="user-row">
              <div className="user-avatar-sm" style={{ background: u.color }}>{u.initials}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{u.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>{u.email} · {u.code}</div>
              </div>
              <div>
                <span className={`badge ${u.role === 'admin' ? 'badge-blue' : 'badge-primary'}`} style={{ fontSize: '11px' }}>
                  {u.role === 'admin' ? 'Administrativo' : 'Estudiante'}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>{u.lastAccess}</div>
              <div>
                <span className={`badge ${u.status === 'activo' ? 'badge-success' : 'badge-error'}`}>
                  {u.status === 'activo' ? 'Activo' : 'Suspendido'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => alert(`Editando a ${u.name}`)}>
                  <span className="material-symbols-outlined icon-sm">edit</span>
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(u.id)}>
                  <span className="material-symbols-outlined icon-sm">{u.status === 'activo' ? 'block' : 'check_circle'}</span>
                </button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div style={{ padding: 'var(--sp-xl)', textAlign: 'center', color: 'var(--clr-secondary)' }}>
              No se encontraron usuarios
            </div>
          )}
        </div>
      </div>

      {/* New User Modal */}
      {isModalOpen && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="modal open" role="dialog">
            <div className="modal-header">
              <div className="modal-title">Nuevo Usuario</div>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
                <div className="form-group"><label className="form-label required" htmlFor="nu-nombres">Nombres</label><input className="form-input" id="nu-nombres" /></div>
                <div className="form-group"><label className="form-label required" htmlFor="nu-apellidos">Apellidos</label><input className="form-input" id="nu-apellidos" /></div>
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
                <label className="form-label required" htmlFor="nu-email">Correo institucional</label>
                <input className="form-input" id="nu-email" type="email" placeholder="@unsaac.edu.pe" />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
                <label className="form-label required" htmlFor="nu-rol">Rol</label>
                <select className="form-select w-full" id="nu-rol">
                  <option>Estudiante</option>
                  <option>Administrativo</option>
                  <option>Super Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => { alert('Usuario creado. Se envió correo de bienvenida.'); setIsModalOpen(false); }}>
                <span className="material-symbols-outlined">save</span> Crear usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
