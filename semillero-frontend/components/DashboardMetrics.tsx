'use client';

import React from 'react';
import { MetricaCard } from '@/services/estadisticasService';

interface DashboardMetricsProps {
  cards: MetricaCard[];
  loading?: boolean;
}

// Tarjetas KPI del dashboard. Los datos los calcula estadisticasService
// según el rol; este componente solo los presenta (sin duplicar lógica).
export default function DashboardMetrics({ cards, loading = false }: DashboardMetricsProps) {
  const grilla = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  };

  if (loading) {
    return (
      <div style={grilla} aria-busy="true" aria-label="Cargando estadísticas">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="card"
            style={{
              padding: '1.25rem',
              borderLeft: '4px solid #e2e8f0',
              opacity: 0.6,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              Cargando...
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.25rem 0 0 0', color: '#cbd5e1' }}>
              —
            </h3>
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', color: '#64748b' }}>
        No hay estadísticas disponibles para tu rol.
      </div>
    );
  }

  return (
    <div style={grilla}>
      {cards.map((card) => (
        <div
          key={card.id}
          className="card"
          style={{ padding: '1.25rem', borderLeft: `4px solid ${card.color}` }}
        >
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{card.titulo}</span>
          <h3
            style={{
              fontSize: typeof card.valor === 'number' ? '1.8rem' : '1.2rem',
              fontWeight: 'bold',
              margin: typeof card.valor === 'number' ? '0.25rem 0 0 0' : '0.5rem 0 0 0',
              color: '#0f172a',
            }}
          >
            {card.valor}
          </h3>
          <span style={{ fontSize: '0.75rem', color: card.detalleColor || '#64748b' }}>
            {card.detalle}
          </span>
        </div>
      ))}
    </div>
  );
}
