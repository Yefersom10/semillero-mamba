import { Proyecto, ProyectoUsuario } from '@/types/api';

// ==========================================
// Sesión de usuario (forma flexible porque
// el login puede guardar el rol de varias formas)
// ==========================================
export interface SessionUser {
  id?: number | string;
  rol?: number | string | { id?: number; nombre?: string; name?: string };
  rol_id?: number | string;
  id_rol?: number | string;
}

// Normaliza cualquier forma del rol en sesión a un id numérico:
// 1 Admin · 2 Docente · 3 Estudiante · 4 Usuario (sin asignación)
export function obtenerRolId(user?: SessionUser | null): number {
  if (!user) return 4;

  const candidatos = [user.rol_id, user.id_rol];
  if (typeof user.rol === 'number' || (typeof user.rol === 'string' && user.rol.trim() !== '')) {
    candidatos.push(user.rol);
  }
  if (typeof user.rol === 'object' && user.rol !== null) {
    candidatos.push(user.rol.id);
  }

  for (const candidato of candidatos) {
    if (candidato === undefined || candidato === null || candidato === '') continue;
    const numero = Number(candidato);
    if (!Number.isNaN(numero) && numero > 0) return numero;
  }

  const nombre =
    String(
      (typeof user.rol === 'object' && user.rol !== null
        ? user.rol.nombre || user.rol.name
        : user.rol) || ''
    )
      .trim()
      .toLowerCase();

  if (nombre.includes('admin')) return 1;
  if (nombre.includes('profesor') || nombre.includes('docente') || nombre.includes('investigador')) return 2;
  if (nombre.includes('estudiante') || nombre.includes('alumno')) return 3;

  return 4;
}

export function esAdmin(user?: SessionUser | null): boolean {
  return obtenerRolId(user) === 1;
}

export function esDocente(user?: SessionUser | null): boolean {
  return obtenerRolId(user) === 2;
}

export function esEstudiante(user?: SessionUser | null): boolean {
  return obtenerRolId(user) === 3;
}

// Docentes y admin pueden leer el listado de usuarios (usuarios:leer)
export function puedeLeerUsuarios(user?: SessionUser | null): boolean {
  return esAdmin(user) || esDocente(user);
}

// ==========================================
// Pertenencia a un proyecto
// ==========================================
export function esAsociadoAlProyecto(
  user: SessionUser | null | undefined,
  proyecto: Proyecto | null | undefined
): boolean {
  const userId = Number(user?.id);
  if (!userId || !proyecto) return false;

  if (Number(proyecto.creado_por) === userId) return true;

  const miembros: ProyectoUsuario[] = proyecto.proyecto_usuarios || [];
  return miembros.some((miembro) => {
    const miembroId = Number(miembro.usuario_id ?? miembro.usuario?.id);
    return miembroId === userId && miembro.activo !== false;
  });
}

// ¿Puede editar/eliminar el proyecto?
// - Admin: siempre.
// - Docente y Estudiante: solo si lo creó o es miembro activo.
// - Rol sin asignación (4): nunca (además no tiene permisos en el backend).
export function puedeGestionarProyecto(
  user: SessionUser | null | undefined,
  proyecto: Proyecto | null | undefined
): boolean {
  if (!user || !proyecto) return false;
  if (esAdmin(user)) return true;

  const rolId = obtenerRolId(user);
  if (rolId !== 2 && rolId !== 3) return false;

  return esAsociadoAlProyecto(user, proyecto);
}

// ¿Puede crear proyectos? (proyectos:crear → admin y docente)
export function puedeCrearProyecto(user?: SessionUser | null): boolean {
  return esAdmin(user) || esDocente(user);
}
