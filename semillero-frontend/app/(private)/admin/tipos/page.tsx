'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/adminService';
import { GrupoMinciencias } from '@/types/api';

interface TipoProducto {
  id: number | string;
  grupo_id: number;
  nombre: string;
  descripcion?: string;
}
export default function TiposProductoPage() {
  const [tipos, setTipos] = useState<TipoProducto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [grupos, setGrupos] = useState<GrupoMinciencias[]>([]);
const [grupoId, setGrupoId] = useState<number | ''>('');

  const [id, setId] = useState<string | number | null>(null);
  const [nombre, setNombre] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');

  const isEditing = id !== null;

  const obtenerTiposLocales = () => {
    const local = localStorage.getItem('mock_tipos_producto');
    if (local) {
      try {
        setTipos(JSON.parse(local) as TipoProducto[]);
        return;
      } catch {
        // Fallback en caso de error al parsear JSON
      }
    }
    const iniciales: TipoProducto[] = [
      { id: 1, grupo_id: 1, nombre: 'Artículo Científico', descripcion: 'Publicaciones indexadas en revistas especializadas' },
      { id: 2, grupo_id: 1, nombre: 'Ponencia Internacional', descripcion: 'Presentaciones en congresos o simposios académicos' },
      { id: 3, grupo_id: 2, nombre: 'Desarrollo de Software', descripcion: 'Prototipos, librerías o plataformas funcionales' },
    ];
    localStorage.setItem('mock_tipos_producto', JSON.stringify(iniciales));
    setTipos(iniciales);
  };

  const cargarTipos = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTipos();
      if (data && data.length > 0) {
        setTipos(data as TipoProducto[]);
      } else {
        obtenerTiposLocales();
      }
    } catch {
      console.warn('Error conectando con la API de tipos. Cargando datos desde almacenamiento local...');
      obtenerTiposLocales();
    } finally {
      setLoading(false);
    }
  };
  const cargarGrupos = async () => {
  try {
    const data = await adminService.getGrupos();
    setGrupos(data as GrupoMinciencias[]);
  } catch (err) {
    console.error('Error cargando grupos Minciencias:', err);
  }
};

  useEffect(() => {
    cargarTipos();
    cargarGrupos();
  }, []);

  const prepararEdicion = (t: TipoProducto) => {
  setId(t.id);
  setGrupoId(t.grupo_id);
  setNombre(t.nombre || '');
  setDescripcion(t.descripcion || '');
};

  const cancelarEdicion = () => {
    setId(null);
    setGrupoId('');
    setNombre('');
    setDescripcion('');
  };

  const procesarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (grupoId === '') {
  alert('Debes seleccionar un grupo Minciencias.');
  return;
}

const payload = {
  grupo_id: Number(grupoId),
  nombre,
  descripcion,
};
      if (isEditing && id !== null) {
        try {
          await adminService.actualizarTipo(id, payload);
        } catch {
          actualizarTipoLocal(id, payload);
        }
        alert('Tipo de producto actualizado con éxito.');
      } else {
        try {
          await adminService.crearTipo(payload);
        } catch {
          crearTipoLocal(payload);
        }
        alert('Tipo de producto creado con éxito.');
      }

      cancelarEdicion();
      cargarTipos();
    } catch {
      alert('Ocurrió un error al procesar la operación.');
    }
  };

  const crearTipoLocal = (payload: { grupo_id: number; nombre: string; descripcion: string }) => {
    const existentesStr = localStorage.getItem('mock_tipos_producto');
    const existentes: TipoProducto[] = existentesStr ? JSON.parse(existentesStr) : [];
    const nuevoId = existentes.length > 0 ? Math.max(...existentes.map((t) => Number(t.id) || 0)) + 1 : 1;

    const nuevoTipo: TipoProducto = {
      id: nuevoId,
      grupo_id: payload.grupo_id,
      nombre: payload.nombre,
      descripcion: payload.descripcion,
    };

    const actualizados = [...existentes, nuevoTipo];
    localStorage.setItem('mock_tipos_producto', JSON.stringify(actualizados));
  };

  const actualizarTipoLocal = (tipoId: string | number, payload: { grupo_id: number; nombre: string; descripcion: string }) => {
    const existentesStr = localStorage.getItem('mock_tipos_producto');
    if (!existentesStr) return;
    const existentes: TipoProducto[] = JSON.parse(existentesStr);

    const actualizados = existentes.map((t) => {
      if (String(t.id) === String(tipoId)) {
        return { ...t, grupo_id: payload.grupo_id, nombre: payload.nombre, descripcion: payload.descripcion };
      }
      return t;
    });

    localStorage.setItem('mock_tipos_producto', JSON.stringify(actualizados));
  };

  const eliminarTipo = async (tipoId: string | number) => {
    if (!confirm('¿Deseas eliminar este tipo de producto científico?')) return;
    try {
      await adminService.eliminarTipo(tipoId);
      alert('Tipo de producto eliminado.');
      cargarTipos();
    } catch {
      const existentesStr = localStorage.getItem('mock_tipos_producto');
      if (existentesStr) {
        const existentes: TipoProducto[] = JSON.parse(existentesStr);
        const filtrados = existentes.filter((t) => String(t.id) !== String(tipoId));
        localStorage.setItem('mock_tipos_producto', JSON.stringify(filtrados));
      }
      alert('Tipo de producto eliminado del almacenamiento local.');
      cargarTipos();
    }
  };

  return (
    <div className="container-usuarios">
      {/* Encabezado */}
      <div className="header-container">
        <div>
          <h1>🏷️ Tipos de Producto Científico</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Categorización de productos del semillero
          </p>
        </div>
        <Link href="/admin" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>
          ⬅️ Volver al Panel Admin
        </Link>
      </div>

      {/* Formulario */}
      <div className="form-card">
        <h2>{isEditing ? '✏️ Editar Tipo' : '➕ Registrar Tipo de Producto'}</h2>
        <form onSubmit={procesarFormulario}>
          <div className="form-grid">
            <div className="form-group">
              <label>Grupo Minciencias *</label>
              <select
    required
    value={grupoId}
    onChange={(e) =>
      setGrupoId(e.target.value ? Number(e.target.value) : '')
    }
  >
    <option value="">Selecciona un grupo</option>

    {grupos.map((grupo) => (
      <option key={grupo.id} value={grupo.id}>
        {grupo.nombre}
      </option>
    ))}
  </select>
</div>
            
            <div className="form-group">
              <label>Nombre Categoría *</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
          </div>

          <div className="btn-container">
            {isEditing && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="btn-secondary"
              >
                Cancelar
              </button>
            )}
            <button type="submit" className="btn-primary">
              {isEditing ? 'Guardar Cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="table-container">
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoría / Tipo</th>
              <th>Descripción</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>
                  ⏳ Cargando tipos de productos...
                </td>
              </tr>
            ) : tipos.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>
                  No hay tipos de productos registrados.
                </td>
              </tr>
            ) : (
              tipos.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td><strong>{t.nombre}</strong></td>
                  <td>{t.descripcion || '-'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => prepararEdicion(t)}
                      className="btn-secondary"
                      style={{ marginRight: '6px', padding: '4px 8px' }}
                      title="Editar tipo"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => eliminarTipo(t.id)}
                      className="btn-secondary"
                      style={{ backgroundColor: '#dc2626', padding: '4px 8px' }}
                      title="Eliminar tipo"
                    >
                      🗑️
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