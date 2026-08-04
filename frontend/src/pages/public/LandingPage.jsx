import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { formatSoles } from '../../lib/estados';
import './LandingPage.css';

/** Ícono por categoría para las tarjetas destacadas. */
const ICONO_CATEGORIA = {
  'Certificados y Constancias': 'verified',
  'Matrícula': 'school',
  'Grados y Títulos': 'workspace_premium',
  'Movilidad Estudiantil': 'swap_horiz',
  'Bienestar Universitario': 'restaurant',
};

export default function LandingPage() {
  // Los trámites destacados y el conteo salen del catálogo real, no de una
  // lista fija: antes la portada anunciaba 103 procedimientos inexistentes.
  const [tramites, setTramites] = useState([]);

  useEffect(() => {
    let cancelado = false;
    api
      .listProcedures({ limit: 100 })
      .then((r) => !cancelado && setTramites(r.data || []))
      .catch(() => {
        /* la portada es informativa: si la API no responde, se muestra sin cifras */
      });
    return () => { cancelado = true; };
  }, []);

  const totalTramites = tramites.length;
  const destacados = tramites.slice(0, 4);

  return (
    <>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="hero-orb" style={{ top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(137,245,231,0.05)', animationDelay: '0s' }}></div>
        <div className="hero-orb" style={{ bottom: '-80px', left: '-80px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.04)', animationDelay: '3s' }}></div>

        <div className="hero-inner">
          <div className="hero-split">
            <div className="animate-slide-up">
              <div className="hero-eyebrow">
                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>verified</span>
                Portal Oficial UNSAAC 2024
              </div>
              <h1 className="hero-title" id="hero-heading">
                Gestiona tus trámites<br />
                <span className="accent">sin filas,</span> sin papel
              </h1>
              <p className="hero-desc">
                Accede al catálogo completo de procedimientos universitarios, inicia solicitudes,
                sube documentos y rastrea el estado de tus expedientes en tiempo real.
              </p>
              <div className="hero-ctas">
                <Link to="/catalogo" className="hero-cta-primary" aria-label="Ver catálogo de trámites">
                  <span className="material-symbols-outlined">menu_book</span>
                  Explorar Catálogo
                </Link>
                <Link to="/login" className="hero-cta-secondary" aria-label="Iniciar sesión">
                  <span className="material-symbols-outlined">login</span>
                  Ingresar al Portal
                </Link>
              </div>
              <div className="hero-stats" aria-label="Estadísticas del portal">
                <div className="hero-stat-item">
                  <div className="num">{totalTramites || '—'}</div>
                  <div className="lbl">Procedimientos</div>
                </div>
                <div className="hero-stat-item">
                  <div className="num">15K+</div>
                  <div className="lbl">Usuarios activos</div>
                </div>
                <div className="hero-stat-item">
                  <div className="num">24/7</div>
                  <div className="lbl">Disponibilidad</div>
                </div>
              </div>
            </div>

            <div className="hero-visual animate-fade-in stagger-2" aria-hidden="true">
              <Link to="/seguimiento" className="hero-card">
                <div className="hero-card-head">
                  <div className="hero-card-icon"><span className="material-symbols-outlined">timeline</span></div>
                  <div className="hero-card-title">Consulta tu expediente</div>
                </div>
                <div style={{ fontSize: '12px', opacity: 0.6 }}>
                  Ingresa tu número EXP y sigue el estado de tu trámite en vivo.
                </div>
              </Link>
              
              <Link to="/tramite/nuevo" className="hero-card">
                <div className="hero-card-head">
                  <div className="hero-card-icon"><span className="material-symbols-outlined">rocket_launch</span></div>
                  <div className="hero-card-title">Iniciar nuevo trámite</div>
                </div>
                <div style={{ fontSize: '13px', opacity: 0.65 }}>Certif. de Matrícula · Constancia de Egresado · Diploma · y 100+ más</div>
              </Link>
              
              <Link to="/catalogo" className="hero-card">
                <div className="hero-card-head">
                  <div className="hero-card-icon"><span className="material-symbols-outlined">notifications</span></div>
                  <div className="hero-card-title">Observación resuelta</div>
                  <span className="hero-card-badge badge-success badge">✓</span>
                </div>
                <div style={{ fontSize: '12px', opacity: 0.6 }}>Ayer, 15:32 · Trámite de Grado</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────── */}
      <section className="features" aria-labelledby="features-heading">
        <div className="features-inner">
          <div className="section-label">¿Por qué TUPA Digital?</div>
          <h2 className="section-title" id="features-heading">Todo en un solo portal</h2>
          <p className="section-desc">Eliminamos las barreras burocráticas. Realiza tus trámites universitarios desde cualquier dispositivo, en cualquier momento.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-lg)' }}>
            <div className="feature-card animate-on-load">
              <div className="feature-icon" style={{ background: 'var(--clr-primary-fixed)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--clr-primary)' }}>bolt</span>
              </div>
              <div className="feature-title">100% Digital</div>
              <p className="feature-desc">Sin desplazamientos ni filas. Completa todos tus trámites desde tu computadora o teléfono en minutos.</p>
            </div>
            <div className="feature-card animate-on-load stagger-1">
              <div className="feature-icon" style={{ background: 'rgba(137,245,231,0.2)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--clr-tertiary-container)' }}>location_searching</span>
              </div>
              <div className="feature-title">Seguimiento en Tiempo Real</div>
              <p className="feature-desc">Conoce el estado exacto de cada expediente en cada etapa del proceso administrativo.</p>
            </div>
            <div className="feature-card animate-on-load stagger-2">
              <div className="feature-icon" style={{ background: '#d1fae5' }}>
                <span className="material-symbols-outlined" style={{ color: '#065f46' }}>verified_user</span>
              </div>
              <div className="feature-title">Seguro e Institucional</div>
              <p className="feature-desc">Autenticación UNSAAC con cifrado SSL. Tus documentos y datos personales siempre protegidos.</p>
            </div>
            <div className="feature-card animate-on-load stagger-3">
              <div className="feature-icon" style={{ background: '#fef3c7' }}>
                <span className="material-symbols-outlined" style={{ color: '#92400e' }}>notifications_active</span>
              </div>
              <div className="feature-title">Notificaciones Instantáneas</div>
              <p className="feature-desc">Recibe alertas cuando tu trámite avanza, cuando se requiere documentación adicional o cuando sea aprobado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCEDIMIENTOS DESTACADOS ─────────── */}
      <section className="procedures-section" aria-labelledby="procs-heading">
        <div className="procedures-inner">
          <div className="section-label">Procedimientos más solicitados</div>
          <h2 className="section-title" id="procs-heading">Lo que más buscan los estudiantes</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
            {destacados.map((t, i) => (
              <Link
                key={t.cod_tramite}
                to="/catalogo"
                className={`proc-highlight-card animate-on-load${i > 0 ? ` stagger-${i}` : ''}`}
              >
                <div className="proc-highlight-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {ICONO_CATEGORIA[t.nombre_categoria] || 'description'}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--clr-primary)' }}>
                    {t.nombre_tramite}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', marginTop: '2px' }}>
                    {formatSoles(t.precio)} · {t.dias_habiles} días hábiles
                  </div>
                </div>
                <span className="material-symbols-outlined" style={{ color: 'var(--clr-outline)' }} aria-hidden="true">chevron_right</span>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/catalogo" className="btn btn-primary btn-lg">
              <span className="material-symbols-outlined">menu_book</span>
              Ver catálogo completo{totalTramites ? ` (${totalTramites} procedimientos)` : ''}
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────── */}
      <section className="cta-banner" aria-labelledby="cta-heading">
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
          <h2 className="text-headline-lg" style={{ color: 'white', marginBottom: 'var(--sp-md)' }} id="cta-heading">
            ¿Listo para gestionar tus trámites digitalmente?
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', marginBottom: 'var(--sp-xl)', lineHeight: 1.6 }}>
            Crea tu cuenta institucional y accede al portal en menos de 2 minutos.
          </p>
          <div style={{ display: 'flex', gap: 'var(--sp-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-teal btn-lg">
              <span className="material-symbols-outlined">person_add</span>
              Crear cuenta
            </Link>
            <Link to="/seguimiento" className="btn btn-outline btn-lg"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              <span className="material-symbols-outlined">location_searching</span>
              Rastrear expediente
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
