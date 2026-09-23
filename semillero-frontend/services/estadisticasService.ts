import { adminService } from './adminService';
import { proyectosService } from './backend.service';
import { productosService, productoAutoresService } from './api.service';
import { Proyecto, Producto, User } from '../types/api';
import {
  SessionUser,
  esAsociadoAlProyecto,
  obtenerRolId,
} from '../utils/permissions';

// ==========================================
// Tipos
// ==========================================
export interface MetricaCard {
  id: string;
  titulo: string;
  valor: string | number;
  detalle: string;
  color: string;
  detalleColor?: string;
}

export interface ResumenDashboard {
  cards: MetricaCard[];
  totalProyectos: number;
  totalProductos: number;
}

// Ejecuta una petición sin romper el resto si falla (devuelve null)
async function seguro<T>(promesa: Promise<T>): Promise<T | null> {
  try {
    return await promesa;
  } catch (error) {
    console.warn('Stat no disponible:', error);
    return null;
  }
}

function esEsteMes(fecha?: string): boolean {
  if (!fecha) return false;
  const creada = new Date(fecha);
  const ahora = new Date();
  return (
    creada.getMonth() === ahora.getMonth() &&
    creada.getFullYear() === ahora.getFullYear()
  );
}

function estaPendiente(estado?: string): boolean {
  const normalizado = String(estado || '').toLowerCase();
  return normalizado === 'en_proceso' || normalizado === 'enviado';
}

function proyectosDelUsuario(user: SessionUser, proyectos: Proyecto[]): Proyecto[] {
  return proyectos.filter((p) => esAsociadoAlProyecto(user, p));
}

const INDISPONIBLE = '—';

