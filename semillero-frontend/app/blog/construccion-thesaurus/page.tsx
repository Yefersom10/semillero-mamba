import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Construcción del Thesaurus sobre Investigación - Semillero Mamba',
  description:
    'Aprende cómo construir un thesaurus estructurado sobre investigación. Guía completa del Semillero Mamba CORHUILA.',
  keywords: [
    'thesaurus',
    'investigación',
    'metodología',
    'términos',
    'vocabulario controlado',
  ],
};

export default function ConstruccionThesaurusPage() {
  return (
    <div className="bg-white font-sans text-gray-800 leading-relaxed min-h-screen flex flex-col justify-between">
      {/* Estilos CSS incrustados */}
      <style>{`
        :root {
          --primary-green: #1a7c5e;
          --secondary-green: #2a9d7e;
          --accent-red: #d32f2f;
          --light-bg: #f8f9fa;
          --dark-text: #2c3e50;
        }

        .header-bg {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
        }

        .header-content {
          max-width: 100%;
          margin: 0 auto;
          padding: 20px 40px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          grid-template-areas: "logo title nav";
          align-items: center;
          gap: 20px;
        }

        .logo-section { grid-area: logo; }
        .header-title { grid-area: title; text-align: center; }
        /* position: static evita que la regla global "nav { position: fixed; top: 100% }"
           del CSS móvil convierta el menú en una barra flotante sobre el contenido */
        .header-nav { grid-area: nav; display: flex; gap: 20px; justify-content: flex-end; flex-wrap: wrap; position: static; }

        @media (max-width: 768px) {
          .header-content {
            grid-template-columns: 1fr;
            grid-template-areas: "logo" "title" "nav";
          }
          .logo-section, .header-title, .header-nav {
            justify-content: center;
            text-align: center;
          }
          /* En móvil el header se apila y crece: se deja en el flujo normal
             (static) para que nunca tape el contenido al hacer scroll */
          .header-bg {
            position: static;
          }
        }

        .blog-header-section {
          background: linear-gradient(135deg, var(--light-bg) 0%, white 100%);
          padding: 60px 20px;
          text-align: center;
          margin-bottom: 40px;
        }

        .blog-title {
          font-size: 2.5em;
          color: var(--primary-green);
          margin-bottom: 15px;
          font-weight: 700;
        }

        .blog-meta {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          color: #666;
          font-size: 0.95em;
          margin-bottom: 20px;
        }

        .blog-meta span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .blog-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .blog-content h2 {
          color: var(--primary-green);
          font-size: 1.8em;
          margin: 30px 0 15px;
          font-weight: 700;
        }

        .blog-content h3 {
          color: var(--secondary-green);
          font-size: 1.3em;
          margin: 25px 0 12px;
          font-weight: 600;
        }

        .blog-content p {
          margin-bottom: 15px;
          line-height: 1.8;
          color: #555;
          text-align: justify;
        }

        .blog-content ul,
        .blog-content ol {
          margin: 20px 0 20px 30px;
          line-height: 1.8;
        }

        .blog-content ul { list-style: disc; }
        .blog-content ol { list-style: decimal; }

        .blog-content li {
          margin-bottom: 8px;
          color: #555;
        }

        /* Listas anidadas dentro de un li */
        .tt-nested {
          list-style: disc;
          margin: 10px 0 0 20px;
          padding-left: 0;
        }

        .highlight-box {
          background: linear-gradient(135deg, rgba(26, 124, 94, 0.05) 0%, rgba(42, 157, 126, 0.05) 100%);
          border-left: 4px solid var(--secondary-green);
          padding: 20px;
          margin: 25px 0;
          border-radius: 5px;
        }

        .highlight-box p {
          color: var(--primary-green);
          font-weight: 600;
          margin: 0;
          text-align: left;
        }

        /* Tabla del ejemplo práctico */
        .tt-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .tt-table thead tr {
          background: linear-gradient(135deg, #1a7c5e 0%, #2a9d7e 100%);
          color: white;
        }

        .tt-table th {
          padding: 15px;
          text-align: left;
          border: 1px solid #ddd;
          font-weight: 700;
        }

        .tt-table td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          vertical-align: top;
        }

        .tt-table tbody td:first-child {
          background: #f8f9fa;
          font-weight: 600;
          color: #1a7c5e;
        }

        .tt-table td ul {
          list-style: disc;
          margin: 0;
          padding-left: 20px;
        }

        .tt-table td a {
          color: #2a9d7e;
          text-decoration: none;
          font-weight: 500;
          word-break: break-all;
        }

        /* Diagrama de relaciones jerárquicas */
        .tt-diagram {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border: 2px solid var(--secondary-green);
          border-radius: 10px;
          padding: 30px;
          margin: 30px 0;
          box-shadow: 0 4px 15px rgba(42, 157, 126, 0.1);
        }

        .tt-diagram-root {
          text-align: center;
          margin-bottom: 30px;
        }

        .tt-diagram-root .concept {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
          color: white;
          padding: 20px 25px;
          border-radius: 8px;
          display: inline-block;
          font-weight: 700;
          font-size: 1.1em;
          box-shadow: 0 4px 10px rgba(26, 124, 94, 0.2);
        }

        .tt-hint {
          margin-top: 8px;
          color: #888;
          font-size: 0.85em;
          text-align: center;
        }

        .tt-diagram-connector {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .tt-diagram-connector div {
          width: 3px;
          height: 20px;
          background: var(--secondary-green);
        }

        .tt-nt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .tt-nt-card {
          background: white;
          border-left: 4px solid var(--secondary-green);
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 2px 8px rgba(42, 157, 126, 0.1);
        }

        .tt-nt-card p {
          margin: 0 0 8px 0;
          color: var(--primary-green);
          font-weight: 700;
          font-size: 1em;
          text-align: left;
        }

        .tt-nt-card p:last-child {
          margin: 0;
          color: #888;
          font-weight: 400;
          font-size: 0.85em;
        }

        .tt-diagram-sep {
          border-top: 2px dashed var(--secondary-green);
          margin: 0;
          padding: 0;
        }

        .tt-rt-box {
          background: linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(211, 47, 47, 0.05) 100%);
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid var(--accent-red);
          margin-bottom: 20px;
        }

        .tt-rt-box p {
          margin: 0;
          color: var(--accent-red);
          font-weight: 700;
          font-size: 1em;
          text-align: left;
        }

        .tt-rt-box .sub {
          margin: 8px 0 0 0;
          color: #888;
          font-weight: 400;
          font-size: 0.85em;
        }

        .tt-rt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .tt-rt-card {
          background: white;
          border-left: 4px solid var(--accent-red);
          padding: 12px;
          border-radius: 5px;
          box-shadow: 0 2px 8px rgba(211, 47, 47, 0.1);
        }

        .tt-rt-card p {
          margin: 0;
          color: var(--accent-red);
          font-weight: 600;
          text-align: left;
        }

        /* Ficha de nota de alcance */
        .tt-scope {
          background: white;
          border: 2px solid var(--secondary-green);
          border-radius: 10px;
          padding: 30px;
          margin: 30px 0;
          box-shadow: 0 4px 15px rgba(42, 157, 126, 0.1);
        }

        .tt-scope-head {
          border-bottom: 3px solid var(--secondary-green);
          padding-bottom: 15px;
          margin-bottom: 20px;
        }

        .tt-scope-head h4 {
          color: var(--primary-green);
          margin: 0 0 8px 0;
          font-size: 1.3em;
          font-weight: 700;
        }

        .tt-scope-head p {
          margin: 0;
          color: #888;
          font-size: 0.9em;
          text-align: left;
        }

        .tt-scope-section {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .tt-scope-section h5,
        .tt-scope-block h5 {
          color: var(--primary-green);
          font-size: 0.95em;
          font-weight: 700;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .tt-scope-section p {
          color: #555;
          line-height: 1.8;
          margin: 0;
          text-align: left;
        }

        .tt-scope-section ul {
          list-style: disc;
          margin: 0;
          padding-left: 25px;
          color: #555;
          line-height: 1.8;
        }

        .tt-scope-section li {
          color: #555;
          margin-bottom: 4px;
        }

        .tt-scope-block {
          background: linear-gradient(135deg, rgba(26, 124, 94, 0.05) 0%, rgba(42, 157, 126, 0.05) 100%);
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .tt-rel-group {
          margin-bottom: 15px;
        }

        .tt-rel-group:last-child {
          margin-bottom: 0;
        }

        .tt-rel-label {
          margin: 0 0 8px 0;
          color: var(--secondary-green);
          font-weight: 600;
          text-align: left;
        }

        .tt-rel-value {
          margin: 0;
          color: #555;
          padding-left: 15px;
          border-left: 3px solid var(--secondary-green);
          text-align: left;
        }

        .tt-scope-block ul {
          list-style: disc;
          margin: 0;
          padding-left: 25px;
          color: #555;
        }

        .tt-scope-block li {
          color: #555;
          margin-bottom: 4px;
        }

        .tt-scope-refs ul {
          list-style: disc;
          margin: 0;
          padding-left: 25px;
          color: #555;
        }

        /* Flujo de trabajo integrado */
        .tt-flow li {
          margin-bottom: 20px;
        }

        .tt-flow li strong {
          color: var(--primary-green);
          font-size: 1.1em;
        }

        .tt-flow li ul {
          list-style: disc;
          margin: 8px 0 0 20px;
          padding-left: 0;
        }

        /* Sección de descarga */
        .tt-download {
          margin-top: 40px;
          padding: 25px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e8f5f3 100%);
          border-radius: 10px;
          border-left: 5px solid var(--primary-green);
        }

        .tt-download h3 {
          color: var(--primary-green);
          margin-bottom: 15px;
          font-size: 1.3em;
          font-weight: 600;
        }

        .tt-download p {
          margin-bottom: 15px;
          color: #333;
          text-align: left;
        }

        .tt-download-btn {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
          color: white;
          padding: 12px 25px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          display: inline-block;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .tt-download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(26, 124, 94, 0.3);
        }

        .tt-article-note {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
        }

        .tt-article-note p {
          font-size: 0.9em;
          color: #999;
          text-align: left;
        }

        .back-button {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
        }

        .whatsapp-button {
          background: linear-gradient(135deg, #25d366 0%, #1fab89 100%);
        }

        @media (max-width: 768px) {
          .blog-title {
            font-size: 1.8em;
          }

          .blog-meta {
            flex-direction: column;
            gap: 10px;
          }

          .blog-content {
            padding: 20px;
          }
        }
      `}</style>

      {/* Header Sticky: ocupa espacio en el flujo, el contenido nunca queda debajo */}
      <header className="header-bg text-white py-5 shadow-md sticky top-0 z-50">
        <div className="header-content">
          <div className="logo-section flex items-center gap-4">
            <div>
              <Image src="/Logo/Logo.png" alt="Logo Mamba" className="h-[60px] w-auto" width={60} height={60} priority />
            </div>
          </div>
          <div className="header-title">
            <h1 className="text-2xl font-bold mb-1">Semillero Mamba</h1>
            <p className="text-sm opacity-95">Investigación en Ingeniería de Sistemas</p>
          </div>
          <nav className="header-nav">
            <Link href="/" className="text-white font-medium hover:opacity-80 transition-opacity">Inicio</Link>
            <Link href="/#lineas" className="text-white font-medium hover:opacity-80 transition-opacity">Líneas</Link>
            <Link href="/#coordinadores" className="text-white font-medium hover:opacity-80 transition-opacity">Equipo</Link>
            <Link href="/#eventos" className="text-white font-medium hover:opacity-80 transition-opacity">Eventos</Link>
            <Link href="/#blog" className="text-white font-medium hover:opacity-80 transition-opacity">Blog</Link>
            <a href="https://chat.whatsapp.com/LC9bMjYmFqN4LUfGLDOMX0" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:opacity-80 transition-opacity">WhatsApp</a>
          </nav>
        </div>
      </header>

      {/* Main: sin padding extra porque el header sticky ya ocupa su espacio */}
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-5 w-full my-5 py-4 border-b border-gray-300">
          <Link href="/" className="text-[#2a9d7e] hover:opacity-80 hover:underline transition-all">
            Inicio
          </Link>
          {' / Construcción del Thesaurus sobre Investigación'}
        </div>

        {/* Blog Header */}
        <div className="blog-header-section">
          <div className="max-w-6xl mx-auto px-5">
            <h1 className="blog-title">Construcción del Thesaurus sobre Investigación</h1>
            <div className="blog-meta">
              <span>📋 Publicado: 18 de Febrero, 2026</span>
              <span>🔄 Actualizado: 19 de Febrero, 2026</span>
              <span>✍️ Coordinadores del semillero</span>
              <span>⏱️ 12 minutos de lectura</span>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="max-w-6xl mx-auto px-5 w-full">
          <article className="blog-content">
            <h2>¿Qué es un Thesaurus en la Investigación?</h2>
            <p>
              Un thesaurus es mucho más que un diccionario de sinónimos. En el contexto académico y de
              investigación, es un vocabulario controlado que organiza conceptos relacionados con un tema
              específico de manera jerárquica y relacional. Permite a los investigadores comunicarse con
              precisión, normalizar la terminología y facilitar la recuperación de información en bases de
              datos especializadas.
            </p>

            <h2>¿Por Qué Construir un Thesaurus sobre Investigación?</h2>
            <p>
              En el Semillero Mamba, nuestros estudiantes trabajan con diversos métodos de investigación:
              BPM (Business Process Management), análisis de datos, desarrollo ágil, arquitectura de
              software, y más. Crear un thesaurus unificado nos permite:
            </p>
            <ul>
              <li><strong>Estandarizar terminología:</strong> Evita confusiones cuando diferentes estudiantes usan términos distintos para el mismo concepto.</li>
              <li><strong>Mejorar la documentación:</strong> Facilita que otros investigadores encuentren y comprendan nuestros trabajos.</li>
              <li><strong>Crear conecciones:</strong> Identifica relaciones entre conceptos que podrían generar nuevas investigaciones.</li>
              <li><strong>Formalizar el conocimiento:</strong> Transforma experiencias dispersas en un activo compartido y duradero.</li>
            </ul>

            <h2>Fases de Construcción del Thesaurus</h2>

            <h3>Fase 0: Recopilación Estructurada de Artículos (Foundación del Thesaurus)</h3>
            <p>
              Antes de identificar conceptos, es fundamental recopilar y organizar sistemáticamente la
              literatura académica relacionada con nuestro tema de investigación. Para esto, creamos una
              estructura Excel estandarizada que captura información crítica de cada artículo:
            </p>
            <div className="highlight-box">
              <p>
                La recopilación estructurada de artículos es el punto de partida de todo thesaurus. Sin una
                base sólida de literature, no podemos identificar conceptos válidos ni relevancias.
              </p>
            </div>
            <ul>
              <li><strong>N°:</strong> Identificador único del artículo</li>
              <li><strong>Nombre Artículo:</strong> Título completo del trabajo científico</li>
              <li><strong>Link:</strong> URL permanente (DOI o URL directa a la publicación)</li>
              <li><strong>Abstract/Resumen:</strong> Resumen en idioma original (generalmente inglés)</li>
              <li><strong>Abstract en Español:</strong> Traducción y adaptación del resumen al español</li>
              <li><strong>Base de Datos:</strong> Fuente de donde se obtuvo (Springer, IEEE, Scopus, PubMed, etc.)</li>
              <li><strong>Conceptos:</strong> Términos clave y conceptos principales extraídos manualmente del artículo</li>
              <li><strong>Año:</strong> Año de publicación para análisis tendencial</li>
              <li><strong>Palabras Clave:</strong> Palabras clave autores + palabras clave identificadas por el revisor</li>
            </ul>

            <h3>Ejemplo Práctico: Artículo sobre IA en Educación</h3>
            <p>
              Para ilustrar cómo se completa esta estructura, tomemos el artículo &quot;Artificial
              intelligence in education research during 2013–2023&quot;:
            </p>
            <table className="tt-table">
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Contenido</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>N°</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>Nombre Artículo</td>
                  <td>Artificial intelligence in education research during 2013–2023: A review based on bibliometric analysis</td>
                </tr>
                <tr>
                  <td>Link</td>
                  <td>
                    <a href="https://link.springer.com/article/10.1007/s10639-024-12491-8" target="_blank" rel="noopener noreferrer">
                      https://link.springer.com/article/10.1007/s10639-024-12491-8
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Base de Datos</td>
                  <td>Springer</td>
                </tr>
                <tr>
                  <td>Año</td>
                  <td>2024</td>
                </tr>
                <tr>
                  <td>Conceptos Identificados</td>
                  <td>
                    <ul>
                      <li>Inteligencia Artificial en Educación (AIED)</li>
                      <li>Aprendizaje Automático (Machine Learning)</li>
                      <li>Robots Educativos</li>
                      <li>Sistemas de Recomendación</li>
                      <li>Calificación Automatizada</li>
                      <li>Análisis del Aprendizaje</li>
                      <li>Tutoría Inteligente</li>
                      <li>Minería de Datos</li>
                      <li>Visión Artificial</li>
                      <li>Reconocimiento de Voz</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>Palabras Clave</td>
                  <td>
                    <ul>
                      <li>educación superior</li>
                      <li>tecnologías de aprendizaje automático</li>
                      <li>implementaciones educativas</li>
                      <li>tendencias emergentes</li>
                      <li>STEM</li>
                      <li>análisis bibliométrico</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>Fase 1: Identificación de Conceptos Claves (Mejorada)</h3>
            <p>
              Con la recopilación estructurada en Excel, extraemos conceptos de múltiples fuentes
              simultáneamente. El proceso incluye:
            </p>
            <ul>
              <li><strong>Lectura de Abstracts:</strong> El abstract en español facilita identificar conceptos sin necesidad de leer el artículo completo</li>
              <li><strong>Extracción de Términos:</strong> Los &quot;Conceptos&quot; y &quot;Palabras Clave&quot; del Excel son candidatos directos para nuestro thesaurus</li>
              <li><strong>Normalización:</strong> Convertimos variaciones (ej: &quot;Machine Learning&quot; = &quot;Aprendizaje Automático&quot;) a formas estándar</li>
              <li><strong>Agrupación Temática:</strong> Organizamos conceptos por categorías: Metodologías, Tecnologías, Procesos, Resultados</li>
            </ul>

            <p>
              De nuestro ejemplo, identificamos que &quot;Aprendizaje Automático&quot; aparece en múltiples
              artículos como concepto central, así que se convierte en un término preferido en nuestro
              thesaurus.
            </p>

            <h3>Fase 2: Mapeo de Relaciones desde la Literatura</h3>
            <p>
              Una vez identificados los conceptos, establecemos relaciones entre ellos. En un thesaurus, las
              relaciones principales son:
            </p>
            <ul>
              <li>
                <strong>Relaciones Jerárquicas (BT/NT):</strong>
                <ul className="tt-nested">
                  <li>Desarrollo Ágil (Concepto más amplio) → Scrum, Kanban (Conceptos más específicos)</li>
                  <li>BPM (Concepto más amplio) → Modelado de Procesos, Optimización de Procesos</li>
                </ul>
              </li>
              <li>
                <strong>Relaciones Asociativas (RT):</strong> Vinculan conceptos que están relacionados pero no son jerárquicos.
                <ul className="tt-nested">
                  <li>Análisis de Datos ↔ Visualización de Datos</li>
                  <li>Python ↔ Jupyter Notebooks</li>
                </ul>
              </li>
              <li>
                <strong>Términos Preferidos y Alternos:</strong> Elegimos una forma estándar para cada concepto.
                <ul className="tt-nested">
                  <li>Preferido: &quot;Investigación Científica&quot; | Alterno: &quot;Investigación Rigurosa&quot;</li>
                  <li>Preferido: &quot;Base de Datos&quot; | Alterno: &quot;BD&quot;, &quot;Database&quot;</li>
                </ul>
              </li>
            </ul>

            <h3>Fase 2: Mapeo de Relaciones desde la Literatura</h3>
            <p>
              Los abstracts y palabras clave en nuestra tabla Excel revelan conexiones entre conceptos.
              Analizamos:
            </p>
            <ul>
              <li><strong>Co-ocurrencia de Términos:</strong> Si &quot;Aprendizaje Automático&quot; aparece junto con &quot;Robots Educativos&quot; en múltiples artículos, establecemos una relación asociativa (RT)</li>
              <li><strong>Jerquía Natural:</strong> El abstract de nuestro ejemplo menciona que &quot;Aprendizaje Automático&quot; es un componente técnico de &quot;IA en Educación&quot;, lo que sugiere una relación jerárquica</li>
              <li><strong>Contexto Disciplinar:</strong> Los artículos de la base de datos Springer en educación vs. ingeniería pueden revelar contextos de uso diferentes</li>
            </ul>

            <p>En nuestro ejemplo:</p>

            {/* Diagrama de Relaciones Jerárquicas */}
            <div className="tt-diagram">
              {/* Concepto Raíz */}
              <div className="tt-diagram-root">
                <div className="concept">🔼 INTELIGENCIA ARTIFICIAL EN EDUCACIÓN</div>
                <p className="tt-hint">(Concepto más amplio - BT)</p>
              </div>

              {/* Línea conectora visual */}
              <div className="tt-diagram-connector">
                <div />
              </div>

              {/* Conceptos Específicos (NT) */}
              <div className="tt-nt-grid">
                <div className="tt-nt-card">
                  <p>🔽 Aprendizaje Automático</p>
                  <p>(NT - Más específico)</p>
                </div>
                <div className="tt-nt-card">
                  <p>🔽 Visión Artificial</p>
                  <p>(NT - Más específico)</p>
                </div>
                <div className="tt-nt-card">
                  <p>🔽 Reconocimiento de Voz</p>
                  <p>(NT - Más específico)</p>
                </div>
              </div>

              {/* Separador */}
              <div className="tt-diagram-sep" />

              {/* Términos Relacionados (RT) */}
              <div style={{ marginTop: '30px' }}>
                <div className="tt-rt-box">
                  <p>↔️ Términos Relacionados (RT) de Aprendizaje Automático</p>
                  <p className="sub">Conceptos asociados pero no jerárquicos</p>
                </div>

                <div className="tt-rt-grid">
                  <div className="tt-rt-card"><p>📊 Árboles de Decisión</p></div>
                  <div className="tt-rt-card"><p>🧠 Deep Learning</p></div>
                  <div className="tt-rt-card"><p>🔗 Redes Neuronales</p></div>
                  <div className="tt-rt-card"><p>⛏️ Minería de Datos</p></div>
                </div>
              </div>
            </div>

            <h3>Fase 3: Definición de Descripciones y Alcance (Enriquecida)</h3>
            <p>
              Para cada concepto principal, creamos una nota de alcance que explica exactamente qué significa
              en nuestro contexto. Los abstracts en español de nuestra tabla Excel son insumos cruciales para
              escribir estas descripciones con precisión:
            </p>

            {/* Ficha: Nota de Alcance */}
            <div className="tt-scope">
              {/* Encabezado del Término */}
              <div className="tt-scope-head">
                <h4>📌 APRENDIZAJE AUTOMÁTICO</h4>
                <p>Machine Learning, Algoritmos de Aprendizaje</p>
              </div>

              {/* Nota de Alcance */}
              <div className="tt-scope-section">
                <h5>📖 Nota de Alcance</h5>
                <p>
                  Conjunto de técnicas computacionales que permiten a los sistemas aprender de datos sin ser
                  explícitamente programados. En educación, se utiliza para crear sistemas adaptativos que
                  mejoran la experiencia de aprendizaje. Incluye técnicas como árboles de decisión, deep
                  learning y redes neuronales.
                </p>
              </div>

              {/* Contexto de Uso */}
              <div className="tt-scope-section">
                <h5>🎓 Contexto de Uso</h5>
                <ul>
                  <li><strong>Educación superior:</strong> desarrollo de sistemas de recomendación</li>
                  <li><strong>Educación STEM:</strong> automatización de evaluaciones</li>
                  <li><strong>Educación general:</strong> análisis de patrones de aprendizaje</li>
                </ul>
              </div>

              {/* Relaciones Jerárquicas */}
              <div className="tt-scope-block">
                <h5>🔗 Relaciones Jerárquicas</h5>

                <div className="tt-rel-group">
                  <p className="tt-rel-label">🔼 Término Más Amplio (BT)</p>
                  <p className="tt-rel-value">Inteligencia Artificial en Educación</p>
                </div>

                <div className="tt-rel-group">
                  <p className="tt-rel-label">🔽 Términos Más Específicos (NT)</p>
                  <ul>
                    <li>Árboles de Decisión</li>
                    <li>Deep Learning</li>
                    <li>Redes Neuronales</li>
                  </ul>
                </div>

                <div className="tt-rel-group">
                  <p className="tt-rel-label">↔️ Términos Relacionados (RT)</p>
                  <ul>
                    <li>Minería de Datos</li>
                    <li>Análisis del Aprendizaje</li>
                    <li>Visión Artificial</li>
                  </ul>
                </div>
              </div>

              {/* Referencias */}
              <div className="tt-scope-refs">
                <h5>📚 Referencias Bibliográficas</h5>
                <ul>
                  <li><strong>Springer 2024:</strong> &quot;Artificial intelligence in education research during 2013–2023&quot;</li>
                </ul>
              </div>
            </div>

            <h3>Fase 4: Validación y Refinamiento</h3>
            <p>
              Presentamos el thesaurus preliminar a coordinadores y estudiantes líderes para obtener
              retroalimentación. Aspectos a validar usando la evidencia de la tabla Excel:
            </p>
            <ul>
              <li>¿Los términos reflejan realmente los conceptos en la literature recopilada?</li>
              <li>¿Las relaciones jerárquicas coinciden con cómo los autores presentan estos términos en los abstracts?</li>
              <li>¿Hay conceptos nuevos en los artículos más recientes que deberían añadirse?</li>
              <li>¿Las definiciones son claras y concordantes con los abstracts en español?</li>
              <li>¿Hemos capturado todas las variaciones terminológicas mencionadas en las palabras clave?</li>
            </ul>

            <p>
              Ejemplo de iteración: Si encontramos que &quot;Robótica Educativa&quot; y &quot;Robots
              Educativos&quot; aparecen como palabras clave en múltiples artículos, decidimos cual es la forma
              preferida y qué es alterno en nuestro thesaurus.
            </p>

            <h2>Cómo Usar la Tabla Excel en el Día a Día</h2>
            <p>Una vez construido el thesaurus, la tabla Excel continúa siendo valiosa:</p>
            <ul>
              <li><strong>Indexación Consistente:</strong> Cuando un nuevo estudiante agrega un artículo, usa los conceptos del thesaurus para llenar la columna &quot;Conceptos&quot;</li>
              <li><strong>Mejora Iterativa:</strong> Cada nuevo artículo puede sugerir refinamientos al thesaurus</li>
              <li><strong>Trazabilidad:</strong> La columna &quot;Link&quot; permite verificar directamente en la literatura cualquier definición o relación</li>
              <li><strong>Análisis Tendencial:</strong> La columna &quot;Año&quot; permite ver si ciertos conceptos están en alza o declive en la literature</li>
              <li><strong>Análisis por Base de Datos:</strong> Comprender si conceptos específicos prevalecen en ciertas disciplinas (Springer vs IEEE vs PubMed)</li>
            </ul>

            <h2>Beneficios Observados</h2>
            <div className="highlight-box">
              <p>✨ Mejora en la Comunicación: Los estudiantes usan una terminología consistente en documentos y presentaciones.</p>
            </div>
            <div className="highlight-box">
              <p>📚 Facilita la Búsqueda: Es más fácil encontrar trabajos anteriores relacionados con nuestros nuevos proyectos.</p>
            </div>
            <div className="highlight-box">
              <p>🔗 Crea Sinergias: Identificamos conexiones entre proyectos que comparten conceptos fundamentales.</p>
            </div>
            <div className="highlight-box">
              <p>📖 Preserva el Conocimiento: El thesaurus se convierte en un recurso duradero que nuevas generaciones pueden usar.</p>
            </div>

            <h2>Herramientas para Crear y Mantener un Thesaurus</h2>
            <ul>
              <li><strong>Herramientas Especializadas:</strong> TemaTres, Skos Editor, VocBench</li>
              <li><strong>Opciones Simples:</strong> Hojas de cálculo estructuradas, Documentos colaborativos (Google Docs, Notion)</li>
              <li><strong>Estándares Internacionales:</strong> SKOS (Simple Knowledge Organization System), ISO 25964-1</li>
            </ul>

            <h2>Próximos Pasos en el Semillero Mamba</h2>
            <p>Estamos en proceso de:</p>
            <ol>
              <li>Establecer la tabla Excel estándar como herramienta base para recopilación de artículos</li>
              <li>Alimentar el thesaurus inicial desde los 150+ artículos ya recopilados en la tabla</li>
              <li>Crear un diccionario de conceptos con 200+ términos definidos, cada uno con referencias a artículos (links)</li>
              <li>Implementar el thesaurus en herramientas colaborativas (Google Sheets + documentación en Wiki)</li>
              <li>Capacitar a todos los estudiantes en: cómo usar la tabla Excel, cómo aplicar el thesaurus al indexar artículos, cómo proponer nuevos términos</li>
              <li>Revisar y actualizar trimestralmente el thesaurus según emergen nuevos conceptos en la literature</li>
              <li>Publicar el thesaurus como recurso abierto de la institución (Creative Commons)</li>
            </ol>

            <h2>El Flujo de Trabajo Integrado</h2>
            <p>El proceso completo funciona como un ciclo virtuoso:</p>
            <ol className="tt-flow">
              <li>
                <strong>DESCUBRIMIENTO</strong>
                <ul>
                  <li>Estudiante encuentra un artículo relevante sobre su tema</li>
                </ul>
              </li>
              <li>
                <strong>DOCUMENTACIÓN</strong>
                <ul>
                  <li>Completa la tabla Excel con todos los campos</li>
                  <li>Especialmente: Abstract en Español, Conceptos, Palabras Clave</li>
                </ul>
              </li>
              <li>
                <strong>INDEXACIÓN</strong>
                <ul>
                  <li>Usa el Thesaurus para normalizar los Conceptos</li>
                  <li>Selecciona términos preferidos del thesaurus</li>
                  <li>Agrega nuevas palabras clave si introduce conceptos nuevos</li>
                </ul>
              </li>
              <li>
                <strong>RETROALIMENTACIÓN</strong>
                <ul>
                  <li>El equipo revisa si nuevos términos deben agregarse al thesaurus</li>
                  <li>Se enriquece el thesaurus de forma iterativa</li>
                </ul>
              </li>
              <li>
                <strong>SÍNTESIS</strong>
                <ul>
                  <li>Análisis anual de tendencias por año, base de datos, conceptos</li>
                  <li>Visualización de qué áreas están ganando relevancia</li>
                  <li>Base para planificación de nuevas líneas de investigación</li>
                </ul>
              </li>
            </ol>

            <h2>Conclusión</h2>
            <p>
              Construir un thesaurus sobre investigación no es solo una tarea administrativa, es una
              inversión estratégica en la calidad y profesionalismo de nuestro trabajo académico. Lo valioso
              de este proceso es que comienza donde todos los investigadores ya están: recopilando artículos
              en una tabla Excel bien estructurada.
            </p>
            <p>
              La tabla Excel es tanto un coleccionador de conocimiento como un generador de insights. Con la
              estructura correcta (N°, Nombre, Link, Abstracts, Base de Datos, Conceptos, Año, Palabras
              Clave), cada artículo ingresado alimenta automáticamente la construcción del thesaurus. Los
              conceptos que hoy catalogas, mañana se convierten en términos controlados que toda la
              comunidad usa.
            </p>
            <p>
              Al normalizar nuestro vocabulario y mantener la trazabilidad de cada concepto a su origen en la
              literature, mejoramos la comunicación, facilitamos la transferencia de conocimiento entre
              generaciones, y aseguramos que el Semillero Mamba evolucione como un ecosistema investigativo
              sólido, profesional y duradero.
            </p>
            <p style={{ marginTop: '20px', fontWeight: 600, color: 'var(--secondary-green)' }}>
              ¿Estás listo para ser parte de esta construcción? Cada artículo que documentes, cada concepto
              que identifiques, enriquece nuestro thesaurus colectivo. Tu contribución importa. 🚀
            </p>

            {/* Sección de Descarga del Thesaurus */}
            <div className="tt-download">
              <h3>📥 Descarga Nuestro Thesaurus</h3>
              <p>
                Para contribuir al desarrollo del vocabulario controlado de nuestro semillero, descarga el
                archivo del Thesaurus estructurado que guía la indexación de artículos.
              </p>
              <a
                href="/Documentos/Thesaurus.xlsx"
                download="Thesaurus_SemilleroMamba.xlsx"
                className="tt-download-btn"
              >
                ⬇️ Descargar Thesaurus.xlsx
              </a>
            </div>

            <div className="tt-article-note">
              <p>
                <strong>Sobre este artículo:</strong> Esta guía fue desarrollada por los coordinadores del
                Semillero Mamba como parte de nuestro compromiso con la excelencia académica y la
                formalización del conocimiento científico.
              </p>
            </div>
          </article>

          {/* Related Posts */}
          <section className="max-w-3xl mx-auto my-15 p-10 bg-[#f8f9fa] rounded-lg">
            <h3 className="text-[#1a7c5e] text-2xl font-bold mb-5 text-center">
              Otros artículos en el Blog
            </h3>
            <a
              href="/blog/como-comenzamos"
              className="block bg-white p-4 my-2 border-l-4 border-[#2a9d7e] rounded shadow-sm hover:translate-x-1 transition-transform no-underline text-inherit"
            >
              <strong className="text-[#1a7c5e]">Cómo comenzamos en la investigación</strong><br />
              <span className="text-gray-600 text-sm">Los primeros pasos del Semillero Mamba: dudas, entusiasmo y la transformación que ocurre cuando generas conocimiento nuevo...</span>
            </a>
            <Link
              href="/#blog"
              className="block bg-white p-4 my-2 border-l-4 border-[#2a9d7e] rounded shadow-sm hover:translate-x-1 transition-transform no-underline text-inherit"
            >
              <strong className="text-[#1a7c5e]">Ver todo el Blog</strong><br />
              <span className="text-gray-600 text-sm">Explora todos los artículos, proyectos y metodologías del Semillero Mamba...</span>
            </Link>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-[#2c3e50] text-white text-center py-8 px-5 mt-15">
        <div className="max-w-6xl mx-auto">
          <p className="my-2 text-sm"><strong>Semillero de Investigación Mamba</strong></p>
          <p className="my-2 text-sm">Corporación Universitaria del Huila - CORHUILA</p>
          <p className="my-2 text-sm">Programa de Ingeniería de Sistemas</p>
          <p className="my-2 text-sm">
            📧{' '}
            <a href="mailto:julian.quimbayo@corhuila.edu.co" className="text-[#2a9d7e] no-underline hover:opacity-80 transition-opacity">
              julian.quimbayo@corhuila.edu.co
            </a>
            {' | '}
            📧{' '}
            <a href="mailto:jmllanosm@corhuila.edu.co" className="text-[#2a9d7e] no-underline hover:opacity-80 transition-opacity">
              jmllanosm@corhuila.edu.co
            </a>
          </p>
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

      {/* WhatsApp Button */}
      <a
        href="https://chat.whatsapp.com/LC9bMjYmFqN4LUfGLDOMX0"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button fixed bottom-8 right-8 w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform z-40 no-underline"
        title="Únete al grupo de WhatsApp del Semillero Mamba"
      >
        <span className="text-3xl">💬</span>
      </a>
    </div>
  );
}
