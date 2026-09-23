'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { TipoProducto, User, ProductoAutor } from '@/types/api';
import { productosService, productoAutoresService } from '@/services/api.service';
import { adminService } from '@/services/adminService';

const ESTADOS = [
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'completado', label: 'Completado' },
  { value: 'publicado', label: 'Publicado' },
  { value: 'archivado', label: 'Archivado' },
];

export default function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productoId } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Datos Formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoProductoId, setTipoProductoId] = useState<number | ''>('');
  const [estado, setEstado] = useState('en_proceso');
  const [activo, setActivo] = useState(true);

  // Listas
  const [tipos, setTipos] = useState<TipoProducto[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [autoresSeleccionados, setAutoresSeleccionados] = useState<Set<number>>(new Set());
  // Mapa usuario_id -> id de la relación producto_autor, necesario para poder eliminarla si se desmarca
  const [relacionesIniciales, setRelacionesIniciales] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    cargarDatos();
  }, [productoId]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tiposData, usuariosData, productoData, relacionesAutores] = await Promise.all([
        adminService.getTipos(),
        adminService.getUsuarios(),
        productosService.getById(Number(productoId)),
        productoAutoresService.getAll(),
      ]);

      setTipos(tiposData);
      setUsuarios(usuariosData);

      // Cargar campos formulario
      setTitulo(productoData.titulo || '');
      setDescripcion(productoData.descripcion || '');
      setTipoProductoId(productoData.tipo_producto_id || '');
      setEstado(productoData.estado || 'en_proceso');
      setActivo(productoData.activo ?? true);

      // Mapear autores ya vinculados (usuario_id -> id de la relación) para poder editarlos/eliminarlos
      const mapaRelaciones = new Map<number, number>();
      relacionesAutores.forEach((rel: ProductoAutor) => {
        if (String(rel.producto_id) === String(productoId)) {
          mapaRelaciones.set(Number(rel.usuario_id), rel.id);
        }
      });

      setRelacionesIniciales(mapaRelaciones);
      setAutoresSeleccionados(new Set(mapaRelaciones.keys()));
    } catch (err: any) {
      console.error('Error al cargar datos para edición:', err);
      setError('No se pudo obtener la información del producto. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (usuarioId: number) => {
    const nuevos = new Set(autoresSeleccionados);
    if (nuevos.has(usuarioId)) {
      nuevos.delete(usuarioId);
    } else {
      nuevos.add(usuarioId);
    }
    setAutoresSeleccionados(nuevos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // 1. Actualizar producto base
      await productosService.update(Number(productoId), {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        tipo_producto_id: Number(tipoProductoId),
        estado,
        activo,
      });

      // 2. Calcular diferencia de autores: cuáles agregar y cuáles quitar
      const idsIniciales = new Set(relacionesIniciales.keys());
      const autoresAAgregar = Array.from(autoresSeleccionados).filter((id) => !idsIniciales.has(id));
      const autoresAQuitar = Array.from(idsIniciales).filter((id) => !autoresSeleccionados.has(id));

      const operaciones = [
        ...autoresAAgregar.map((idUser) =>
          productoAutoresService.create({
            producto_id: Number(productoId),
            usuario_id: idUser,
            rol_autor: 'coautor',
            es_autor_principal: false,
          })
        ),
        ...autoresAQuitar.map((idUser) =>
          productoAutoresService.delete(relacionesIniciales.get(idUser)!)
        ),
      ];

      const resultados = await Promise.allSettled(operaciones);
      const fallidas = resultados.filter((r) => r.status === 'rejected');

      if (fallidas.length > 0) {
        console.error('Algunas actualizaciones de autores fallaron:', fallidas);
        setError(
          `El producto se guardó, pero ${fallidas.length} cambio(s) de autores no se pudieron aplicar. Revisa la lista e inténtalo de nuevo.`
        );
        return;
      }

      router.push('/productos');
    } catch (err: any) {
      console.error('Error al actualizar:', err);
      setError(err.message || 'Error al guardar los cambios.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container">
        <div className="loading-block">🔄 Sincronizando datos del producto...</div>
      </main>
    );
  }

  return (
    <main className="container container-small">
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2>✏️ Modificar Producto de Investigación</h2>
        <span className="badge badge-info" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          ID: {productoId}
        </span>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="titulo">Título de la Producción</label>
            <input
              type="text"
              id="titulo"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción / Resumen Ejecutivo</label>
            <textarea
              id="descripcion"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="tipo">Tipo de Producto</label>
              <select
                id="tipo"
                required
                value={tipoProductoId}
                onChange={(e) => setTipoProductoId(Number(e.target.value))}
              >
                <option value="">Seleccione tipo...</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="activo">Visibilidad</label>
              <select
                id="activo"
                value={activo ? 'true' : 'false'}
                onChange={(e) => setActivo(e.target.value === 'true')}
              >
                <option value="true">Activo / Público</option>
                <option value="false">Inactivo / Archivado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                {ESTADOS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Checkboxes para selección rápida de Autores */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label><strong>Asignación de Autores / Colaboradores</strong></label>
            <div
              style={{
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '0.75rem',
                marginTop: '0.5rem',
              }}
            >
              {usuarios.map((u) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id={`user-chk-${u.id}`}
                    checked={autoresSeleccionados.has(u.id)}
                    onChange={() => handleCheckboxChange(u.id)}
                  />
                  <label htmlFor={`user-chk-${u.id}`} style={{ cursor: 'pointer', margin: 0 }}>
                    <strong>{u.nombre}</strong> <span style={{ color: '#6b7280' }}>({u.email})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.push('/productos')}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}