// ==========================================
// Servicio
// ==========================================
export const estadisticasService = {
  async getResumen(user: SessionUser): Promise<ResumenDashboard> {
    const rolId = obtenerRolId(user);

    // Todos los roles pueden leer proyectos y productos
    const [proyectos, productos] = await Promise.all([
      seguro(proyectosService.getAll()),
      seguro(productosService.getAll()),
    ]);

    const listaProyectos = proyectos ?? [];
    const listaProductos = productos ?? [];

    const base: ResumenDashboard = {
      cards: [],
      totalProyectos: listaProyectos.length,
      totalProductos: listaProductos.length,
    };

    if (rolId === 1) return this.resumenAdmin(base, listaProyectos, listaProductos);
    if (rolId === 2) return this.resumenDocente(user, base, listaProyectos, listaProductos);
    return this.resumenEstudiante(user, base, listaProyectos, listaProductos);
  },

  // ---------- ADMIN ----------
  async resumenAdmin(
    base: ResumenDashboard,
    proyectos: Proyecto[],
    productos: Producto[]
  ): Promise<ResumenDashboard> {
    const [usuarios, grupos] = await Promise.all([
      seguro(adminService.getUsuarios()),
      seguro(adminService.getGrupos()),
    ]);

    const totalUsuarios = usuarios?.length ?? null;
    const nuevosEsteMes = usuarios?.filter((u) => esEsteMes(u.created_at)).length ?? null;
    const proyectosActivos = proyectos.filter(
      (p) => String(p.estado || 'activo').toLowerCase() === 'activo'
    ).length;
    const productosPendientes = productos.filter((prod) => estaPendiente(prod.estado)).length;
    const gruposTotales = grupos?.length ?? null;

    const cards: MetricaCard[] = [
      {
        id: 'usuarios',
        titulo: 'Total Usuarios',
        valor: totalUsuarios ?? INDISPONIBLE,
        detalle:
          totalUsuarios === null
            ? 'No disponible'
            : `↑ ${nuevosEsteMes} registrados este mes`,
        color: '#004080',
        detalleColor: '#10b981',
      },
      {
        id: 'proyectos',
        titulo: 'Proyectos Activos',
        valor: proyectosActivos,
        detalle: 'En ejecución',
        color: '#10b981',
        detalleColor: '#64748b',
      },
      {
        id: 'productos',
        titulo: 'Productos Registrados',
        valor: base.totalProductos,
        detalle: `${productosPendientes} pendientes de revisión`,
        color: '#f59e0b',
        detalleColor: '#f59e0b',
      },
      {
        id: 'grupos',
        titulo: 'Grupos Minciencias',
        valor: gruposTotales ?? INDISPONIBLE,
        detalle: gruposTotales === null ? 'No disponible' : 'Grupos registrados',
        color: '#8b5cf6',
        detalleColor: '#6b7280',
      },
    ];

    return { ...base, cards };
  },

  // ---------- DOCENTE ----------
  async resumenDocente(
    user: SessionUser,
    base: ResumenDashboard,
    proyectos: Proyecto[],
    productos: Producto[]
  ): Promise<ResumenDashboard> {
    const [usuarios] = await Promise.all([seguro(adminService.getUsuarios())]);

    const misProyectos = proyectosDelUsuario(user, proyectos);
    const idsMisProyectos = new Set(misProyectos.map((p) => Number(p.id)));

    const productosMios = productos.filter(
      (prod) => idsMisProyectos.has(Number(prod.proyecto_id))
    );

    // Estudiantes que son miembros de mis proyectos
    const miembrosIds = new Set<number>();
    misProyectos.forEach((p) =>
      (p.proyecto_usuarios || []).forEach((m) => miembrosIds.add(Number(m.usuario_id)))
    );
    const estudiantesACargo = usuarios
      ? usuarios.filter(
          (u: User) => miembrosIds.has(Number(u.id)) && obtenerRolId({ rol: u.rol, rol_id: u.rol_id }) === 3
        ).length
      : null;

    const cards: MetricaCard[] = [
      {
        id: 'proyectos',
        titulo: 'Mis Proyectos',
        valor: misProyectos.length,
        detalle: misProyectos.length > 0 ? 'Bajo mi tutoría/membresía' : 'Aún no estás asociado',
        color: '#004080',
        detalleColor: '#6b7280',
      },
      {
        id: 'productos',
        titulo: 'Productos de mis Proyectos',
        valor: productosMios.length,
        detalle: 'Entregables del semillero',
        color: '#10b981',
        detalleColor: '#6b7280',
      },
      {
        id: 'estudiantes',
        titulo: 'Estudiantes a Cargo',
        valor: estudiantesACargo ?? INDISPONIBLE,
        detalle: estudiantesACargo === null ? 'Sin acceso al listado' : 'Integrantes del semillero',
        color: '#3b82f6',
        detalleColor: '#6366f1',
      },
    ];

    return { ...base, cards };
  },

  // ---------- ESTUDIANTE ----------
  async resumenEstudiante(
    user: SessionUser,
    base: ResumenDashboard,
    proyectos: Proyecto[],
    productos: Producto[]
  ): Promise<ResumenDashboard> {
    // El estudiante no tiene usuarios:leer, pero sí puede leer sus autorías
    const misAutores = await seguro(productoAutoresService.getAll());
    const userId = Number(user.id);
    const idsMisProductos = new Set(
      (misAutores || [])
        .filter((a) => Number(a.usuario_id) === userId)
        .map((a) => Number(a.producto_id))
    );

    const misProyectos = proyectosDelUsuario(user, proyectos);
    const idsMisProyectos = new Set(misProyectos.map((p) => Number(p.id)));

    const misProductos = productos.filter(
      (prod) => idsMisProductos.has(Number(prod.id)) || idsMisProyectos.has(Number(prod.proyecto_id))
    );

    const vinculado = misProyectos.some((p) =>
      (p.proyecto_usuarios || []).some(
        (m) => Number(m.usuario_id) === userId && m.activo !== false
      )
    );

    const cards: MetricaCard[] = [
      {
        id: 'proyectos',
        titulo: 'Mis Proyectos',
        valor: misProyectos.length,
        detalle: misProyectos.length > 0 ? 'Participación activa' : 'Sin proyectos asignados',
        color: '#10b981',
        detalleColor: misProyectos.length > 0 ? '#10b981' : '#f59e0b',
      },
      {
        id: 'productos',
        titulo: 'Mis Productos',
        valor: misProductos.length,
        detalle: 'Entregables registrados',
        color: '#f59e0b',
        detalleColor: '#f59e0b',
      },
      {
        id: 'vinculacion',
        titulo: 'Estado de Vinculación',
        valor: vinculado ? 'ACTIVO' : 'SIN VINCULACIÓN',
        detalle: 'Semillero MAMBA',
        color: '#6366f1',
        detalleColor: vinculado ? '#10b981' : '#f59e0b',
      },
    ];

    return { ...base, cards };
  },
};
