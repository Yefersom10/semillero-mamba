'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Producto, ProductoAutor, User } from '@/types/api';
import { productosService, productoAutoresService } from '@/services/api.service';
import { adminService } from '@/services/adminService';
import { SessionUser, puedeLeerUsuarios } from '@/utils/permissions';

const ESTADO_INFO: Record<string, { label: string; badgeClass: string }> = {
  en_proceso: { label: 'En proceso', badgeClass: 'badge-warning' },
  completado: { label: 'Completado', badgeClass: 'badge-success' },
  publicado: { label: 'Publicado', badgeClass: 'badge-success' },
  archivado: { label: 'Archivado', badgeClass: 'badge-secondary' },
};

export default function DetalleProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productoId } = use(params);
  const router = useRouter();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [autores, setAutores] = useState<ProductoAutor[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'autores'>('info');
  // Solo admin/docente pueden listar usuarios (permiso usuarios:leer)
  const [puedeListarUsuarios, setPuedeListarUsuarios] = useState(false);

  // Formulario nuevo autor
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | ''>('');
  const [rolAutor, setRolAutor] = useState('coautor');
  const [esPrincipal, setEsPrincipal] = useState(false);
  const [autorMsg, setAutorMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [agregandoAutor, setAgregandoAutor] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  useEffect(() => {
    cargarTodo();
  }, [productoId]);

  const cargarTodo = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('user');
      const sesion: SessionUser | null = stored ? JSON.parse(stored) : null;
      const permitidoListar = puedeLeerUsuarios(sesion);
      setPuedeListarUsuarios(permitidoListar);

      const [prodData, todosAutores] = await Promise.all([
        productosService.getById(Number(productoId)),
        productoAutoresService.getAll(),
      ]);

      setProducto(prodData);

      // GET /usuarios exige usuarios:leer; sin ese permiso (estudiantes) se omite
      // para no romper la página con un 403. Los nombres de autores llegan en la
      // relación usuario de producto-autores.
      if (permitidoListar) {
        try {
          setUsuarios(await adminService.getUsuarios());
        } catch (err) {
          console.warn('No se pudo cargar el listado de usuarios:', err);
        }
      }

      const autoresFiltrados = todosAutores.filter(
        (a) => String(a.producto_id) === String(productoId)
      );
      setAutores(autoresFiltrados);
    } catch (err: any) {
      console.error('Error al cargar detalle del producto:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarAutor = async () => {
    setAutorMsg(null);
    if (!selectedUsuarioId) {
      setAutorMsg({ text: 'Selecciona un usuario', type: 'error' });
      return;
    }

    const yaExiste = autores.some((a) => Number(a.usuario_id) === Number(selectedUsuarioId));
    if (yaExiste) {
      setAutorMsg({ text: 'El usuario ya es autor de este producto', type: 'error' });
      return;
    }

    setAgregandoAutor(true);
    try {
      await productoAutoresService.create({
        producto_id: Number(productoId),
        usuario_id: Number(selectedUsuarioId),
        rol_autor: rolAutor,
        es_autor_principal: esPrincipal,
      });

      setAutorMsg({ text: 'Autor agregado exitosamente', type: 'success' });
      setSelectedUsuarioId('');
      setEsPrincipal(false);

      // Recargar lista de autores
      const todosAutores = await productoAutoresService.getAll();
      setAutores(todosAutores.filter((a) => String(a.producto_id) === String(productoId)));
    } catch (err: any) {
      setAutorMsg({ text: err.message || 'Error al agregar autor', type: 'error' });
    } finally {
      setAgregandoAutor(false);
    }
  };

  const handleEliminarAutor = async (id: number) => {
    if (!confirm('¿Deseas desvincular a este autor?')) return;
    setEliminandoId(id);
    try {
      await productoAutoresService.delete(id);
      setAutores(autores.filter((a) => a.id !== id));
    } catch (err: any) {
      alert('Error al eliminar autor: ' + err.message);
    } finally {
      setEliminandoId(null);
    }
  };

  const handleEliminarProducto = async () => {
    if (!confirm('⚠️ ¿Eliminar este producto por completo? Esta acción es irreversible.')) return;
    try {
      await productosService.delete(Number(productoId));
      router.push('/productos');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <main className="container">
        <div className="loading-block">⏳ Cargando datos del producto...</div>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="container">
        <div className="alert alert-error">No se encontró el producto especificado.</div>
      </main>
    );
  }

  const estadoInfo = ESTADO_INFO[producto.estado ?? ''] ?? {
    label: producto.estado || 'Activo',
    badgeClass: 'badge-success',
  };

  return (
    <main className="container">
      {/* Encabezado Principal */}
      <div className="project-hero" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className={`badge ${estadoInfo.badgeClass}`}>{estadoInfo.label}</span>
            <h1 style={{ margin: '0.5rem 0' }}>{producto.titulo}</h1>
            <p>{producto.descripcion || 'Sin descripción disponible'}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link href={`/productos/${producto.id}/editar`} className="btn-primary">
              ✏️ Editar
            </Link>
            <button onClick={handleEliminarProducto} className="btn-danger">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación */}
      <div className="tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            cursor: 'pointer',
            backgroundColor: activeTab === 'info' ? '#2563eb' : '#ffffff',
            color: activeTab === 'info' ? '#ffffff' : '#374151',
            fontWeight: activeTab === 'info' ? '600' : '400',
          }}
        >
          📋 Información
        </button>
        <button
          className={`tab-btn ${activeTab === 'autores' ? 'active' : ''}`}
          onClick={() => setActiveTab('autores')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            cursor: 'pointer',
            backgroundColor: activeTab === 'autores' ? '#2563eb' : '#ffffff',
            color: activeTab === 'autores' ? '#ffffff' : '#374151',
            fontWeight: activeTab === 'autores' ? '600' : '400',
          }}
        >
          ✍️ Autores ({autores.length})
        </button>
      </div>

      {/* Panel 1: Información */}
      {activeTab === 'info' && (
        <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <h4>📂 Tipo de Producto</h4>
            <p>{producto.tipo_producto?.nombre || '—'}</p>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <h4>📅 Año Producción</h4>
            <p>{producto.anio_produccion || '—'}</p>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <h4>🔑 Identificador DOI</h4>
            <p><code>{producto.doi || 'No registrado'}</code></p>
          </div>
        </div>
      )}

      {/* Panel 2: Autores */}
      {activeTab === 'autores' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3>✍️ Asignación de Autores</h3>

          {/* Formulario Agregar Autor (requiere listado de usuarios: solo admin/docente) */}
          {puedeListarUsuarios && (
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label>Usuario</label>
                <select
                  value={selectedUsuarioId}
                  onChange={(e) => setSelectedUsuarioId(Number(e.target.value) || '')}
                  disabled={agregandoAutor}
                >
                  <option value="">Seleccione un usuario...</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Rol de Autor</label>
                <select value={rolAutor} onChange={(e) => setRolAutor(e.target.value)} disabled={agregandoAutor}>
                  <option value="investigador principal">Investigador principal</option>
                  <option value="coautor">Coautor</option>
                  <option value="colaborador">Colaborador</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={esPrincipal}
                  onChange={(e) => setEsPrincipal(e.target.checked)}
                  disabled={agregandoAutor}
                />
                Marcar como Autor Principal
              </label>
            </div>

            {autorMsg && (
              <div style={{ color: autorMsg.type === 'error' ? 'red' : 'green', marginBottom: '1rem' }}>
                {autorMsg.text}
              </div>
            )}

            <button onClick={handleAgregarAutor} className="btn-primary" disabled={agregandoAutor}>
              {agregandoAutor ? 'Agregando...' : '➕ Agregar autor'}
            </button>
          </div>
          )}

          {/* Lista de Autores */}
          {autores.length === 0 ? (
            <p>No hay autores asociados a este producto.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {autores.map((a) => {
                const usr = usuarios.find((u) => Number(u.id) === Number(a.usuario_id));
                const nombreMostrar = usr ? usr.nombre : a.usuario?.nombre || `Usuario ID: ${a.usuario_id}`;
                const eliminando = eliminandoId === a.id;

                return (
                  <div
                    key={a.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                    }}
                  >
                    <div>
                      <strong>{nombreMostrar}</strong> — <span>{a.rol_autor}</span>
                      {a.es_autor_principal && <span style={{ color: 'gold', marginLeft: '0.5rem' }}>⭐ Principal</span>}
                    </div>
                    <button
                      onClick={() => handleEliminarAutor(a.id)}
                      className="btn-danger btn-ghost"
                      disabled={eliminando}
                    >
                      {eliminando ? '...' : '✕'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </main>
  );
}