'use client';

import type { ApiError } from '@/lib/errors';
import { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/adminService';
import { User, Rol } from '@/types/api';

interface FormState {
  id: string | number | null;
  nombre: string;
  email: string;
  password: string;
  rolId: string;
}

const INITIAL_FORM: FormState = {
  id: null,
  nombre: '',
  email: '',
  password: '',
  rolId: '',
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const isEditing = form.id !== null;

  const mapaRoles = useMemo(() => {
    return roles.reduce<Record<string, string>>((acc, r) => {
      acc[String(r.id)] = r.nombre;
      return acc;
    }, {});
  }, [roles]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const [rolesData, usuariosData] = await Promise.all([
        adminService.getRoles(),
        adminService.getUsuarios(),
      ]);
      setRoles(rolesData || []);
      setUsuarios(usuariosData || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleInputChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const prepararEdicion = (u: User) => {
    setForm({
      id: u.id,
      nombre: u.nombre || '',
      email: u.email || '',
      password: '',
      rolId: u.rol_id ? String(u.rol_id) : '',
    });
    setSuccessMsg(null);
  };

  const procesarFormulario = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload: Partial<User> & { password?: string } = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        rol_id: Number(form.rolId),
      };
      if (form.password) payload.password = form.password;

      if (isEditing && form.id !== null) {
        await adminService.actualizarUsuario(form.id, payload);
        setSuccessMsg('Usuario actualizado correctamente.');
      } else {
        await adminService.crearUsuario(payload);
        setSuccessMsg('Usuario registrado correctamente.');
      }

      setForm(INITIAL_FORM);
      await cargarDatos();
    } catch (errRaw) {
      const err = errRaw as ApiError;
      console.error(err);
      const msg = err.response?.data?.message || 'Error al procesar la operación.';
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const eliminarUsuario = async (userId: string | number) => {
    if (!confirm('¿Confirmas la eliminación permanente de este usuario?')) return;
    try {
      await adminService.eliminarUsuario(userId);
      setSuccessMsg('Usuario eliminado correctamente.');
      await cargarDatos();
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo eliminar el usuario.');
    }
  };

  return (
    <div className="container-usuarios">
      {/* Encabezado */}
      <div className="header-container">
        <div>
          <h1>👥 Gestión de Usuarios</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Administración de perfiles y roles del sistema
          </p>
        </div>
        <Link href="/admin" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>
          ← Volver al Panel Admin
        </Link>
      </div>

      {/* Mensajes de Estado */}
      {errorMsg && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px' }}>
          ❌ {errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={{ padding: '12px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '6px', marginBottom: '16px' }}>
          ✅ {successMsg}
        </div>
      )}

      {/* Formulario de Registro / Edición */}
      <div className="form-card">
        <h2>{isEditing ? '✏️ Editar Usuario' : '➕ Registrar Nuevo Usuario'}</h2>
        <form onSubmit={procesarFormulario}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre Completo *</label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Contraseña {isEditing && '(opcional)'}</label>
              <input
                type="password"
                placeholder={isEditing ? 'Mantener actual' : 'Mínimo 8 caracteres'}
                required={!isEditing}
                value={form.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Rol de Acceso *</label>
              <select
                required
                value={form.rolId}
                onChange={(e) => handleInputChange('rolId', e.target.value)}
              >
                <option value="">Seleccione un rol...</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="btn-container">
            {isEditing && (
              <button
                type="button"
                onClick={() => setForm(INITIAL_FORM)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            )}
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Usuarios */}
      <div className="table-container">
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID / UUID</th>
              <th>Nombre</th>
              <th>Correo Electrónico</th>
              <th>Rol</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                  ⏳ Cargando datos de usuarios...
                </td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td><strong>{u.nombre}</strong></td>
                  <td>{u.email}</td>
                  <td>{mapaRoles[String(u.rol_id)] || u.rol_id || 'Sin rol'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => prepararEdicion(u)}
                      className="btn-secondary"
                      style={{ marginRight: '6px', padding: '4px 8px' }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarUsuario(u.id)}
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