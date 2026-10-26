'use client';

import type { ApiError } from '@/lib/errors';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/adminService';
import { Rol } from '@/types/api';

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [id, setId] = useState<string | number | null>(null);
  const [nombre, setNombre] = useState<string>('');

  const isEditing = id !== null;

  const cargarRoles = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await adminService.getRoles();
      setRoles(data || []);
    } catch (err) {
      console.error('Error al cargar roles desde la API:', err);
      setErrorMsg('No se pudieron obtener los roles del servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  const prepararEdicion = (r: Rol) => {
    setId(r.id);
    setNombre(r.nombre || '');
  };

  const cancelarEdicion = () => {
    setId(null);
    setNombre('');
  };

  const procesarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { nombre: nombre.trim() };

      if (isEditing && id !== null) {
        await adminService.actualizarRol(id, payload);
        alert('Rol actualizado con éxito.');
      } else {
        await adminService.crearRol(payload);
        alert('Rol creado con éxito.');
      }

      cancelarEdicion();
      await cargarRoles();
    } catch (errRaw) {
      const err = errRaw as ApiError;
      console.error('Error al procesar formulario de rol:', err);
      const mensaje = err.response?.data?.message || 'Ocurrió un error al procesar la operación.';
      alert(`❌ ${Array.isArray(mensaje) ? mensaje.join(', ') : mensaje}`);
    }
  };

  const eliminarRol = async (rolId: string | number) => {
    if (!confirm('¿Deseas eliminar permanentemente este rol?')) return;
    try {
      await adminService.eliminarRol(rolId);
      alert('Rol eliminado con éxito.');
      await cargarRoles();
    } catch (errRaw) {
      const err = errRaw as ApiError;
      console.error('Error al eliminar rol:', err);
      const mensaje = err.response?.data?.message || 'No se pudo eliminar el rol.';
      alert(`❌ ${mensaje}`);
    }
  };

  return (
    <div className="container-usuarios">
      {/* Encabezado */}
      <div className="header-container">
        <div>
          <h1>🔑 Gestión de Roles</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Parametriza los niveles de acceso del sistema
          </p>
        </div>
        <Link href="/admin" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>
          ⬅️ Volver al Panel Admin
        </Link>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px' }}>
          ❌ {errorMsg}
        </div>
      )}

      {/* Formulario integrado */}
      <div className="form-card">
        <h2>{isEditing ? '✏️ Editar Rol' : '➕ Crear Nuevo Rol'}</h2>
        <form onSubmit={procesarFormulario}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>Nombre del Rol *</label>
            <input
              type="text"
              required
              placeholder="Ej. Administrador, Investigador, Estudiante..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="btn-container">
            {isEditing && (
              <button type="button" onClick={cancelarEdicion} className="btn-secondary">
                Cancelar
              </button>
            )}
            <button type="submit" className="btn-primary">
              {isEditing ? 'Guardar Cambios' : 'Crear Rol'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla integrada */}
      <div className="table-container">
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Rol</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '24px' }}>
                  ⏳ Cargando roles...
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '24px' }}>
                  No hay roles registrados.
                </td>
              </tr>
            ) : (
              roles.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td><strong>{r.nombre}</strong></td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => prepararEdicion(r)}
                      className="btn-secondary"
                      style={{ marginRight: '6px', padding: '4px 8px' }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarRol(r.id)}
                      className="btn-secondary"
                      style={{ backgroundColor: '#dc2626', padding: '4px 8px' }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}