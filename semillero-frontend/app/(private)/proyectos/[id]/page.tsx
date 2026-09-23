'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { proyectosService } from '@/services/backend.service';
import { Proyecto } from '@/types/api';
import { SessionUser, puedeGestionarProyecto } from '@/utils/permissions';

export default function DetalleProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const proyectoId = Number(resolvedParams.id);
  const router = useRouter();

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [usuario, setUsuario] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Permisos de gestión: admin siempre; docente/estudiante solo si están asociados
  const canManage = puedeGestionarProyecto(usuario, proyecto);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUsuario(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parseando usuario:', e);
      }
    }

    if (proyectoId) {
      cargarProyecto();
    }
  }, [proyectoId]);

  const cargarProyecto = async () => {
    setLoading(true);

    try {
      const data = await proyectosService.getById(proyectoId);
      if (data) {
        setProyecto(data);
      } else {
        cargarProyectoLocal();
      }
    } catch (err: any) {
      // Intentar cargar desde el mock local si falla el backend
      cargarProyectoLocal();
    } finally {
      setLoading(false);
    }
  };

  const cargarProyectoLocal = () => {
    const mockStr = localStorage.getItem('mock_proyectos');
    if (mockStr) {
      try {
        const mockData: Proyecto[] = JSON.parse(mockStr);
        const encontrado = mockData.find((p) => Number(p.id) === proyectoId);
        if (encontrado) {
          setProyecto(encontrado);
          return;
        }
      } catch (e) {
        console.error('Error leyendo proyectos locales:', e);
      }
    }
    setMsg({ text: 'No se encontró información del proyecto especificado.', type: 'error' });
  };

  const handleEliminar = async () => {
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.'
    );
    if (!confirmar) return;

    setDeleting(true);
    setMsg(null);

    try {
      await proyectosService.delete(proyectoId);
      eliminarProyectoLocal();
      setMsg({ text: 'Proyecto eliminado correctamente.', type: 'success' });

      setTimeout(() => {
        router.push('/proyectos');
      }, 1200);
    } catch (err: any) {
      // Sin fallback local: si el backend rechaza la operación, se informa el motivo
      const mensaje = err?.response?.data?.message || 'No se pudo eliminar el proyecto.';
      setMsg({
        text: Array.isArray(mensaje) ? mensaje.join(', ') : mensaje,
        type: 'error',
      });
    } finally {
      setDeleting(false);
    }
  };

  const eliminarProyectoLocal = () => {
    // 1. Quitar de destacados
    let dest = JSON.parse(localStorage.getItem('proyectos_destacados') || '[]');
    dest = dest.filter((item: string) => item !== String(proyectoId));
    localStorage.setItem('proyectos_destacados', JSON.stringify(dest));

    // 2. Quitar del mock local
    const mockStr = localStorage.getItem('mock_proyectos');
    if (mockStr) {
      const mockData: Proyecto[] = JSON.parse(mockStr);
      const filtrados = mockData.filter((p) => Number(p.id) !== proyectoId);
      localStorage.setItem('mock_proyectos', JSON.stringify(filtrados));
    }
  };

  const getEstadoBadgeClass = (estado?: string) => {
    switch (String(estado || '').toLowerCase()) {
      case 'activo': return 'badge-success';
      case 'pausado': return 'badge-warning';
      case 'finalizado': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  return (
    <main className="container">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <button 
          className="btn-secondary" 
          onClick={() => router.push('/proyectos')}
          style={{ marginBottom: '1rem', cursor: 'pointer' }}
        >
          ← Volver a Proyectos
        </button>
      </div>

      {loading ? (
        <div className="loading-block">
          <span>⏳ Cargando detalle del proyecto...</span>
        </div>
      ) : proyecto ? (
        <article className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{proyecto.nombre}</h1>
              <span className={`badge ${getEstadoBadgeClass(proyecto.estado)}`}>
                {(proyecto.estado || 'activo').toUpperCase()}
              </span>
            </div>

            {canManage && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/proyectos/${proyecto.id}/editar`} className="btn-primary" style={{ textDecoration: 'none' }}>
                  ✏️ Editar
                </Link>
                <button 
                  className="btn-danger" 
                  onClick={handleEliminar} 
                  disabled={deleting}
                  style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {deleting ? '⏳ Eliminando...' : '🗑️ Eliminar'}
                </button>
              </div>
            )}
          </div>

          <hr style={{ margin: '1.5rem 0', borderColor: '#e5e7eb' }} />

          {proyecto.imagen_url && (
            <div style={{ position: 'relative', width: '100%', height: '300px', marginBottom: '1.5rem', borderRadius: '8px', overflow: 'hidden' }}>
              <Image 
                src={proyecto.imagen_url} 
                alt={proyecto.nombre} 
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <h3>Descripción del Proyecto</h3>
            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: '#374151', marginTop: '0.5rem' }}>
              {proyecto.descripcion || 'Sin descripción disponible.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '6px' }}>
            <div>
              <strong>Fecha de Inicio:</strong>
              <p>{proyecto.fecha_inicio ? new Date(proyecto.fecha_inicio).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <strong>Fecha de Finalización:</strong>
              <p>{proyecto.fecha_fin ? new Date(proyecto.fecha_fin).toLocaleDateString() : 'En desarrollo'}</p>
            </div>
            {proyecto.link_proyecto && (
              <div>
                <strong>Enlace Externo:</strong>
                <p>
                  <a href={proyecto.link_proyecto} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                    Ver repositorio/recurso 🔗
                  </a>
                </p>
              </div>
            )}
          </div>

          {msg && (
            <div className={`auth-message auth-message-${msg.type}`} style={{ marginTop: '1.5rem' }}>
              {msg.text}
            </div>
          )}
        </article>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No se encontró información del proyecto especificado.</p>
          {msg && <div className={`auth-message auth-message-${msg.type}`}>{msg.text}</div>}
        </div>
      )}
    </main>
  );
}