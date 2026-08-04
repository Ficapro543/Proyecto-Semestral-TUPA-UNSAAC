import StatCard from '../../components/ui/StatCard';
import './Reports.css';

export default function Reports() {
  const kpis = [
    { icon: 'assignment_turned_in', iconBg: 'var(--clr-primary-fixed)', iconColor: 'var(--clr-primary)', value: '128', label: 'Trámites resueltos', badgeClass: 'badge-neutral', badgeText: 'Oct 2024' },
    { icon: 'hourglass_empty', iconBg: '#fef3c7', iconColor: '#92400e', value: '4.2', label: 'Días promedio resolución', badgeClass: 'badge-warning', badgeText: 'Objetivo: 5' },
    { icon: 'star', iconBg: '#d1fae5', iconColor: '#065f46', value: '94%', label: 'Tasa de aprobación', badgeClass: 'badge-success', badgeText: '+3% vs sept.' },
    { icon: 'payments', iconBg: 'rgba(137,245,231,0.2)', iconColor: 'var(--clr-tertiary-container)', value: 'S/. 12,480', label: 'Ingresos por tasas', badgeClass: 'badge-primary', badgeText: 'Mes actual' },
  ];

  const months = [
    { label: 'Ene', val: 78 }, { label: 'Feb', val: 92 }, { label: 'Mar', val: 85 },
    { label: 'Abr', val: 110 }, { label: 'May', val: 95 }, { label: 'Jun', val: 103 },
    { label: 'Jul', val: 88 }, { label: 'Ago', val: 115 }, { label: 'Sep', val: 122 },
    { label: 'Oct', val: 128 }, { label: 'Nov', val: 0 }, { label: 'Dic', val: 0 },
  ];
  const maxVal = Math.max(...months.map(m => m.val));

  const topProcs = [
    { rank: 1, name: 'Diploma de Bachiller', cat: 'Académico', count: 34, pct: 27, change: '+12%', up: true },
    { rank: 2, name: 'Certificado de Matrícula', cat: 'Académico', count: 28, pct: 22, change: '+5%', up: true },
    { rank: 3, name: 'Récord Académico', cat: 'Académico', count: 18, pct: 14, change: '-3%', up: false },
    { rank: 4, name: 'Constancia de Egresado', cat: 'Académico', count: 15, pct: 12, change: '+8%', up: true },
    { rank: 5, name: 'Traslado Externo', cat: 'Administrativo', count: 10, pct: 8, change: '=', up: null },
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Reportes y Estadísticas</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>Análisis de rendimiento del portal — Octubre 2024</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
          <select className="form-select" style={{ height: '40px', fontSize: '13px' }}>
            <option>Octubre 2024</option>
            <option>Septiembre 2024</option>
            <option>Agosto 2024</option>
            <option>2024 Completo</option>
          </select>
          <button className="btn btn-primary" onClick={() => alert('Generando PDF...')}>
            <span className="material-symbols-outlined">picture_as_pdf</span>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        {kpis.map((k, i) => (
          <StatCard key={i} {...k} />
        ))}
      </div>

      {/* Charts grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-xl)', marginBottom: 'var(--sp-xl)' }}>
        {/* Monthly bar chart */}
        <div className="card animate-on-load">
          <div className="card-header"><span className="card-header-title">Trámites por mes (2024)</span></div>
          <div className="card-body">
            <div className="chart-bar">
              {months.map((m, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${m.val ? (m.val / maxVal) * 100 : 2}%`, 
                      background: m.label === 'Oct' ? 'var(--clr-tertiary-fixed)' : m.val > 0 ? 'var(--clr-primary)' : 'var(--clr-outline-variant)',
                      opacity: m.val ? 1 : 0.3 
                    }}
                    title={`${m.label}: ${m.val} trámites`}
                  ></div>
                  <div className="bar-label">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status donut */}
        <div className="card animate-on-load stagger-1">
          <div className="card-header"><span className="card-header-title">Distribución por estado</span></div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-xl)' }}>
              <div className="donut-ring">
                <svg viewBox="0 0 160 160" width="160" height="160">
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#e5e7eb" strokeWidth="20"/>
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#002045" strokeWidth="20" strokeDasharray="226 150" strokeLinecap="round"/>
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#065f46" strokeWidth="20" strokeDasharray="75 301" strokeDashoffset="-226" strokeLinecap="round"/>
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#ba1a1a" strokeWidth="20" strokeDasharray="25 351" strokeDashoffset="-301" strokeLinecap="round"/>
                </svg>
                <div className="donut-center">
                  <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '28px', fontWeight: 800, color: 'var(--clr-primary)' }}>128</div>
                  <div style={{ fontSize: '11px', color: 'var(--clr-secondary)' }}>Total oct.</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--clr-primary)' }}></div>
                  <span style={{ fontSize: '13px' }}>En proceso <strong>60%</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#065f46' }}></div>
                  <span style={{ fontSize: '13px' }}>Aprobados <strong>20%</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ba1a1a' }}></div>
                  <span style={{ fontSize: '13px' }}>Observados <strong>7%</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e5e7eb' }}></div>
                  <span style={{ fontSize: '13px' }}>Pendientes <strong>13%</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top procedures table */}
      <div className="card animate-on-load stagger-2" style={{ marginBottom: 'var(--sp-xl)' }}>
        <div className="card-header"><span className="card-header-title">Procedimientos más solicitados (octubre 2024)</span></div>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 100px 100px', gap: 'var(--sp-md)', padding: 'var(--sp-md) var(--sp-lg)', background: 'var(--clr-surface-container-low)', fontSize: '11px', fontWeight: 700, color: 'var(--clr-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <div>#</div><div>Procedimiento</div><div>Categoría</div><div>Total</div><div>% del mes</div><div>Variación</div>
          </div>
          {topProcs.map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 100px 100px', gap: 'var(--sp-md)', padding: 'var(--sp-md) var(--sp-lg)', borderBottom: '1px solid var(--clr-outline-variant)', alignItems: 'center' }}>
              <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '18px', fontWeight: 800, color: 'var(--clr-primary)' }}>{p.rank}</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{p.name}</div>
              <div><span className="badge badge-primary" style={{ fontSize: '11px' }}>{p.cat}</span></div>
              <div style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>{p.count}</div>
              <div>
                <div className="progress" style={{ height: '6px', marginBottom: '4px' }}><div className="progress-bar" style={{ width: `${p.pct}%` }}></div></div>
                <span style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>{p.pct}%</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: p.up === true ? '#065f46' : p.up === false ? 'var(--clr-error)' : 'var(--clr-secondary)' }}>
                {p.up === true ? '↑' : p.up === false ? '↓' : ''} {p.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download section */}
      <div className="card animate-on-load stagger-3">
        <div className="card-header"><span className="card-header-title">Descargar reportes</span></div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--sp-md)' }}>
            <div className="card" style={{ cursor: 'pointer' }} onClick={() => alert('Descargando reporte mensual...')}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px', color: 'var(--clr-error)' }}>picture_as_pdf</span>
                <div>
                  <div style={{ fontWeight: 700 }}>Reporte mensual PDF</div>
                  <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>Octubre 2024 · 2.4 MB</div>
                </div>
              </div>
            </div>
            <div className="card" style={{ cursor: 'pointer' }} onClick={() => alert('Descargando datos Excel...')}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px', color: '#065f46' }}>table_chart</span>
                <div>
                  <div style={{ fontWeight: 700 }}>Datos Excel</div>
                  <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>Todos los trámites · CSV</div>
                </div>
              </div>
            </div>
            <div className="card" style={{ cursor: 'pointer' }} onClick={() => alert('Generando reporte anual...')}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px', color: '#92400e' }}>bar_chart</span>
                <div>
                  <div style={{ fontWeight: 700 }}>Reporte anual 2024</div>
                  <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>Consolidado anual · PDF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
