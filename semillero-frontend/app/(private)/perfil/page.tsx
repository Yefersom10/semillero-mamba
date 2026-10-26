'use client';

import type { ApiError } from '@/lib/errors';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/api';
import { API_URL } from '@/lib/config';

export default function PerfilPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Campo editable
  const [nombre, setNombre] = useState('');

  // Mensajes de estado
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const cargarPerfil = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const storedUserStr = localStorage.getItem('user');

    if (!token || !storedUserStr) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser: User = JSON.parse(storedUserStr);
      setUsuario(parsedUser);
      setNombre(parsedUser.nombre || '');

      // Si existe ID, intentamos refrescar los datos desde /usuarios/:id
      if (parsedUser.id) {
        const res = await fetch(`${API_URL}/usuarios/${parsedUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data: User = await res.json();
          setUsuario(data);
          setNombre(data.nombre || '');
          localStorage.setItem('user', JSON.stringify({ ...parsedUser, ...data }));
        }
      }
    } catch (errRaw) {
      const err = errRaw as ApiError;
      console.error('Error al obtener perfil del servidor:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  const handleUpdatePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    const token = localStorage.getItem('token');
    const storedUserStr = localStorage.getItem('user');

    if (!usuario?.id) {
      setMsg({ text: 'No se encontró el ID del usuario', type: 'error' });
      setSubmitting(false);
      return;
    }

    const datosPayload = {
      nombre: nombre.trim(),
    };

    try {
      // Actualización contra /usuarios/:id
      const res = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosPayload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message || errorData.detail || 'Error al actualizar el perfil';
        throw new Error(errorMsg);
      }

      const usuarioActualizado: User = await res.json();
      setUsuario(usuarioActualizado);

      // Actualizar localStorage
      if (storedUserStr) {
        const parsedUser = JSON.parse(storedUserStr);
        localStorage.setItem('user', JSON.stringify({ ...parsedUser, ...usuarioActualizado }));
      }

      setMsg({ text: 'Perfil actualizado con éxito', type: 'success' });
    } catch (errRaw) {
      const err = errRaw as ApiError;
      // Fallback local en caso de fallo
      if (storedUserStr) {
        const parsedUser = JSON.parse(storedUserStr);
        const nuevoUsuario = { ...parsedUser, nombre: nombre.trim() };
        localStorage.setItem('user', JSON.stringify(nuevoUsuario));
        setUsuario(nuevoUsuario);
        setMsg({ text: 'Perfil actualizado localmente', type: 'success' });
      } else {
        setMsg({ text: err.message || 'Error al guardar los cambios', type: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getRolNombre = (rol: User['rol'] | null | undefined): string => {
    if (typeof rol === 'object' && rol !== null) {
      return rol.nombre || (rol as { name?: string }).name || 'Usuario';
    }
    return String(rol || 'Usuario');
  };

  const getRolBadgeColor = (rol: User['rol'] | null | undefined) => {
    const rolStr = getRolNombre(rol).toLowerCase();
    switch (rolStr) {
      case 'admin':
      case 'administrador':
        return '#ef4444';
      case 'profesor':
        return '#0284c7';
      default:
        return '#10b981';
    }
  };

  return (
    <main className="container">
      <div className="page-header">
        <h1>👤 Mi Perfil</h1>
        <p>Gestiona tu información personal y visualiza tus permisos en la plataforma</p>
      </div>

      {loading ? (
        <div className="loading-block">
          <span>⏳ Cargando perfil...</span>
        </div>
      ) : (
        <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

          {/* Tarjeta Resumen Lateral */}
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', height: 'fit-content' }}>
            <div
              className="avatar-placeholder"
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                backgroundColor: '#004080',
                color: '#fff',
                fontSize: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}
            >
              {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{usuario?.nombre}</h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>{usuario?.email}</p>

            <span
              style={{
                backgroundColor: getRolBadgeColor(usuario?.rol),
                color: '#fff',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                display: 'inline-block'
              }}
            >
              {getRolNombre(usuario?.rol)}
            </span>
          </div>

          {/* Formulario de Edición */}
          <div className="form-container" style={{ margin: 0, width: '100%' }}>
            <form className="form" onSubmit={handleUpdatePerfil}>
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico (No modificable)</label>
                <input
                  type="email"
                  id="email"
                  value={usuario?.email || ''}
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input
                  type="text"
                  id="nombre"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="rol">Rol de Sistema</label>
                <input
                  type="text"
                  id="rol"
                  value={getRolNombre(usuario?.rol).toUpperCase()}
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              {msg && (
                <div className={`auth-message auth-message-${msg.type}`}>
                  {msg.text}
                </div>
              )}

              <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? '⏳ Guardando...' : '💾 Actualizar Datos'}
                </button>
              </div>
            </form>
          </div>

        </div>
      )}
    </main>
  );
}