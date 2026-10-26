'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthContext/useAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    // 1. Resolver el usuario: contexto primero; si está vacío (por ejemplo
    //    tras un login que solo escribió en localStorage), leer localStorage
    let resolvedUser = user;

    if (!resolvedUser) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          resolvedUser = JSON.parse(storedUser);
        }
      } catch (e) {
        console.error('Error al leer usuario de localStorage:', e);
      }
    }

    // 2. Si no hay usuario en ninguna fuente, ir a login
    if (!resolvedUser) {
      router.push('/login');
      return;
    }

    // 3. Extraer el ID del rol soportando números directos (ej: user.rol = 1)
    const rolId = Number(
      (typeof resolvedUser.rol === 'number' ? resolvedUser.rol : null) ??
      resolvedUser.rol_id ??
      (typeof resolvedUser.rol === 'object' ? resolvedUser.rol?.id : null) ??
      (resolvedUser as { id_rol?: number }).id_rol
    );

    // 4. Extraer nombre del rol si viene como string u objeto
    const rawRolName = typeof resolvedUser.rol === 'object' ? resolvedUser.rol?.nombre : (typeof resolvedUser.rol === 'string' ? resolvedUser.rol : '');
    const nombreRol = String(rawRolName || '').toLowerCase().trim();

    // 5. Determinar si es Administrador (ID 1 o nombre admin)
    const esAdmin =
      rolId === 1 ||
      nombreRol === 'administrador' ||
      nombreRol === 'admin' ||
      nombreRol.includes('admin');

    // Si NO es admin, redirigir al dashboard
    if (!esAdmin) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <main className="container">
        <p>⏳ Verificando permisos de administración...</p>
      </main>
    );
  }

  return <>{children}</>;
}