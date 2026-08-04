import { Link } from 'react-router-dom';

export default function SharedFooter() {
  return (
    <footer className="footer" role="contentinfo">
      <div>
        <div className="footer-brand">TUPA UNSAAC</div>
        <div className="footer-copy">© 2024 Universidad Nacional de San Antonio Abad del Cusco. Todos los derechos reservados.</div>
      </div>
      <nav className="footer-links" aria-label="Links de pie de página">
        <Link to="/ayuda">Centro de Ayuda</Link>
        <a href="#">Política de Privacidad</a>
        <a href="#">Términos de Uso</a>
        <a href="#">Portal de Transparencia</a>
        <Link to="/">Inicio</Link>
      </nav>
    </footer>
  );
}
