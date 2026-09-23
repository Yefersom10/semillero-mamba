import Link from 'next/link';

export default function FooterPublic() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h4>Semillero Mamba</h4>
          <p>
            Espacio académico de investigación en desarrollo de software, calidad
            de software, análisis de datos e inteligencia artificial y arquitectura de software.
          </p>
          <p className="copyright">
            © {new Date().getFullYear()} CORHUILA. Todos los derechos reservados.
          </p>
        </div>

        <div className="footer-section">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li>
              <Link href="#inicio">Inicio</Link>
            </li>
            <li>
              <Link href="#lineas">Líneas de Investigación</Link>
            </li>
            <li>
              <Link href="#coordinadores">Coordinadores</Link>
            </li>
            <li>
              <Link href="#eventos">Eventos</Link>
            </li>
            <li>
              <Link href="#blog">Blog</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contacto e Institución</h4>
          <p>🏢 Universidad CORHUILA</p>
          <p>📍 Neiva, Huila - Colombia</p>
          <p>✉️ semillero.mamba@corhuila.edu.co</p>
        </div>
      </div>
    </footer>
  );
}