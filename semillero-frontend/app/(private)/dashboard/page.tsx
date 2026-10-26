'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardMetrics from '@/components/DashboardMetrics';
import RecentActivity from '@/components/RecentActivity';
import { estadisticasService, ResumenDashboard } from '@/services/estadisticasService';
import { obtenerRolId } from '@/utils/permissions';

interface UserSession {
  id?: number;
  nombre: string;
  email: string;
  rol?: string;
  rol_id?: number; // 1: Admin, 2: Profe/Investigador, 3: Estudiante, 4: Espera
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null);
  const [cargandoResumen, setCargandoResumen] = useState(true);
  const [stats, setStats] = useState({
    proyectos: 'Cargando...',
    productos: 'Cargando...',
  });

  const cargarEstadisticas = async (sesion: UserSession) => {
    try {
      const datos = await estadisticasService.getResumen(sesion);
      setResumen(datos);
      setStats({
        proyectos: `${datos.totalProyectos} proyectos registrados`,
        productos: `${datos.totalProductos} productos registrados`,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setStats({
        proyectos: 'No disponible',
        productos: 'No disponible',
      });
    } finally {
      setCargandoResumen(false);
    }
  };

  useEffect(() => {
    // 1. Verificar autenticación desde localStorage
    const storedUserStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !storedUserStr) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUserStr);

      // Normalización única del rol (1 Admin · 2 Docente · 3 Estudiante · 4 Espera)
      parsedUser.rol_id = obtenerRolId(parsedUser);

      setUser(parsedUser);

      if (parsedUser.rol_id !== 4) {
        cargarEstadisticas(parsedUser);
      } else {
        setCargandoResumen(false);
      }
    } catch (e) {
      console.error('Error al parsear el usuario:', e);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const obtenerNombreRol = (rolId?: number) => {
    const roles: Record<number, string> = {
      1: 'Administrador',
      2: 'Profesor / Docente',
      3: 'Estudiante',
      4: 'Usuario sin asignación',
    };
    return rolId ? roles[rolId] || 'Sin rol' : 'Cargando...';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    router.push('/login');
  };

  if (loading) {
    return (
      <main className="container">
        <div className="loading-block">
          <span>⏳ Cargando Dashboard...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingBottom: '3rem' }}>
      {/* HEADER DEL DASHBOARD */}
      <div 
        className="page-header" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>📊 Dashboard</h1>
          <p style={{ margin: 0, marginTop: '0.25rem' }}>
            Bienvenido, <strong>{user?.nombre}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span 
            className="badge" 
            style={{ 
              backgroundColor: user?.rol_id === 1 ? '#dbeafe' : user?.rol_id === 2 ? '#d1fae5' : '#f1f5f9',
              color: user?.rol_id === 1 ? '#1e40af' : user?.rol_id === 2 ? '#065f46' : '#334155',
              padding: '0.4rem 0.8rem',
              fontSize: '0.875rem'
            }}
          >
            ROL: {obtenerNombreRol(user?.rol_id).toUpperCase()}
          </span>

          <button onClick={handleLogout} className="btn-danger">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* RENDERIZADO CONDICIONAL POR ROL */}
      {user?.rol_id === 4 ? (
        /* PANTALLA DE BLOQUEO (ROL 4) */
        <div className="card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⏳</span>
          <h2 style={{ marginBottom: '0.75rem' }}>Cuenta en Espera de Asignación</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Hola, <strong>{user.nombre}</strong>. Tu cuenta ha sido creada correctamente en la plataforma del <strong>Semillero Mamba</strong>, pero aún no cuentas con un rol operativo asignado.
          </p>

          <div 
            style={{ 
              backgroundColor: '#fffbe3', 
              borderLeft: '4px solid #f59e0b', 
              padding: '1rem', 
              textAlign: 'left', 
              borderRadius: '0 6px 6px 0', 
              marginBottom: '1.5rem' 
            }}
          >
            <p style={{ margin: 0, color: '#78350f', fontSize: '0.875rem', lineHeight: '1.5' }}>
              ⚠️ <strong>Información:</strong> Para visualizar los proyectos, productos y el panel de control completo, es necesario que un administrador o docente modifique tu rol en el sistema.
            </p>
          </div>

          <a
            href={`mailto:jmllanosm@corhuila.edu.co?subject=Solicitud de Rol - Semillero Mamba - ${user.nombre}`}
            className="btn-primary"
            style={{ display: 'inline-block', textDecoration: 'none' }}
          >
            📧 Solicitar asignación al Profesor / Administrador
          </a>
        </div>
      ) : (
        /* VISTA OPERATIVA COMPLETA (ROLES 1, 2 Y 3) */
        <>
          {/* BLOQUE DE MÉTRICAS KPI SEGÚN ROL (datos reales, unificado en DashboardMetrics) */}
          <DashboardMetrics cards={resumen?.cards ?? []} loading={cargandoResumen} />

          {/* GRID DE ACCESOS RÁPIDOS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Proyectos</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{stats.proyectos}</p>
              </div>
              <button className="btn-primary" onClick={() => router.push('/proyectos')} style={{ width: '100%' }}>
                Ver proyectos
              </button>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Productos</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{stats.productos}</p>
              </div>
              <button className="btn-primary" onClick={() => router.push('/productos')} style={{ width: '100%' }}>
                Ver productos
              </button>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Mi Perfil</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Información personal y contraseña
                </p>
              </div>
              <button className="btn-primary" onClick={() => router.push('/perfil')} style={{ width: '100%' }}>
                Editar perfil
              </button>
            </div>

            {user?.rol_id === 1 && (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', borderTop: '4px solid #1a7c5e' }}>
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛠️</div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Administración</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Gestión global de usuarios y asignación de roles
                  </p>
                </div>
                <button className="btn-primary" onClick={() => router.push('/admin')} style={{ width: '100%' }}>
                  Panel administrativo
                </button>
              </div>
            )}
          </div>

          {/* ACTIVIDAD RECIENTE DEL SEMILLERO (datos reales, unificado en RecentActivity) */}
          <RecentActivity user={user} />
        </>
      )}
    </main>
  );
}