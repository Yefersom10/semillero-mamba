'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User } from '@/types/api';
import { docentesService } from '@/services/docentesService';
import { useAuth } from '@/AuthContext/useAuth';

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [buscador, setBuscador] = useState('');

  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    // Verificar solo autenticación básica
    if (!user) {
      router.push('/login');
      return;
    }

    // Cargar docentes directamente sin validar rol
    cargarDocentes();
  }, [user, authLoading, router]);

  const cargarDocentes = async () => {
    setLoading(true);
    try {
      const data = await docentesService.getAll();
      setDocentes(data);
    } catch (err: any) {
      console.error('Error al cargar docentes:', err);
      toast.error('Error al cargar la lista de docentes');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar registro del docente?')) return;
    try {
      await docentesService.delete(id);
      setDocentes((prev) => prev.filter((d) => d.id !== id));
      toast.success('Docente eliminado correctamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar el docente.');
    }
  };

  if (authLoading) {
    return (
      <main className="container">
        <p>⏳ Cargando...</p>
      </main>
    );
  }

  const docentesFiltrados = docentes.filter(
    (d) =>
      d.nombre?.toLowerCase().includes(buscador.toLowerCase()) ||
      d.email?.toLowerCase().includes(buscador.toLowerCase())
  );

  return (
    <main className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>👨‍🏫 Planta Docente</h1>
          <p>Gestión de docentes e investigadores del sistema</p>
        </div>
        <Link href="/admin/docentes/nuevo" className="btn-primary">
          ➕ Registrar Docente
        </Link>
      </div>

      <section className="card" style={{ margin: '1rem 0', padding: '1rem' }}>
        <input
          type="text"
          placeholder="🔍 Buscar docente por nombre o correo..."
          value={buscador}
          onChange={(e) => setBuscador(e.target.value)}
          style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
      </section>

      {loading ? (
        <p>⏳ Cargando registros...</p>
      ) : docentesFiltrados.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          No se encontraron docentes registrados.
        </div>
      ) : (
        <table className="productos-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo Electrónico</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentesFiltrados.map((d) => (
              <tr key={d.id}>
                <td><strong>{d.nombre}</strong></td>
                <td>{d.email}</td>
                <td>
                  <span className="badge badge-info">Docente</span>
                </td>
                <td>
                  <Link href={`/admin/docentes/editar?id=${d.id}`} className="btn-secondary">
                    ✏️ Editar
                  </Link>{' '}
                  <button onClick={() => handleEliminar(d.id)} className="btn-danger btn-ghost">
                    🗑️
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