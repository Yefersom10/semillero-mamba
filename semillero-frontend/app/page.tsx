'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import Chatbot, { UserRole } from '@/components/Chatbot';

// 1. Importamos el servicio de Axios y la interfaz tipada
import { proyectosService } from '@/services/backend.service';
import { Proyecto } from '@/types/api';

export default function HomePage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Rol del usuario actual
  const currentUserRole: UserRole = 'estudiante';

  useEffect(() => {
    async function cargarProyectosInicio() {
      try {
        setLoading(true);
        
        // 2. Usamos directamente el endpoint de NestJS vía Axios
        const data = await proyectosService.getPublicos();

        // Leemos los IDs guardados como destacados si aplica
        const rawDestacados = localStorage.getItem('proyectos_destacados');
        const IDsDestacados: string[] = rawDestacados
          ? (JSON.parse(rawDestacados) as unknown[])
            .map((id) => String(id))
            .filter((id) => id && id.trim() !== '' && id !== 'undefined' && id !== 'null')
          : [];

        // Si existen destacados en localStorage, filtramos; si no, mostramos todos los públicos devueltos
        const proyectosFiltrados = IDsDestacados.length > 0
          ? data.filter((p) => IDsDestacados.includes(String(p.id)))
          : data;

        setProyectos(proyectosFiltrados);
      } catch (err) {
        console.error('❌ Error al cargar proyectos desde NestJS:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    cargarProyectosInicio();
  }, []);

  const truncateText = (text?: string, length = 130) => {
    if (!text) return 'Sin descripción disponible.';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          overflow-x: hidden;
          width: 100%;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
        }

        /* Colores CORHUILA */
        :root {
          --primary-green: #1a7c5e;
          --secondary-green: #2a9d7e;
          --accent-red: #d32f2f;
          --light-bg: #f8f9fa;
          --dark-text: #2c3e50;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        }

        @media (min-width: 768px) {
          .container {
            padding: 0 24px;
          }
        }

        /* HERO SECTION */
        .hero {
          background: linear-gradient(135deg, var(--light-bg) 0%, white 100%);
          padding: 40px 16px;
          text-align: center;
        }

        @media (min-width: 768px) {
          .hero {
            padding: 80px 20px;
          }
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
        }

        /* Contenedor que agrupa el logo y el título */
        .hero-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        /* Cambio a disposición horizontal en tablets y pantallas más grandes */
        @media (min-width: 768px) {
          .hero-header {
            flex-direction: row;
            text-align: left;
            gap: 24px;
          }
        }

        .hero-logo {
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo-main {
          border-radius: 50%;
          object-fit: cover;
          width: 100px;
          height: 100px;
        }

        @media (min-width: 768px) {
          .logo-main {
            width: 140px;
            height: 140px;
          }
        }

        .hero h2 {
          font-size: 1.8em;
          color: var(--primary-green);
          font-weight: 700;
          word-break: break-word;
          margin: 0;
        }

        @media (min-width: 768px) {
          .hero h2 {
            font-size: 2.3em;
          }
        }

        .hero p {
          font-size: 1em;
          color: #666;
          margin-bottom: 10px;
        }

        @media (min-width: 768px) {
          .hero p {
            font-size: 1.1em;
          }
        }

        .creation-year {
          margin-top: 10px;
          font-size: 0.9em;
          color: var(--accent-red);
          font-weight: 600;
        }

        /* SECCIONES Y TITULOS */
        section {
          padding: 40px 0;
        }

        @media (min-width: 768px) {
          section {
            padding: 60px 0;
          }
        }

        section:nth-child(even) {
          background: var(--light-bg);
        }

        .section-title {
          font-size: 1.5em;
          color: var(--primary-green);
          margin-bottom: 24px;
          text-align: center;
          font-weight: 700;
          word-break: break-word;
        }

        @media (min-width: 768px) {
          .section-title {
            font-size: 2em;
            margin-bottom: 30px;
          }
        }

        /* OBJETIVOS ESPECÍFICOS Y GRIDS */
        .objective-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 20px;
        }

        @media (min-width: 640px) {
          .objective-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .objective-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            margin-top: 30px;
          }
        }

        .objective-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-left: 5px solid var(--secondary-green);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .objective-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .objective-card h4 {
          color: var(--primary-green);
          margin-bottom: 10px;
          font-size: 1.05em;
        }

        .objective-card p {
          color: #666;
          line-height: 1.6;
          font-size: 0.9em;
        }

        /* LÍNEAS DE INVESTIGACIÓN */
        .lines-research {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-top: 20px;
        }

        @media (min-width: 500px) {
          .lines-research {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 900px) {
          .lines-research {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 30px;
          }
        }

        .research-line {
          background: linear-gradient(135deg, var(--light-bg) 0%, white 100%);
          border: 2px solid var(--secondary-green);
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          font-size: 0.9em;
          color: var(--primary-green);
          font-weight: 600;
          word-break: break-word;
        }

        /* MISIÓN Y VISIÓN */
        .vision-mission {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 20px;
        }

        @media (min-width: 768px) {
          .vision-mission {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin-top: 30px;
          }
        }

        .vm-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-top: 4px solid var(--accent-red);
        }

        @media (min-width: 768px) {
          .vm-card {
            padding: 30px;
          }
        }

        .vm-card h3 {
          color: var(--primary-green);
          margin-bottom: 12px;
          font-size: 1.2em;
        }

        .vm-card p {
          color: #666;
          line-height: 1.7;
          font-size: 0.95em;
        }

        /* COORDINADORES */
        .coordinators {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 20px;
        }

        @media (min-width: 640px) {
          .coordinators {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin-top: 30px;
          }
        }

        .coordinator-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          text-align: center;
          border-top: 4px solid var(--secondary-green);
          word-break: break-word;
        }

        .coordinator-photo {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 15px;
          border: 3px solid var(--secondary-green);
        }

        @media (min-width: 768px) {
          .coordinator-photo {
            width: 150px;
            height: 150px;
          }
        }

        .coordinator-card h4 {
          color: var(--primary-green);
          margin-bottom: 6px;
          font-size: 1.1em;
        }

        .coordinator-card p {
          color: #666;
          margin: 4px 0;
          font-size: 0.9em;
        }

        /* EVENTOS */
        .events-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 20px;
        }

        .event-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          border-left: 5px solid var(--accent-red);
        }

        @media (min-width: 768px) {
          .event-card {
            padding: 25px;
          }
        }

        .event-card h4 {
          color: var(--primary-green);
          margin-bottom: 10px;
          font-size: 1.1em;
          font-weight: 700;
        }

        .event-date {
          color: var(--accent-red);
          font-size: 0.85em;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .event-card p {
          color: #666;
          font-size: 0.9em;
          line-height: 1.6;
        }

        .teams-btn {
          background: linear-gradient(135deg, #1a7c5e 0%, #2a9d7e 100%);
          color: white;
          padding: 12px 18px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          display: inline-block;
          transition: opacity 0.3s;
          text-align: center;
          width: 100%;
          font-size: 0.9em;
        }

        @media (min-width: 640px) {
          .teams-btn {
            width: auto;
          }
        }

        /* VIDEOS */
        .videos-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e8f5f3 100%);
        }

        .video-card {
          background: white;
          padding: 24px 16px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        @media (min-width: 768px) {
          .video-card {
            padding: 40px;
          }
        }

        .video-card h4 {
          color: var(--primary-green);
          font-size: 1.4em;
          margin-bottom: 12px;
        }

        @media (min-width: 768px) {
          .video-card h4 {
            font-size: 1.8em;
          }
        }

        .video-card p {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .video-button {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          display: inline-block;
          transition: transform 0.3s, box-shadow 0.3s;
          font-size: 0.95em;
          width: 100%;
        }

        @media (min-width: 640px) {
          .video-button {
            width: auto;
            padding: 15px 40px;
            font-size: 1.05em;
          }
        }

        /* BLOG */
        .blog-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 20px;
        }

        @media (min-width: 640px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            margin-top: 30px;
          }
        }

        .blog-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
          display: flex;
          flex-direction: column;
        }

        .blog-header {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
          color: white;
          padding: 15px;
          min-height: 65px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 2em;
        }

        .blog-content {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .blog-card h3 {
          color: var(--primary-green);
          margin-bottom: 8px;
          font-size: 1.05em;
          font-weight: 700;
        }

        .blog-author {
          color: #888;
          font-size: 0.8em;
          margin-bottom: 10px;
        }

        .blog-card p {
          color: #666;
          font-size: 0.88em;
          line-height: 1.5;
          flex: 1;
        }

        .blog-link {
          color: var(--primary-green);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85em;
          margin-top: 15px;
          display: inline-block;
        }

        .blog-coming-soon {
          display: inline-block;
          margin-top: 15px;
          color: var(--accent-red);
          font-weight: 600;
          font-size: 0.85em;
        }


        @media (min-width: 640px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .projects-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            margin-top: 30px;
          }
        }

        .card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          border-left: 5px solid var(--secondary-green);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        /* BOTÓN WHATSAPP */
        .whatsapp-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #25d366 0%, #1fab89 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
          transition: transform 0.3s, box-shadow 0.3s;
          z-index: 999;
          text-decoration: none;
        }

        @media (min-width: 768px) {
          .whatsapp-button {
            width: 60px;
            height: 60px;
            bottom: 30px;
            right: 30px;
          }
        }

        .whatsapp-button:hover {
          transform: scale(1.1);
        }

        .small-text {
          font-size: 0.9em;
          color: #666;
        }

        .mt-12 {
          margin-top: 12px;
        }

        .btn-secondary {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
          color: white;
          border-radius: 6px;
          transition: opacity 0.3s, transform 0.3s;
        }

        .btn-secondary:hover {
          opacity: 0.9;
        }
      `}</style>

      <NavbarPublic />

      {/* HERO SECTION */}
      <section className="hero" id="inicio">
        <div className="hero-content">
          <div className="hero-header">
            <div className="hero-logo">
              <Image
                src="/Logo/Logo.png"
                alt="Logo Mamba"
                width={200}
                height={200}
                className="logo-main"
                priority
              />
            </div>
            <h2>Bienvenido al Semillero Mamba</h2>
          </div>

          <p>
            Espacio académico de investigación en desarrollo de software, calidad
            de software, análisis de datos e inteligencia artificial y arquitectura de software
          </p>
          <div className="creation-year">Creado en 2017 • CORHUILA</div>
        </div>
      </section>

      {/* OBJETIVO GENERAL */}
      <section className="container">
        <h3 className="section-title">Objetivo General</h3>
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          <p className="small-text">
            Generar un espacio académico de trabajo, para el fortalecimiento de la
            investigación, que permita la adquisición y aplicación de conocimientos
            definidos para las líneas de investigación, con el fin de fortalecer y
            consolidar la calidad profesional de los integrantes y la comunidad.
          </p>
        </div>
      </section>

      {/* OBJETIVOS ESPECÍFICOS */}
      <section className="container">
        <h3 className="section-title">Objetivos Específicos</h3>
        <div className="objective-grid">
          <div className="objective-card">
            <h4>📊 Fortalecimiento Investigativo</h4>
            <p>
              Fortalecer los procesos investigativos en las áreas de desarrollo de
              software, calidad de software, análisis de datos e inteligencia
              artificial y arquitectura de software.
            </p>
          </div>
          <div className="objective-card">
            <h4>📚 Métodos y Técnicas</h4>
            <p>
              Ayudar a los estudiantes a familiarizarse con los métodos y técnicas
              de la investigación.
            </p>
          </div>
          <div className="objective-card">
            <h4>🧠 Capacidad Crítica</h4>
            <p>
              Fomentar la capacidad crítica, creativa y argumentativa de los
              estudiantes.
            </p>
          </div>
          <div className="objective-card">
            <h4>🤝 Trabajo en Equipo</h4>
            <p>
              Enseñar a los estudiantes a trabajar en equipo de manera efectiva y
              colaborativa.
            </p>
          </div>
          <div className="objective-card">
            <h4>📢 Divulgación</h4>
            <p>
              Divulgar las actividades desarrolladas por el semillero de
              investigación.
            </p>
          </div>
          <div className="objective-card">
            <h4>🏛️ Sistema Institucional</h4>
            <p>
              Fortalecer el sistema de investigación institucional a partir del
              desarrollo de actividades.
            </p>
          </div>
        </div>
      </section>

      {/* LÍNEAS DE INVESTIGACIÓN */}
      <section className="container" id="lineas">
        <h3 className="section-title">Líneas de Investigación</h3>
        <div className="lines-research">
          <div className="research-line">💻 Desarrollo de Software</div>
          <div className="research-line">✅ Calidad de Software</div>
          <div className="research-line">
            📈 Análisis de Datos e Inteligencia Artificial
          </div>
          <div className="research-line">🏗️ Arquitectura de Software</div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="container">
        <h3 className="section-title">Misión y Visión</h3>
        <div className="vision-mission">
          <div className="vm-card">
            <h3>🎯 Misión</h3>
            <p>
              Somos un equipo de trabajo compuesto por estudiantes y docentes de la
              Universidad CORHUILA, promovemos la investigación mediante proyectos
              que permiten la aplicación de conocimientos en las líneas de
              investigación de desarrollo de software, calidad de software,
              análisis de datos e inteligencia artificial y arquitectura de software.
            </p>
          </div>
          <div className="vm-card">
            <h3>🚀 Visión</h3>
            <p>
              En el año 2028 el semillero de investigación Mamba, se destacará por
              la calidad profesional de sus integrantes, se encargará de ofrecer
              asesoría y capacitación a las empresas del país, mediante proyectos de
              investigación de desarrollo de software, calidad de software,
              análisis de datos y arquitectura de software.
            </p>
          </div>
        </div>
      </section>

      {/* COORDINADORES */}
      <section className="container" id="coordinadores">
        <h3 className="section-title">Coordinadores del Semillero</h3>
        <div className="coordinators">
          <div className="coordinator-card">
            <Image
              src="/Fotos/IMG_0092-scaled.jpg"
              alt="Ing. Julián Andrés Quimbayo"
              width={180}
              height={180}
              className="coordinator-photo"
            />
            <h4>Ing. Julián Andrés Quimbayo</h4>
            <p>
              <strong>Coordinador</strong>
            </p>
            <p>📧 julian.quimbayo@corhuila.edu.co</p>
            <p className="small-text">
              Ingeniería de Sistemas
            </p>
            <p className="mt-12">
              <a
                href="https://scholar.google.com/citations?user=h9e36C4AAAAJ&hl=es&oi=ao"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'var(--secondary-green)',
                  textDecoration: 'none',
                  fontSize: '0.9em',
                }}
              >
                📚 Google Scholar
              </a>
            </p>
          </div>
          <div className="coordinator-card">
            <Image
              src="/Fotos/jose-llanos.jpg"
              alt="Ing. José Miguel Llanos Mosquera"
              width={180}
              height={180}
              className="coordinator-photo"
            />
            <h4>Ing. José Miguel Llanos Mosquera</h4>
            <p>
              <strong>Coordinador</strong>
            </p>
            <p>📧 jmllanosm@corhuila.edu.co</p>
            <p className="small-text">Ingeniería de Sistemas</p>
            <p className="mt-12">
              <a
                href="https://scholar.google.com/citations?user=IFy6VuAAAAAJ&hl=es&oi=ao"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'var(--secondary-green)',
                  textDecoration: 'none',
                  fontSize: '0.9em',
                }}
              >
                📚 Google Scholar
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* EVENTOS */}
      <section className="container events-section" id="eventos">
        <h3 className="section-title">Eventos y Actividades</h3>
        <div className="events-grid">
          <div className="event-card">
            <h4>⏰ Reuniones del Semillero</h4>
            <p className="event-date">
              Todos los miércoles durante el semestre, de 5:00 PM a 5:40 PM
            </p>
            <p>
              Encuentros regulares para discutir avances de proyectos, compartir
              conocimientos y coordinar las actividades de investigación del
              semillero.
            </p>
            <p style={{ marginTop: '15px' }}>
              <a
                href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_OTkzMGQ3YmEtMDk5Zi00NzRjLWI0NGYtZTJkMzI1MTE1ZDI1%40thread.v2/0?context=%7b%22Tid%22%3a%22d385fb6e-0c24-42db-9c26-2ad22ecc40c9%22%2c%22Oid%22%3a%22592f50cf-43bd-4ffa-85ce-3afbc98304d7%22%7d"
                target="_blank"
                rel="noreferrer"
                className="teams-btn"
              >
                🔗 Unirse a la Reunión por Teams
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* VIDEOS */}
      <section className="videos-section" id="videos">
        <div className="container">
          <h3 className="section-title">Videos de Sesión</h3>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="video-card">
              <h4>🎥 Accede a Nuestros Videos</h4>
              <p>
                En esta carpeta encontrarás todos los videos de las sesiones del
                Semillero Mamba. Aquí puedes ver las grabaciones de nuestras
                reuniones, talleres, presentaciones de proyectos y contenido
                académico complementario para tu aprendizaje.
              </p>
              <p style={{ color: '#888', fontSize: '0.85em', marginBottom: '20px' }}>
                📄 Organizado por fecha y tema - 🔐 Acceso exclusivo para miembros
                del semillero
              </p>
              <a
                href="https://drive.google.com/drive/folders/1CN9cSj3l7JJsHkPJWlEYcuXoYVb3mZcG?usp=sharing"
                target="_blank"
                rel="noreferrer"
                className="video-button"
              >
                🚀 Ir a Google Drive
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="container blog-section" id="blog">
        <h2 className="section-title">Blog de Experiencias</h2>
        <div className="blog-grid">
          <article className="blog-card">
            <div className="blog-header">📖</div>
            <div className="blog-content">
              <h3>Cómo comenzamos en la investigación</h3>
              <p className="blog-author">Por: Comunidad Semillero Mamba</p>
              <p>
                Descubre las experiencias y aprendizajes iniciales de nuestros
                estudiantes al involucrarse en el mundo de la investigación.
              </p>
              <Link href="/blog/como-comenzamos" className="blog-link">
                Leer artículo →
              </Link>
            </div>
          </article>

          <article className="blog-card">
            <div className="blog-header">🔬</div>
            <div className="blog-content">
              <h3>Construcción del Thesaurus sobre Investigación</h3>
              <p className="blog-author">Por: Coordinadores del semillero</p>
              <p>
                Descubre cómo construimos un vocabulario controlado unificado
                para normalizar la terminología de nuestras investigaciones.
              </p>
              <Link href="/blog/construccion-thesaurus" className="blog-link">
                Leer artículo →
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* PROYECTOS DESTACADOS DINÁMICOS */}
      <section className="container projects-section">
        <h3 className="section-title">Proyectos de Estudiantes</h3>
        <div id="contenedor-proyectos-publicos" className="projects-grid">
          {loading && (
            <div style={{ textAlign: 'center', width: '100%', padding: '20px', gridColumn: '1 / -1' }}>
              <span>⏳ Cargando proyectos destacados...</span>
            </div>
          )}

          {error && (
            <div
              style={{
                textAlign: 'center',
                width: '100%',
                padding: '20px',
                color: '#dc3545',
                gridColumn: '1 / -1',
              }}
            >
              ⚠️ Hubo un problema al conectar con el servidor de proyectos. Por
              favor, intenta de nuevo más tarde.
            </div>
          )}

          {!loading && !error && proyectos.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                width: '100%',
                padding: '30px 15px',
                color: '#777',
                background: '#f9f9f9',
                borderRadius: '8px',
                border: '1px dashed #ccc',
                gridColumn: '1 / -1',
              }}
            >
              <span style={{ fontSize: '24px' }}>✨</span>
            </div>
          )}

          {!loading &&
            !error &&
            proyectos.map((proyecto) => {
              const nombre = proyecto.nombre || 'Proyecto sin nombre';
              const imgUrl = proyecto.imagen_url
                ? proyecto.imagen_url
                : 'https://placehold.co/600x400/e2e3e5/a1a1a1?text=Sin+Imagen';

              return (
                <div
                  key={proyecto.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '350px',
                  }}
                >
                  <div>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={imgUrl}
                        alt={nombre}
                        style={{
                          width: '100%',
                          height: '160px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          marginBottom: '12px',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: '#ffc107',
                          color: 'black',
                          padding: '3px 6px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        }}
                      >
                        ⭐ Destacado
                      </div>
                    </div>
                    <h3
                      style={{
                        margin: '5px 0 10px 0',
                        fontSize: '1.15em',
                        wordBreak: 'break-word',
                      }}
                    >
                      {nombre}
                    </h3>
                    <p
                      style={{
                        color: '#555',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        marginBottom: '15px',
                      }}
                    >
                      {truncateText(proyecto.descripcion)}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={`/proyectos/detalle?id=${proyecto.id}`}
                      className="btn-secondary"
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        width: '100%',
                        padding: '10px 8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        fontSize: '0.9em',
                      }}
                    >
                      🔎 Ver Proyecto Completo
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* BOTÓN FLOTANTE WHATSAPP */}
      <a
        href="https://chat.whatsapp.com/LC9bMjYmFqN4LUfGLDOMX0"
        target="_blank"
        rel="noreferrer"
        className="whatsapp-button"
        title="Únete al grupo de WhatsApp del Semillero Mamba"
      >
        <span style={{ fontSize: '24px' }}>💬</span>
      </a>

      {/* CHATBOT GLOBAL */}
      <Chatbot userRole={currentUserRole} />

      <FooterPublic />
    </>
  );
}