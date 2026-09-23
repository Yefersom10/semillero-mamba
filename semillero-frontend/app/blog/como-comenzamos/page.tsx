'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ComoComenzamosPage() {
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);

  const openImageModal = (src: string) => {
    setModalImageSrc(src);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setModalImageSrc(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeImageModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

        /* Capa del modal por encima del botón flotante de WhatsApp (z-index: 999 global) */
        .blog-image-modal { z-index: 1000; }

        @media (max-width: 768px) {
          .header-content {
            grid-template-columns: 1fr;
            grid-template-areas: "logo" "title" "nav";
          }
          .logo-section, .header-title, .header-nav {
            justify-content: center;
            text-align: center;
          }
          /* En móvil el header se apila y crece mucho: se deja en el flujo
             normal (static) para que nunca tape el contenido al hacer scroll */
          .header-bg {
            position: static;
          }
        }

        .blog-header-bg {
          background: linear-gradient(135deg, var(--light-bg) 0%, white 100%);
        }

        .highlight-box {
          background: linear-gradient(135deg, rgba(26, 124, 94, 0.05) 0%, rgba(42, 157, 126, 0.05) 100%);
          border-left: 4px solid var(--secondary-green);
        }

        .student-testimony {
          background: white;
          border: 2px solid var(--secondary-green);
          border-left: 5px solid var(--accent-red);
        }

        .back-button {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
        }

        .whatsapp-button {
          background: linear-gradient(135deg, #25d366 0%, #1fab89 100%);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            transform: translate(-50%, -60%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }

        .animate-fadeIn { animation: fadeIn 0.3s forwards; }
        .animate-slideIn { animation: slideIn 0.3s forwards; }
      `}</style>

      {/* Header Sticky: ocupa espacio en el flujo, por lo que el contenido
          siempre comienza debajo de él y la barra nunca lo tapa */}
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

      {/* Main Container: sin padding extra, el header sticky ya ocupa su espacio */}
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-5 w-full my-5 py-4 border-b border-gray-300">
          <Link href="/" className="text-[#2a9d7e] hover:opacity-80 hover:underline transition-all">
            ← Volver al sitio principal
          </Link>
        </div>

        {/* Blog Header */}
        <div className="blog-header-bg py-10 px-5 text-center mb-10">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-3xl md:text-4xl text-[#1a7c5e] font-bold mb-4">
              Cómo comenzamos en la investigación
            </h2>
            <div className="flex justify-center gap-5 flex-wrap text-gray-600 text-sm mb-5">
              <span className="flex items-center gap-1">📋 Publicado: 19 de Febrero, 2026</span>
              <span className="flex items-center gap-1">👨‍💻 Coordinadores del semillero</span>
              <span className="flex items-center gap-1">⏱️ 8 minutos de lectura</span>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="max-w-6xl mx-auto px-5 w-full">
          <article className="max-w-3xl mx-auto p-5 md:p-10 bg-white rounded-lg shadow-sm">
            <h2 className="text-[#1a7c5e] text-2xl font-bold mt-2 mb-4 scroll-mt-36">
              Descubriendo el Mundo de la Investigación Académica
            </h2>

            <p className="mb-4 leading-relaxed text-gray-700 text-justify">
              Cuando nuestros estudiantes ingresan al Semillero Mamba, muchos llegan con una pregunta común:
              &ldquo;¿Por qué la investigación?&rdquo; Este blog post nace de esas conversaciones iniciales, de los primeros
              pasos titubeantes, y de la transformación que ocurre cuando descubres que eres capaz de generar
              conocimiento nuevo.
            </p>

            <h3 className="text-[#2a9d7e] text-xl font-semibold mt-6 mb-3">
              Los Primeros Pasos: Dudas y Entusiasmo
            </h3>

            <p className="mb-4 leading-relaxed text-gray-700 text-justify">
              La investigación académica puede parecer un camino imposible cuando recién comienzas. Nadie te enseña
              exactamente cómo comenzar, y los libros de metodología parecen escritos en otro idioma. Nuestros
              estudiantes iniciales sintieron exactamente lo mismo. Sin embargo, descubrieron que con el apoyo
              adecuado, la mentoría de profesores experimentados y el trabajo en equipo, el proceso se vuelve no solo
              comprensible, sino fascinante.
            </p>

            <div className="highlight-box p-5 my-6 rounded-md">
              <p className="text-[#1a7c5e] font-semibold italic">
                &ldquo;El primer día pensé que no sería capaz, pero después de escuchar los problemas reales que
                necesitaban soluciones, vi que la investigación era algo tangible y alcanzable.&rdquo;
              </p>
            </div>

            <h3 className="text-[#2a9d7e] text-xl font-semibold mt-6 mb-3">
              ¿Qué es Realmente la Investigación?
            </h3>

            <p className="mb-4 leading-relaxed text-gray-700 text-justify">
              En el Semillero Mamba, descubrimos que la investigación no es solo leer papers o escribir reportes.
              Es un proceso vivo donde:
            </p>

            <div className="my-7 text-center">
              <img
                src="/Imagenes/research-process-diagram.png"
                alt="Proceso de Investigación Paso a Paso"
                className="max-w-full h-auto rounded-lg shadow-md my-2 border-2 border-gray-100 cursor-zoom-in hover:opacity-95 transition-all"
                onClick={() => openImageModal('/Imagenes/research-process-diagram.png')}
              />
              <div className="text-center text-sm text-gray-500 italic mt-2 mb-7">
                📊 Figura 1: Proceso de investigación del Semillero Mamba
                <span className="inline-block ml-2 px-2 py-0.5 bg-[#2a9d7e] text-white rounded-full text-xs font-semibold">
                  🔍 Haz clic para ampliar
                </span>
              </div>
            </div>

            <ul className="my-5 ml-7 list-disc space-y-2 text-gray-700 leading-relaxed">
              <li><strong>Identificas problemas reales:</strong> En desarrollo de software, calidad de software, análisis de datos y arquitectura</li>
              <li><strong>Propones soluciones:</strong> Basadas en métodos científicos y pruebas rigurosas</li>
              <li><strong>Aprendes continuamente:</strong> De tus errores y de las contribuciones de tu equipo</li>
              <li><strong>Generas impacto:</strong> Tus resultados pueden ayudar a empresas y otras instituciones académicas</li>
              <li><strong>Creces profesionalmente:</strong> Adquiriendo habilidades que te diferencian en el mercado laboral</li>
            </ul>

            <h3 className="text-[#2a9d7e] text-xl font-semibold mt-6 mb-3">
              Nuestras Líneas de Investigación
            </h3>

            <p className="mb-4 leading-relaxed text-gray-700 text-justify">
              En el Semillero Mamba, trabajamos en cuatro líneas estratégicas que reflejan los desafíos actuales
              de la ingeniería de sistemas:
            </p>

            <div className="student-testimony p-5 my-6 rounded-lg">
              <p className="text-[#1a7c5e] font-semibold mb-2">💻 Desarrollo de Software</p>
              <p className="text-gray-600">
                Exploramos metodologías ágiles, patrones de diseño, y arquitecturas modernas que permiten crear
                software de calidad de forma eficiente.
              </p>
            </div>

            <div className="student-testimony p-5 my-6 rounded-lg">
              <p className="text-[#1a7c5e] font-semibold mb-2">✅ Calidad de Software</p>
              <p className="text-gray-600">
                Investigamos técnicas de testing, aseguramiento de calidad, y mejora continua de procesos para
                garantizar que el software sea confiable y mantenible.
              </p>
            </div>

            <div className="student-testimony p-5 my-6 rounded-lg">
              <p className="text-[#1a7c5e] font-semibold mb-2">📈 Análisis de Datos</p>
              <p className="text-gray-600">
                Aprendemos a extraer insights valiosos de grandes volúmenes de datos, utilizando herramientas
                modernas y técnicas estadísticas avanzadas.
              </p>
            </div>

            <div className="student-testimony p-5 my-6 rounded-lg">
              <p className="text-[#1a7c5e] font-semibold mb-2">🏗️ Arquitectura de Software</p>
              <p className="text-gray-600">
                Diseñamos sistemas escalables, mantenibles y resilientes, considerando patrones arquitectónicos
                que resuelven problemas empresariales complejos.
              </p>
            </div>

            <h3 className="text-[#2a9d7e] text-xl font-semibold mt-6 mb-3">
              La Metodología del Semillero
            </h3>

            <p className="mb-4 leading-relaxed text-gray-700 text-justify">
              Lo que hace especial al Semillero Mamba es nuestra metodología práctica:
            </p>

            <div className="my-7 text-center">
              <img
                src="/Imagenes/research-cycle.png"
                alt="Ciclo de Investigación Científica"
                className="max-w-full h-auto rounded-lg shadow-md my-2 border-2 border-gray-100 cursor-zoom-in hover:opacity-95 transition-all"
                onClick={() => openImageModal('/Imagenes/research-cycle.png')}
              />
              <div className="text-center text-sm text-gray-500 italic mt-2 mb-7">
                🔄 Figura 2: Ciclo de investigación científica
                <span className="inline-block ml-2 px-2 py-0.5 bg-[#2a9d7e] text-white rounded-full text-xs font-semibold">
                  🔍 Haz clic para ampliar
                </span>
              </div>
            </div>

            <ol className="my-5 ml-7 list-decimal space-y-2 text-gray-700 leading-relaxed">
              <li><strong>Mentoría personalizada:</strong> Trabajamos con profesores con experiencia en investigación y en la industria</li>
              <li><strong>Proyectos reales:</strong> Abordamos problemas auténticos que requieren soluciones innovadoras</li>
              <li><strong>Colaboración:</strong> Trabajamos en equipos multidisciplinarios donde aprendes a comunicar ideas complejas</li>
              <li><strong>Publicación y difusión:</strong> Nuestros resultados se comparten en conferencias y revistas académicas</li>
              <li><strong>Impacto empresarial:</strong> Buscamos transferir tecnología a las empresas de nuestra región</li>
            </ol>

            <h3 className="text-[#2a9d7e] text-xl font-semibold mt-6 mb-3">
              Testimonios de Nuestros Estudiantes
            </h3>

            <div className="student-testimony p-5 my-6 rounded-lg">
              <p className="text-[#1a7c5e] font-semibold mb-2">👨‍🎓 Juan (Semestre 4)</p>
              <p className="text-gray-600">
                &ldquo;Cuando llegué, no sabía ni cómo leer un paper académico. Hoy estoy contribuyendo a un proyecto sobre
                testing automatizado. La diferencia es la guía de mis coordinadores y el ambiente colaborativo.&rdquo;
              </p>
              <p className="mt-5 text-gray-400 text-sm italic">Ingeniería de Sistemas</p>
            </div>

            <div className="student-testimony p-5 my-6 rounded-lg">
              <p className="text-[#1a7c5e] font-semibold mb-2">👩‍🎓 María (Semestre 6)</p>
              <p className="text-gray-600">
                &ldquo;Lo que más me gusta del semillero es que no solo aprendes teoría. Trabajas en problemas que importan,
                usas tecnología moderna, y construyes tu portafolio profesional desde temprano.&rdquo;
              </p>
              <p className="mt-5 text-gray-400 text-sm italic">Ingeniería de Sistemas</p>
            </div>

            <h3 className="text-[#2a9d7e] text-xl font-semibold mt-6 mb-3">
              ¿Cómo Puedo Comenzar?
            </h3>

            <p className="mb-4 leading-relaxed text-gray-700 text-justify">
              Si te sientes identificado con esta descripción, aquí es lo que tienes que hacer:
            </p>

            <div className="highlight-box p-5 my-6 rounded-md">
              <p className="text-[#1a7c5e] font-semibold italic leading-relaxed">
                1. Accede al grupo de WhatsApp del Semillero Mamba<br />
                2. Contacta a nuestros coordinadores: Ing. Julián Quimbayo e Ing. José Miguel Llanos<br />
                3. Asiste a nuestras reuniones semanales (Miércoles, 5:00 PM - 5:40 PM) -{' '}
                <a
                  href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_OTkzMGQ3YmEtMDk5Zi00NzRjLWI0NGYtZTJkMzI1MTE1ZDI1%40thread.v2/0?context=%7b%22Tid%22%3a%22d385fb6e-0c24-42db-9c26-2ad22ecc40c9%22%2c%22Oid%22%3a%22592f50cf-43bd-4ffa-85ce-3afbc98304d7%22%7d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d32f2f] font-semibold no-underline hover:opacity-70 transition-opacity"
                >
                  Unirse aquí
                </a>
                <br />
                4. ¡Comienza tu viaje de investigación!
              </p>
            </div>

            {/* Sección de Propuestas de Investigación */}
            <h3 className="mt-10 text-xl font-semibold text-[#1a7c5e] mb-3">
              🔬 ¿Tienes una Idea de Investigación?
            </h3>
            <p className="mb-4 leading-relaxed text-gray-700 text-justify">
              Si tienes una propuesta innovadora o un problema que te gustaría investigar, ¡queremos escucharte! El Semillero Mamba busca constantemente nuevas ideas que contribuyan al conocimiento académico y al desarrollo tecnológico de nuestra región.
            </p>

            <div className="mt-5 p-6 bg-gradient-to-br from-[#fff8f0] to-[#ffe8d6] rounded-lg border-l-4 border-[#d32f2f]">
              <h4 className="text-[#d32f2f] font-bold mb-3 text-lg">📋 Descarga el Formato de Propuesta</h4>
              <p className="mb-4 text-gray-800">
                Completa el formato adjunto con tu propuesta de investigación. Esto nos ayuda a entender mejor tu idea, los objetivos, el impacto esperado y tu perfil académico.
              </p>
              <p className="mb-4 text-gray-800">
                <strong>¿Qué incluir?</strong> Título, resumen ejecutivo, descripción del problema, objetivos, metodología propuesta y relevancia académica/profesional.
              </p>
              <a
                href="/Documentos/Anexo 1 Formato para la presentación de propuestas de CTeI.xlsx"
                download="Propuesta_Investigacion_SemilleroMamba.xlsx"
                className="inline-block bg-gradient-to-r from-[#d32f2f] to-[#f44146] text-[#ffffff] px-6 py-3 rounded font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                ⬇️ Descargar Formato de Propuesta
              </a>
            </div>

            <p className="mt-5 text-gray-600">
              Una vez completes tu propuesta, envíala a nuestros coordinadores para evaluación. ¡Esperamos conocer tus ideas!
            </p>

            <h3 className="text-[#2a9d7e] text-xl font-semibold mt-6 mb-3">
              Reflexión Final
            </h3>

            <p className="mb-4 leading-relaxed text-gray-700 text-justify">
              La investigación no es privilegio de pocos. Es una disciplina que cualquier estudiante comprometido
              puede aprender y dominar. En el Semillero Mamba, creemos que el verdadero aprendizaje ocurre cuando
              combinamos teoría, práctica, mentoría y la pasión por generar conocimiento nuevo.
            </p>

            <p className="mb-4 leading-relaxed text-gray-700 text-justify">
              Tu primer proyecto, tu primer paper, tu primer descubrimiento... todo comienza con un simple paso:
              decidir que eres más que un consumidor de conocimiento. Que eres un generador de conocimiento.
              Y eso, mis queridos estudiantes, puede cambiar todo.
            </p>

            <p className="mt-10 text-center italic text-[#2a9d7e]">
              — Coordinadores del Semillero Mamba
            </p>

            <Link
              href="/#blog"
              className="back-button inline-block text-white px-7 py-3 rounded font-semibold mt-7 no-underline hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              ← Volver al Blog
            </Link>
          </article>

          {/* Related Posts */}
          <section className="max-w-3xl mx-auto my-15 p-10 bg-[#f8f9fa] rounded-lg">
            <h3 className="text-[#1a7c5e] text-2xl font-bold mb-5 text-center">
              Otros artículos en el Blog
            </h3>
            <a
              href="#"
              className="block bg-white p-4 my-2 border-l-4 border-[#2a9d7e] rounded shadow-sm hover:translate-x-1 transition-transform no-underline text-inherit"
            >
              <strong className="text-[#1a7c5e]">Metodologías de Investigación</strong><br />
              <span className="text-gray-600 text-sm">Comparte tus aprendizajes sobre metodologías en BPM, análisis de datos y más...</span>
            </a>
            <a
              href="#"
              className="block bg-white p-4 my-2 border-l-4 border-[#2a9d7e] rounded shadow-sm hover:translate-x-1 transition-transform no-underline text-inherit"
            >
              <strong className="text-[#1a7c5e]">Proyectos Destacados</strong><br />
              <span className="text-gray-600 text-sm">Historias de proyectos exitosos: desde problemas identificados hasta soluciones implementadas...</span>
            </a>
          </section>
        </div>
      </main>

      {/* Footer */}
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

      {/* Modal para imágenes ampliadas */}
      {modalImageSrc && (
        <div
          className="blog-image-modal fixed inset-0 z-50 bg-black/70 animate-fadeIn"
          onClick={closeImageModal}
        >
          <span
            className="absolute top-5 right-10 text-white text-4xl font-bold cursor-pointer hover:opacity-70 transition-opacity z-10"
            onClick={closeImageModal}
          >
            &times;
          </span>
          <img
            src={modalImageSrc}
            alt="Imagen ampliada"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90vw] max-h-[90vh] object-contain animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}