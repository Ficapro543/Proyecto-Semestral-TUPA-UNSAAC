import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import './TrackingSearch.css';

export default function TrackingSearch() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [error, setError] = useState(null);

  const isValid = code.trim().length >= 3;

  /** Consulta real al endpoint público de seguimiento. */
  const handleSearch = async () => {
    if (!isValid) return;
    setIsSearching(true);
    setError(null);

    const expediente = code.trim().toUpperCase();

    try {
      const data = await api.trackByExpediente(expediente);
      setIsFound(true);
      // El resultado viaja por router state: la pantalla siguiente no
      // vuelve a consultar y así no se pierde si el usuario refresca.
      navigate('/seguimiento/resultados', { state: { tracking: data } });
    } catch (err) {
      setError(
        err.status === 404
          ? `No se encontró ningún expediente con el código ${expediente}.`
          : err.message
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      <section className="track-hero" aria-labelledby="track-heading">
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--sp-md)', padding: '4px 14px', background: 'rgba(137,245,231,0.12)', border: '1px solid rgba(137,245,231,0.3)', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, color: 'var(--clr-tertiary-fixed)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>location_searching</span>
            Seguimiento de Expedientes
          </div>
          <h1 id="track-heading" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 'var(--sp-md)' }}>
            Rastrear mi Expediente
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
            Ingresa el código de tu expediente para conocer el estado actual de tu trámite en tiempo real.
          </p>
          <div className="search-hero-bar">
            <input 
              className="search-hero-input" 
              type="text" 
              placeholder="Ej. EXP-2026-000001"
              aria-label="Código de expediente" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isSearching || isFound}
            />
            <button 
              className="btn btn-teal btn-lg" 
              onClick={handleSearch} 
              aria-label="Buscar expediente"
              disabled={!isValid || isSearching || isFound}
            >
              <span className="material-symbols-outlined">search</span>
              Buscar
            </button>
          </div>
          <div style={{ marginTop: 'var(--sp-md)', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
            Formato: EXP-AAAA-NNNNNN · Ej. EXP-2026-000001
          </div>
        </div>
      </section>

      <main style={{ flex: 1, background: 'var(--clr-background)', padding: 'var(--sp-2xl) var(--sp-lg)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {isSearching && (
            <div style={{ textAlign: 'center', padding: 'var(--sp-xl)' }}>
              <div className="spinner"></div>
              <p style={{ marginTop: 'var(--sp-md)', color: 'var(--clr-secondary)' }}>Buscando expediente...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error animate-fade-in" role="alert" style={{ marginBottom: 'var(--sp-lg)' }}>
              <span className="material-symbols-outlined" aria-hidden="true">error</span>
              <div>{error}</div>
            </div>
          )}

          {isFound && (
            <div className="alert alert-success animate-fade-in" style={{ marginBottom: 'var(--sp-lg)' }}>
              <span className="material-symbols-outlined">check_circle</span>
              <div>Expediente encontrado · <strong>{code.trim().toUpperCase() || 'EXP-2024-8902'}</strong></div>
            </div>
          )}

          {!isSearching && !isFound && !error && (
            <div id="tips-section" className="animate-fade-in">
              <h2 className="text-headline-sm" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-lg)', textAlign: 'center' }}>¿Cómo encontrar tu código de expediente?</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-lg)', marginBottom: 'var(--sp-2xl)' }}>
                <div className="card animate-on-load">
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-md)', textAlign: 'center' }}>
                    <div style={{ width: '56px', height: '56px', background: 'var(--clr-primary-fixed)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: '28px', color: 'var(--clr-primary)' }}>email</span>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>Correo de confirmación</div>
                    <p className="text-body-sm" style={{ color: 'var(--clr-secondary)' }}>Al enviar tu solicitud recibiste un correo con el código de expediente.</p>
                  </div>
                </div>
                <div className="card animate-on-load stagger-1">
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-md)', textAlign: 'center' }}>
                    <div style={{ width: '56px', height: '56px', background: '#d1fae5', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: '28px', color: '#065f46' }}>person</span>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>Panel del estudiante</div>
                    <p className="text-body-sm" style={{ color: 'var(--clr-secondary)' }}>Inicia sesión y ve a "Mis Trámites" para ver todos tus expedientes.</p>
                  </div>
                </div>
                <div className="card animate-on-load stagger-2">
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-md)', textAlign: 'center' }}>
                    <div style={{ width: '56px', height: '56px', background: '#fef3c7', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: '28px', color: '#92400e' }}>receipt</span>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>Comprobante de pago</div>
                    <p className="text-body-sm" style={{ color: 'var(--clr-secondary)' }}>El código aparece en el comprobante de pago del trámite.</p>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: 'var(--clr-secondary)', marginBottom: 'var(--sp-md)' }}>¿Ya tienes cuenta? Accede directamente a tus expedientes.</p>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  <span className="material-symbols-outlined">login</span>
                  Iniciar sesión para ver mis trámites
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
