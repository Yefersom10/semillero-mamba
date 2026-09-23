'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarPrivate from '@/components/NavbarPrivate';
import Chatbot, { UserRole } from '@/components/Chatbot';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState<string>('Usuario');
  const [userRole, setUserRole] = useState<UserRole>('estudiante');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/login');
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Extraer nombre del usuario
        if (parsedUser.nombre) {
          setUserName(parsedUser.nombre);
        } else if (parsedUser.email) {
          setUserName(parsedUser.email.split('@')[0]);
        }

        // Mapear rol para el Chatbot
        const rawRol = typeof parsedUser.rol === 'object' && parsedUser.rol !== null
          ? parsedUser.rol.nombre
          : parsedUser.rol || parsedUser.rol_id;

        const normalizedRol = String(rawRol || '').toLowerCase();

        if (normalizedRol.includes('admin') || normalizedRol === '1') {
          setUserRole('coordinador'); // O el rol de admin que soporte tu Chatbot
        } else if (normalizedRol.includes('prof') || normalizedRol.includes('docente') || normalizedRol === '2') {
          setUserRole('profesor' as UserRole);
        } else {
          setUserRole('estudiante');
        }

      } catch (e) {
        console.error('Error al leer datos de usuario en Layout:', e);
      }

      setAuthorized(true);
    }
  }, [router]);

  // Si no está autorizado aún, muestra la pantalla de carga
  if (!authorized) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
        Cargando y verificando sesión...
      </div>
    );
  }

  return (
    <>
      <NavbarPrivate />
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        {children}
      </main>
      
      {/* Chatbot TSX global con datos dinámicos */}
      <Chatbot userRole={userRole} userName={userName} />
    </>
  );
}