'use client';

import type { ApiError } from '@/lib/errors';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { docentesService } from '@/services/docentesService';

function FormularioEditarDocente() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      alert('No se especificó un ID de docente');
      router.push('/docentes');
      return;
    }

    docentesService
      .getById(Number(id))
      .then((docente) => {
        setNombre(docente.nombre);
        setEmail(docente.email);
      })
      .catch((err) => {
        console.error(err);
        alert('Error al cargar datos del docente');
        router.push('/docentes');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await docentesService.update(Number(id), { nombre, email });
      alert('Docente actualizado exitosamente');
      router.push('/docentes');
    } catch (errRaw) {
      const err = errRaw as ApiError;
      alert(err.message || 'Error al actualizar el docente');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container">
        <p>⏳ Cargando datos del docente...</p>
      </main>
    );
  }

  return (
    <main className="container container-small">
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2>✏️ Editar Docente</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Nombre Completo</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: '100%', height: '38px', padding: '0 8px' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label>Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', height: '38px', padding: '0 8px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/docente" className="btn-secondary">
              Cancelar
            </Link>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function EditarDocentePage() {
  return (
    <Suspense fallback={<main className="container"><p>⏳ Cargando...</p></main>}>
      <FormularioEditarDocente />
    </Suspense>
  );
}