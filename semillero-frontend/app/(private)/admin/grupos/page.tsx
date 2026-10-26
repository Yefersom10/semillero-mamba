'use client';

import type { ApiError } from '@/lib/errors';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '@/services/adminService';
import { GrupoMinciencias, CreateGrupoMincienciasDto } from '@/types/api';
import Link from 'next/link';

export default function GruposPage() {
  const [grupos, setGrupos] = useState<GrupoMinciencias[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingGrupo, setEditingGrupo] = useState<GrupoMinciencias | null>(null);

  const [formData, setFormData] = useState<CreateGrupoMincienciasDto>({
    nombre: '',
    codigo: '',
    descripcion: '',
    activo: true,
  });

  const fetchGrupos = async () => {
    try {
      setLoading(true);
      const data = await adminService.getGrupos();
      setGrupos(data);
    } catch (errorRaw) {
      const error = errorRaw as ApiError;
      console.error('Error al cargar grupos:', error);
      toast.error('Error al cargar la lista de grupos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const handleOpenModal = (grupo?: GrupoMinciencias) => {
    if (grupo) {
      setEditingGrupo(grupo);
      setFormData({
        nombre: grupo.nombre || '',
        codigo: grupo.codigo || '',
        descripcion: grupo.descripcion || '',
        activo: grupo.activo ?? true,
      });
    } else {
      setEditingGrupo(null);
      setFormData({
        nombre: '',
        codigo: '',
        descripcion: '',
        activo: true,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingGrupo(null);
    setFormData({
      nombre: '',
      codigo: '',
      descripcion: '',
      activo: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      toast.error('El nombre del grupo es obligatorio');
      return;
    }

    try {
      setSubmitting(true);
      if (editingGrupo) {
        await adminService.updateGrupo(editingGrupo.id, formData);
        toast.success('Grupo actualizado correctamente');
      } else {
        await adminService.createGrupo(formData);
        toast.success('Grupo creado correctamente');
      }
      handleCloseModal();
      await fetchGrupos();
    } catch (errorRaw) {
      const error = errorRaw as ApiError;
      console.error('Error al guardar el grupo:', error?.response?.data || error);
      const msg = error?.response?.data?.message || 'Error al guardar el grupo';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('¿Está seguro de eliminar este grupo de investigación?')) return;

    try {
      await adminService.deleteGrupo(id);
      toast.success('Grupo eliminado correctamente');
      await fetchGrupos();
    } catch (errorRaw) {
      const error = errorRaw as ApiError;
      console.error('Error al eliminar grupo:', error);
      toast.error('Error al eliminar el grupo');
    }
  };

  return (
    <div className="container-usuarios">
      <div className="header-container">
        <div>
          
          <h1>🔬 Grupos de Investigación</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Gestión de grupos Minciencias de la institución
          </p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          ➕ Nuevo Grupo
        </button>
        <Link href="/admin" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>
          ← Volver al Panel Admin
        </Link>
      </div>

      {loading ? (
        <div className="form-card" style={{ textAlign: 'center', padding: '32px' }}>
          ⏳ Cargando grupos...
        </div>
      ) : grupos.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center', padding: '32px' }}>
          No hay grupos registrados.
        </div>
      ) : (
        <div className="table-container">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {grupos.map((grupo) => (
                <tr key={grupo.id}>
                  <td><strong>{grupo.codigo || 'S/N'}</strong></td>
                  <td>{grupo.nombre}</td>
                  <td>{grupo.descripcion || 'Sin descripción'}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: grupo.activo ? '#d1fae5' : '#fee2e2',
                        color: grupo.activo ? '#065f46' : '#991b1b',
                      }}
                    >
                      {grupo.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleOpenModal(grupo)}
                      className="btn-secondary"
                      style={{ marginRight: '6px', padding: '4px 8px' }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(grupo.id)}
                      className="btn-secondary"
                      style={{ backgroundColor: '#dc2626', padding: '4px 8px' }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div className="form-card" style={{ width: '100%', maxWidth: '500px', margin: 0 }}>
            <h2>{editingGrupo ? '✏️ Editar Grupo' : '➕ Nuevo Grupo'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Nombre del Grupo *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Código Minciencias</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Descripción</label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                />
                <label htmlFor="activo" style={{ fontSize: '14px', cursor: 'pointer' }}>
                  Grupo Activo
                </label>
              </div>

              <div className="btn-container">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Guardando...' : editingGrupo ? 'Guardar Cambios' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}