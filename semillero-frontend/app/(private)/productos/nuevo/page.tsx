'use client';

import type { ApiError } from '@/lib/errors';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productosService } from '@/services/api.service';

export default function NuevoProductoPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    proyecto_id: 1,
    tipo_producto_id: 1,
    estado: 'en_proceso',
    anio_produccion: new Date().getFullYear(),
    doi: '',
    url_evidencia: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await productosService.create({
        ...form,
        proyecto_id: Number(form.proyecto_id),
        tipo_producto_id: Number(form.tipo_producto_id),
        anio_produccion: Number(form.anio_produccion),
        activo: true,
      });
      router.push('/productos');
    } catch (errRaw) {
      const err = errRaw as ApiError;
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container">
      <h1>➕ Nuevo Producto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input
            type="text"
            required
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </div>
        <div>
          <label>Descripción</label>
          <textarea
            required
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Guardando...' : '🚀 Crear Producto'}
        </button>
      </form>
    </main>
  );
}