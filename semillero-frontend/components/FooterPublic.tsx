
export default function FooterPublic() {
  return (
    <footer className="bg-[#2c3e50] text-white text-center py-8 px-5 mt-15">
        <div className="max-w-6xl mx-auto">
          <p className="my-2 text-sm"><strong>Semillero de Investigación Mamba</strong></p>
          <p className="my-2 text-sm">Corporación Universitaria del Huila - CORHUILA</p>
          <p className="my-2 text-sm">Programa de Ingeniería de Sistemas</p>
          <p className="my-2 text-sm">Ubicación: Neiva, Huila - Colombia</p>
          <div className="mt-4 flex justify-center gap-5 flex-wrap">
            <a
              href="http://www.corhuila.edu.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2a9d7e] no-underline hover:opacity-80 transition-opacity"
            >
              CORHUILA
            </a>
          </div>
          <p className="mt-5 text-xs opacity-80">&copy; 2026 Semillero Mamba. Todos los derechos reservados.</p>
        </div>
      </footer>
  );
}