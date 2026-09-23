'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthContext/useAuth';

interface User {
  nombre?: string;
  email?: string;
  rol_id?: number;
  rol?: string | { id?: number; nombre?: string };
}

export default function NavbarPrivate() {
  const router = useRouter();
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [roleId, setRoleId] = useState<number>(4); // Por defecto: Usuario en espera
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);

        let resolvedRoleId = 4; // Default: Usuario en espera

        if (typeof parsedUser.rol_id === 'number') {
          resolvedRoleId = parsedUser.rol_id;
        } else if (typeof parsedUser.rol === 'number') {
          resolvedRoleId = parsedUser.rol;
        } else if (parsedUser.rol) {
          // 1. Obtener la cadena o valor del rol sin importar su estructura
          const rawRol = typeof parsedUser.rol === 'object' && parsedUser.rol !== null
            ? (parsedUser.rol as any).nombre || (parsedUser.rol as any).name
            : parsedUser.rol;

          if (rawRol !== undefined && rawRol !== null) {
            // 2. Convertir de forma segura a String antes de usar toUpperCase()
            const normalized = String(rawRol).trim().toUpperCase();

            const rolesMap: Record<string, number> = {
              ADMIN: 1,
              ADMINISTRADOR: 1,
              PROFESOR: 2,
              DOCENTE: 2,
              INVESTIGADOR: 2,
              ESTUDIANTE: 3,
              ALUMNO: 3,
              USUARIO: 4,
              'USUARIO EN ESPERA': 4,
            };

            resolvedRoleId = rolesMap[normalized] || 4;
          }
        }

        setRoleId(resolvedRoleId);
      } catch (e) {
        console.error('Error al parsear el usuario desde localStorage:', e);
      }
    }
  }, []);

  const obtenerNombreRol = (id: number) => {
    const roles: Record<number, string> = {
      1: 'Administrador',
      2: 'Profesor',
      3: 'Estudiante',
      4: 'Usuario en espera',
    };
    return roles[id] || 'Usuario';
  };

  const handleLogout = () => {
    // Usa el logout del AuthContext para limpiar localStorage
    // y el estado del contexto al mismo tiempo (evita sesiones fantasma)
    logout();
    router.push('/login');
  };

  return (
    <header className="navbar-private-header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-item">
            <Image
              src="/Logo/Logo.png"
              className="logo-main"
              alt="Logo Mamba"
              width={50}
              height={50}
              priority
            />
          </div>
        </div>

        <div className="header-title">
          <h1>🐍 Semillero Mamba</h1>
          <p>Panel de usuario</p>
        </div>

        <button
          className="navbar-mobile-toggle"
          id="navbar-toggle"
          aria-label="Menú"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <nav className={`nav-menu ${menuOpen ? 'active' : ''}`} id="nav-menu">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
            📊 Dashboard
          </Link>

          {/* VISIBLE SOLO PARA ADMINISTRADORES (ROL ID 1) */}
          {roleId === 1 && (
            <Link href="/admin" onClick={() => setMenuOpen(false)}>
              🛠️ Administración
            </Link>
          )}

          {/* VISIBLE SOLO PARA ROLES OPERATIVOS (ROLES 1, 2 Y 3) */}
          {roleId !== 4 && (
            <Link href="/proyectos" onClick={() => setMenuOpen(false)}>
              📁 Proyectos
            </Link>
          )}

          <div className="nav-user">
            <span>👤 {user?.nombre || user?.email?.split('@')[0] || 'Usuario'}</span>
            <small>{obtenerNombreRol(roleId)}</small>
          </div>

          <button className="btn-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </div>
    </header>
  );
}