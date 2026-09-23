'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { proyectosService } from '@/services/backend.service';
import { SessionUser, puedeCrearProyecto } from '@/utils/permissions';

export default function NuevoProyectoPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [linkProyecto, setLinkProyecto] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      setMsg({ text: '🚫 No estás autenticado.', type: 'error' });
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    try {
      const user: SessionUser = JSON.parse(storedUser);

      // Solo admin y docentes tienen permiso proyectos:crear
      if (puedeCrearProyecto(user)) {
        setAuthorized(true);
      } else {
        setMsg({ text: '🚫 No tienes permisos para crear proyectos.', type: 'error' });
        setTimeout(() => router.push('/proyectos'), 2000);
      }
    } catch (e) {
      setMsg({ text: 'Error al verificar credenciales.', type: 'error' });
      setTimeout(() => router.push('/proyectos'), 2000);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const datosPayload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      estado: 'activo',
      fecha_inicio: fechaInicio ? `${fechaInicio}T00:00:00` : new Date().toISOString(),
      fecha_fin: fechaFin ? `${fechaFin}T00:00:00` : undefined,
      link_proyecto: linkProyecto.trim() || undefined,
      imagen_url: imagenUrl.trim() || undefined,
    };

    try {
      await proyectosService.create(datosPayload as any);
      setMsg({ text: '🚀 Proyecto creado exitosamente', type: 'success' });

      setTimeout(() => {
        router.push('/proyectos');
      }, 1200);
    } catch (err: any) {
      // Sin fallback local: se informa el motivo real del rechazo
      const mensaje =
        err?.response?.data?.message ||
        'No se pudo crear el proyecto. Verifica tu conexión e intenta de nuevo.';
      setMsg({
        text: Array.isArray(mensaje) ? mensaje.join(', ') : mensaje,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return (
      <>
        <main className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          {msg ? (
            <div className={`auth-message auth-message-${msg.type}`}>{msg.text}</div>
          ) : (
            <p>Verificando permisos...</p>
          )}
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="container">
        <div className="page-header">
          <h1>➕ Crear Nuevo Proyecto</h1>
          <p>Registra un nuevo proyecto de investigación para el semillero</p>
        </div>

        <div className="form-container">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Proyecto</label>
              <input
                type="text"
                id="nombre"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Sistema IoT para monitoreo ambiental"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                required
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe brevemente los objetivos y alcance del proyecto..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha_inicio">Fecha de Inicio</label>
                <input
                  type="date"
                  id="fecha_inicio"
                  required
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="fecha_fin">Fecha de Finalización (Opcional)</label>
                <input
                  type="date"
                  id="fecha_fin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="link_proyecto">Enlace al Repositorio / Proyecto (Opcional)</label>
                <input
                  type="url"
                  id="link_proyecto"
                  value={linkProyecto}
                  onChange={(e) => setLinkProyecto(e.target.value)}
                  placeholder="https://github.com/usuario/repositorio"
                />
              </div>

              <div className="form-group">
                <label htmlFor="imagen_url">URL de Imagen del Proyecto (Opcional)</label>
                <input
                  type="url"
                  id="imagen_url"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            {msg && (
              <div className={`auth-message auth-message-${msg.type}`}>
                {msg.text}
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '⏳ Procesando...' : '🚀 Crear Proyecto'}
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
      </main>

      <Footer />
    </>
  );
}