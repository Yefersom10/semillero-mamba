'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Producto, TipoProducto } from '@/types/api';
import { productosService } from '@/services/api.service';
import { adminService } from '@/services/adminService';

const ESTADOS = [
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'publicado', label: 'Publicado' },
  { value: 'rechazado', label: 'Rechazado' },
];

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tipos, setTipos] = useState<TipoProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  // Filtros
  const [buscador, setBuscador] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dataProds, dataTipos] = await Promise.all([
        productosService.getAll(),
        adminService.getTipos(),
      ]);
      setProductos(dataProds);
      setTipos(dataTipos);
    } catch (err: any) {
      console.error(err.message);
      setError('No se pudieron cargar los productos. Intenta recargar la página.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    setEliminandoId(id);
    try {
      await productosService.delete(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setEliminandoId(null);
    }
  };

  const limpiarFiltros = () => {
    setBuscador('');
    setFiltroEstado('');
    setFiltroTipo('');
  };

  // Búsqueda ampliada (Título, Descripción, DOI)
  const productosFiltrados = productos.filter((p) => {
    const query = buscador.toLowerCase().trim();
    const matchTexto =
      !query ||
      p.titulo.toLowerCase().includes(query) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(query)) ||
      (p.doi && p.doi.toLowerCase().includes(query));

    const matchEstado = !filtroEstado || p.estado === filtroEstado;
    const matchTipo = !filtroTipo || String(p.tipo_producto_id) === filtroTipo;

    return matchTexto && matchEstado && matchTipo;
  });

  const hayFiltrosActivos = Boolean(buscador || filtroEstado || filtroTipo);

  return (
    <main className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>📦 Productos Académicos</h1>
          <p>Gestiona los productos asociados a los proyectos</p>
        </div>
        <Link href="/productos/nuevo" className="btn-primary">
          ➕ Nuevo Producto
        </Link>
        <Link href="/admin" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>
          ← Volver al Panel Admin
        </Link>
      </div>

      {error && (
        <div className="alert alert-error" style={{ margin: '1rem 0' }}>
          {error}
        </div>
      )}

      {/* TOOLBAR Y BARRA DE BÚSQUEDA MEJORADA */}
      <section
        className="toolbar card"
        style={{
          margin: '1rem 0',
          padding: '1rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {/* Input con botón de borrar integrado */}
        <div style={{ position: 'relative', flex: '1 1 280px', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '10px', color: '#9ca3af' }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por título, resumen o DOI..."
            value={buscador}
            onChange={(e) => setBuscador(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '34px',
              paddingRight: buscador ? '32px' : '12px',
              height: '38px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              outline: 'none',
            }}
          />
          {buscador && (
            <button
              type="button"
              onClick={() => setBuscador('')}
              style={{
                position: 'absolute',
                right: '8px',
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '2px 6px',
              }}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtro por Estado */}
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{ height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Filtro por Tipo de Producto */}
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          style={{ height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        >
          <option value="">Todos los tipos</option>
          {tipos.map((t) => (
            <option key={t.id} value={String(t.id)}>
              {t.nombre}
            </option>
          ))}
        </select>

        {/* Botón para reiniciar todos los filtros */}
        {hayFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            style={{
              height: '38px',
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid #fca5a5',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            🧹 Limpiar filtros
          </button>
        )}
      </section>

      {/* Muestra de resultados */}
      {loading ? (
        <p>⏳ Cargando productos...</p>
      ) : productosFiltrados.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          {hayFiltrosActivos ? (
            <div>
              <p>No encontramos ningún producto que coincida con tus criterios.</p>
              <button
                onClick={limpiarFiltros}
                style={{
                  marginTop: '0.5rem',
                  color: '#2563eb',
                  background: 'none',
                  border: 'none',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Restablecer búsqueda y filtros
              </button>
            </div>
          ) : (
            'Todavía no hay productos registrados.'
          )}
        </div>
      ) : (
        <table className="productos-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Estado</th>
              <th>Año</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.titulo}</td>
                <td>{ESTADOS.find((s) => s.value === p.estado)?.label || p.estado || '—'}</td>
                <td>{p.anio_produccion || '—'}</td>
                <td>
                  <Link href={`/productos/${p.id}`}>👁️ Ver</Link>{' '}
                  <Link href={`/productos/${p.id}/editar`}>✏️ Editar</Link>{' '}
                  <button
                    onClick={() => handleEliminar(p.id)}
                    disabled={eliminandoId === p.id}
                    aria-label={`Eliminar ${p.titulo}`}
                  >
                    {eliminandoId === p.id ? '...' : '🗑️'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}