'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { construirActividad, ActivityItem } from '@/utils/actividad';
import { esAsociadoAlProyecto, esAdmin, SessionUser, puedeLeerUsuarios } from '@/utils/permissions';
import { proyectosService } from '@/services/backend.service';
import { productosService, productoAutoresService } from '@/services/api.service';
import { adminService } from '@/services/adminService';

interface RecentActivityProps {
  user: SessionUser | null;
}

async function seguro<T>(promesa: Promise<T>): Promise<T | null> {
  try {
    return await promesa;
  } catch (error) {
    console.warn('Actividad: fuente no disponible', error);
    return null;
  }
}

// Feed de actividad reciente calculado desde created_at/updated_at
// de proyectos y productos (los usuarios solo los ve el admin).
export default function RecentActivity({ user }: RecentActivityProps) {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Loader puro: hace los fetches y devuelve los items SIN tocar estado.
  // El setState vive en la continuación .then, fuera del cuerpo síncrono del effect.
  const obtenerItems = useCallback(async (): Promise<ActivityItem[]> => {
    if (!user) return [];

    const admin = esAdmin(user);

    const [proyectos, productos] = await Promise.all([
      seguro(proyectosService.getAll()),
      seguro(productosService.getAll()),
    ]);

    let usuarios: Awaited<ReturnType<typeof adminService.getUsuarios>> | null = null;
    let listaProyectos = proyectos ?? [];
    let listaProductos = productos ?? [];

    if (admin) {
      // El admin solo necesita usuarios si tiene permiso (siempre)
      usuarios = puedeLeerUsuarios(user) ? await seguro(adminService.getUsuarios()) : null;
    } else {
      // Docentes y estudiantes: solo su propia actividad
      listaProyectos = listaProyectos.filter((p) => esAsociadoAlProyecto(user, p));
      const idsMisProyectos = new Set(listaProyectos.map((p) => Number(p.id)));

      const autores = await seguro(productoAutoresService.getAll());
      const idsMisProductos = new Set(
        (autores || [])
          .filter((a) => Number(a.usuario_id) === Number(user.id))
          .map((a) => Number(a.producto_id))
      );

      listaProductos = listaProductos.filter(
        (prod) =>
          idsMisProyectos.has(Number(prod.proyecto_id)) || idsMisProductos.has(Number(prod.id))
      );
    }

    return construirActividad({
      proyectos: listaProyectos,
      productos: listaProductos,
      usuarios,
      limite: 6,
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let cancelado = false;
    obtenerItems().then((items) => {
      if (cancelado) return;
      setItems(items);
      setLoading(false);
    });

    return () => {
      cancelado = true;
    };
  }, [user, obtenerItems]);

  return (
    <section className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.15rem',
            fontWeight: 'bold',
            margin: 0,
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>📌</span> Actividad Reciente del Semillero
        </h2>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
          {esAdmin(user) ? 'Últimos movimientos' : 'Tus últimos movimientos'}
        </span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} aria-busy="true">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                height: '48px',
                borderRadius: '6px',
                background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
          No hay actividad reciente que mostrar.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                paddingBottom: '0.85rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: item.badgeColor,
                  marginTop: '0.4rem',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#1e293b' }}>
                    {item.titulo}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {item.fechaRelativa}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: '#475569',
                    margin: '0.2rem 0 0 0',
                    lineHeight: '1.4',
                  }}
                >
                  {item.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
