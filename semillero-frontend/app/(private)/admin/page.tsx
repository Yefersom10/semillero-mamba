'use client';

import Link from 'next/link';
import type { SVGProps, ComponentType } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

interface ModuloAdmin {
  titulo: string;
  descripcion: string;
  href: string;
  icon: ComponentType<IconProps>;
}

// Iconos Vectoriales
function IconUsers(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} width="24" height="24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V21" />
      <circle cx="10" cy="7.5" r="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.5c1.5.4 2.6 1.8 2.6 3.4s-1.1 3-2.6 3.4M22 21v-1.5c0-1.7-1.1-3.2-2.7-3.8" />
    </svg>
  );
}

function IconTeacher(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} width="24" height="24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v6.5" />
    </svg>
  );
}

function IconKey(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} width="24" height="24" {...props}>
      <circle cx="8" cy="15" r="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 11.5 20 3M20 3h-3.2M20 3v3.2M16.5 6.5 18.5 8.5" />
    </svg>
  );
}

function IconInstitution(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} width="24" height="24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 4l9 6.5M5 10.5V20M19 10.5V20M9 20v-5.5h6V20M3 20h18" />
    </svg>
  );
}

function IconTag(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} width="24" height="24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.5 3.5 8 8a2 2 0 0 1 0 2.8l-5.4 5.4a2 2 0 0 1-2.8 0l-8-8V4.5a1 1 0 0 1 1-1h7.2Z" />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

const modulos: ModuloAdmin[] = [
  {
    titulo: 'Gestión de Usuarios',
    descripcion: 'Registra, edita perfiles y asigna roles a los usuarios del sistema.',
    href: '/admin/usuarios',
    icon: IconUsers,
  },
  {
    titulo: 'Planta Docente',
    descripcion: 'Administra la información, vinculación e investigadores del programa.',
    href: '/admin/docente',
    icon: IconTeacher,
  },
  {
    titulo: 'Gestión de Roles',
    descripcion: 'Configura y parametriza los niveles de acceso y permisos del semillero.',
    href: '/admin/roles',
    icon: IconKey,
  },
  {
    titulo: 'Grupos Minciencias',
    descripcion: 'Administra los grupos institucionales de investigación asignados.',
    href: '/admin/grupos',
    icon: IconInstitution,
  },
  {
    titulo: 'Tipos de Producto',
    descripcion: 'Parametriza categorías científicas: software, artículos, patentes.',
    href: '/admin/tipos',
    icon: IconTag,
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="container">
      <div className="page-header">
        <h1>🛠️ Panel de Administración</h1>
        <p>Configura y parametriza el funcionamiento del semillero desde un mismo lugar.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {modulos.map(({ titulo, descripcion, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.25rem',
              padding: '1.5rem',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 64, 128, 0.1)',
                color: '#004080',
                flexShrink: 0,
              }}
            >
              <Icon />
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                {titulo}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.4' }}>
                {descripcion}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}