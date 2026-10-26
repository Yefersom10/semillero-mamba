'use client';

import type { ApiError } from '@/lib/errors';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { proyectosService } from '@/services/backend.service';
import { Proyecto } from '@/types/api';
import { SessionUser, puedeGestionarProyecto } from '@/utils/permissions';

export default function EditarProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const proyectoId = Number(resolvedParams.id);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('activo');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [linkProyecto, setLinkProyecto] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');

  const cargarProyectoLocal = (): Proyecto | null => {
    const mockStr = localStorage.getItem('mock_proyectos');
    if (mockStr) {
      try {
        const mockData: Proyecto[] = JSON.parse(mockStr);
        const encontrado = mockData.find((p) => Number(p.id) === proyectoId);
        if (encontrado) return encontrado;
      } catch (e) {
        console.error('Error leyendo proyectos de almacenamiento local:', e);
      }
    }
    return null;
  };

  const poblarFormulario = (data: Proyecto) => {
    setNombre(data.nombre || '');
    setDescripcion(data.descripcion || '');
    setEstado(data.estado || 'activo');
    setLinkProyecto(data.link_proyecto || '');
    setImagenUrl(data.imagen_url || '');

    if (data.fecha_inicio) {
      setFechaInicio(data.fecha_inicio.substring(0, 10));
    }
    if (data.fecha_fin) {
      setFechaFin(data.fecha_fin.substring(0, 10));
    }
  };

  const cargarProyecto = async (user: SessionUser) => {
    setLoading(true);
    let data: Proyecto | null = null;

    try {
      data = await proyectosService.getById(proyectoId);
    } catch {
      data = cargarProyectoLocal();
    }

    if (!data) {
      setMsg({ text: 'No se pudo cargar la información del proyecto.', type: 'error' });
      setLoading(false);
      return;
    }

    // Validación de pertenencia: admin siempre; docente/estudiante solo si están asociados
    if (puedeGestionarProyecto(user, data)) {
      setAuthorized(true);
      poblarFormulario(data);
    } else {
      setMsg({
        text: '🚫 Este proyecto no está asociado a ti: solo puedes observarlo.',
        type: 'error',
      });
      setTimeout(() => router.push(`/proyectos/${proyectoId}`), 2500);
    }

    setLoading(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      setMsg({ text: '🚫 No estás autenticado.', type: 'error' });
      setLoading(false);
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    let user: SessionUser;
    try {
      user = JSON.parse(storedUser);
    } catch {
      setMsg({ text: 'Error al verificar permisos.', type: 'error' });
      setLoading(false);
      setTimeout(() => router.push(`/proyectos/${proyectoId}`), 2000);
      return;
    }

    if (proyectoId) {
      cargarProyecto(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyectoId, router]);

  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    const datosPayload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      estado,
      fecha_inicio: fechaInicio ? `${fechaInicio}T00:00:00` : undefined,
      fecha_fin: fechaFin ? `${fechaFin}T00:00:00` : undefined,
      link_proyecto: linkProyecto.trim() || undefined,
      imagen_url: imagenUrl.trim() || undefined,
    };

    try {
      await proyectosService.update(proyectoId, datosPayload);

      setMsg({ text: '💾 Proyecto actualizado correctamente', type: 'success' });
      setTimeout(() => {
        router.push(`/proyectos/${proyectoId}`);
      }, 1200);
    } catch (errRaw) {
      const err = errRaw as ApiError;
      // Sin fallback local: si el backend rechaza (permisos o conexión) se informa el motivo
      const mensaje =
        err?.response?.data?.message ||
        'No se pudieron guardar los cambios. Verifica tu conexión e intenta de nuevo.';
      setMsg({
        text: Array.isArray(mensaje) ? mensaje.join(', ') : mensaje,
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!authorized && !loading) {
    return (
      <>
        
        <main className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          {msg && <div className={`auth-message auth-message-${msg.type}`}>{msg.text}</div>}
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      

      <main className="container">
        <div className="page-header">
          <h1>✏️ Editar Proyecto</h1>
          <p>Actualiza la información del proyecto</p>
        </div>

        {loading ? (
          <div className="loading-block">
            <span>⏳ Cargando datos del proyecto...</span>
          </div>
        ) : (
          <div className="form-container">
            <form className="form" onSubmit={guardarCambios}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Proyecto</label>
                <input
                  type="text"
                  id="nombre"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  required
                  rows={5}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  required
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value="activo">Activo</option>
                  <option value="pausado">Pausado</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha_inicio">Fecha Inicio</label>
                  <input
                    type="date"
                    id="fecha_inicio"
                    required
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fecha_fin">Fecha Fin</label>
                  <input
                    type="date"
                    id="fecha_fin"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="link_proyecto">Enlace del Proyecto</label>
                <input
                  type="url"
                  id="link_proyecto"
                  value={linkProyecto}
                  onChange={(e) => setLinkProyecto(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="imagen_url">URL de Imagen</label>
                <input
                  type="url"
                  id="imagen_url"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                />
              </div>

              {msg && (
                <div className={`auth-message auth-message-${msg.type}`}>
                  {msg.text}
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => router.back()}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}