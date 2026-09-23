'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { proyectosService } from '@/services/backend.service';
import type { Proyecto } from '@/types/api';
import {
  SessionUser,
  esAdmin as esAdminUsuario,
  puedeCrearProyecto,
  puedeGestionarProyecto,
} from '@/utils/permissions';

export default function ProyectosListPage() {
  const router = useRouter();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [destacados, setDestacados] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usuario, setUsuario] = useState<SessionUser | null>(null);
  const [esAdmin, setEsAdmin] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setUsuario(user);
      setEsAdmin(esAdminUsuario(user));
    } catch (e) {
      console.error('Error parseando datos del usuario:', e);
    }

    const dest = JSON.parse(localStorage.getItem('proyectos_destacados') || '[]');
    setDestacados(dest);

    cargarProyectos();
  }, [router]);

  const cargarProyectos = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await proyectosService.getAll();

      if (Array.isArray(data) && data.length > 0) {
        setProyectos(data);
      } else {
        obtenerProyectosLocales();
      }
    } catch (err: any) {
      obtenerProyectosLocales();
    } finally {
      setLoading(false);
    }
  };

  const obtenerProyectosLocales = () => {
    const mockStr = localStorage.getItem('mock_proyectos');
    if (mockStr) {
      try {
        const mockData = JSON.parse(mockStr);
        setProyectos(mockData);
      } catch (e) {
        setProyectos([]);
      }
    } else {
      setProyectos([]);
    }
  };

  const alternarDestacado = (proyectoId: number) => {
    let actualDestacados: string[] = JSON.parse(
      localStorage.getItem('proyectos_destacados') || '[]'
    );
    const idString = String(proyectoId);

    if (actualDestacados.includes(idString)) {
      actualDestacados = actualDestacados.filter((id) => id !== idString);
    } else {
      if (actualDestacados.length >= 3) {
        alert('⚠️ Solo puedes mostrar un máximo de 3 proyectos destacados en el inicio.');
        return;
      }
      actualDestacados.push(idString);
    }

    localStorage.setItem('proyectos_destacados', JSON.stringify(actualDestacados));
    setDestacados(actualDestacados);
  };

  const eliminarProyecto = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      await proyectosService.delete(id);
      actualizarListasTrasEliminar(id);
    } catch (err: any) {
      // Sin fallback local: si el backend rechaza (p. ej. no estás asociado), se muestra el motivo
      const mensaje =
        err?.response?.data?.message || 'No se pudo eliminar el proyecto. Intenta de nuevo.';
      alert(Array.isArray(mensaje) ? mensaje.join(', ') : mensaje);
    }
  };

  const actualizarListasTrasEliminar = (id: number) => {
    // 1. Quitar de destacados
    let dest = JSON.parse(localStorage.getItem('proyectos_destacados') || '[]');
    dest = dest.filter((item: string) => item !== String(id));
    localStorage.setItem('proyectos_destacados', JSON.stringify(dest));
    setDestacados(dest);

    // 2. Actualizar mock local
    const mockStr = localStorage.getItem('mock_proyectos');
    if (mockStr) {
      const mockData: Proyecto[] = JSON.parse(mockStr);
      const filtrados = mockData.filter((p) => p.id !== id);
      localStorage.setItem('mock_proyectos', JSON.stringify(filtrados));
    }

    // 3. Actualizar estado
    setProyectos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <main className="container">
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1>📊 Proyectos de Investigación</h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            Explora las iniciativas de investigación y desarrollo de nuestro semillero
          </p>
        </div>
        {puedeCrearProyecto(usuario) && (
          <Link href="/proyectos/nuevo" className="btn-primary" style={{ textDecoration: 'none' }}>
            ➕ Nuevo Proyecto
          </Link>
        )}
      </div>

      {loading ? (
        <div className="loading-block">
          <span>⏳ Cargando proyectos...</span>
        </div>
      ) : errorMsg ? (
        <div className="auth-message auth-message-error">{errorMsg}</div>
      ) : proyectos.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>No hay proyectos registrados aún</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Comienza creando la primera propuesta del semillero.
          </p>
          {puedeCrearProyecto(usuario) && (
            <Link href="/proyectos/nuevo" className="btn-primary" style={{ textDecoration: 'none' }}>
              ➕ Crear Proyecto
            </Link>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {proyectos.map((p) => {
            const imagenSrc = p.imagen_url
              ? p.imagen_url
              : 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
            const estaDestacado = destacados.includes(String(p.id));
            // Admin/edita siempre; docente y estudiante solo si están asociados
            const gestionar = puedeGestionarProyecto(usuario, p);

            return (
              <div
                key={p.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  {estaDestacado && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: '#f59e0b',
                        color: '#ffffff',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: 10,
                      }}
                    >
                      ⭐ Destacado en Inicio
                    </div>
                  )}

                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '180px',
                      marginBottom: '1rem',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      backgroundColor: '#f1f5f9',
                    }}
                  >
                    <Image
                      src={imagenSrc}
                      alt={`Imagen de ${p.nombre}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                    {p.nombre}
                  </h3>

                  <p
                    style={{
                      color: '#475569',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      marginBottom: '1rem',
                    }}
                  >
                    {p.descripcion
                      ? p.descripcion.length > 130
                        ? `${p.descripcion.substring(0, 130)}...`
                        : p.descripcion
                      : 'Sin descripción disponible.'}
                  </p>

                  {p.link_proyecto ? (
                    <a
                      href={p.link_proyecto}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#0284c7',
                        textDecoration: 'none',
                      }}
                    >
                      🔗 Enlace externo al Proyecto
                    </a>
                  ) : (
                    <span
                      style={{
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                        display: 'block',
                        marginBottom: '1rem',
                      }}
                    >
                      ⚠️ Sin repositorio / enlace
                    </span>
                  )}
                </div>

                <div>
                  <div
                    style={{
                      borderTop: '1px solid #e2e8f0',
                      paddingTop: '0.75rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#334155' }}>
                      <strong>Estado:</strong>{' '}
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            p.estado?.toLowerCase() === 'activo' ? '#dcfce7' : '#f1f5f9',
                          color: p.estado?.toLowerCase() === 'activo' ? '#166534' : '#475569',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                        }}
                      >
                        {p.estado || 'Activo'}
                      </span>
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#64748b' }}>
                      <strong>Inicio:</strong>{' '}
                      {p.fecha_inicio ? p.fecha_inicio.substring(0, 10) : 'S/F'}
                    </p>
                  </div>

                  {esAdmin && (
                    <button
                      onClick={() => alternarDestacado(p.id)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        borderRadius: '6px',
                        border: `1px solid ${estaDestacado ? '#f59e0b' : '#cbd5e1'}`,
                        background: estaDestacado ? '#fef3c7' : '#f8fafc',
                        color: estaDestacado ? '#78350f' : '#334155',
                        cursor: 'pointer',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {estaDestacado ? '❌ Quitar de Inicio' : '⭐ Destacar en Inicio'}
                    </button>
                  )}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: gestionar ? '1fr 1fr 1fr' : '1fr',
                      gap: '0.5rem',
                    }}
                  >
                    <Link
                      href={`/proyectos/${p.id}`}
                      className="btn-secondary"
                      style={{ textDecoration: 'none', textAlign: 'center', padding: '0.4rem 0.2rem', fontSize: '0.85rem' }}
                    >
                      {gestionar ? 'Ver' : 'Observar'}
                    </Link>
                    {gestionar && (
                      <>
                        <Link
                          href={`/proyectos/${p.id}/editar`}
                          className="btn-primary"
                          style={{
                            textDecoration: 'none',
                            textAlign: 'center',
                            backgroundColor: '#eab308',
                            borderColor: '#ca8a04',
                            padding: '0.4rem 0.2rem',
                            fontSize: '0.85rem',
                          }}
                        >
                          Editar
                        </Link>
                        <button
                          className="btn-danger"
                          style={{ padding: '0.4rem 0.2rem', fontSize: '0.85rem' }}
                          onClick={() => eliminarProyecto(p.id)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}