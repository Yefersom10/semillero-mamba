// ==========================================
// Autenticación
// ==========================================
export interface LoginDto {
  email: string;
  password: string;
}

// ==========================================
// Usuarios
// ==========================================
export type RolNombre = 'Administrador' | 'Profesor' | 'Estudiante' | 'Usuario';

export interface Rol {
  id: number;
  nombre: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: RolNombre | string | Rol;
  rol_id?: number;
  activo?: boolean;
  ultimo_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  access_token?: string;
  token?: string;
  user?: User;
  usuario?: User;
  data?: {
    access_token?: string;
    token?: string;
    user?: User;
    usuario?: User;
  };
  id?: number | string;
  nombre?: string;
  email?: string;
  rol?: string | Rol;
  rol_id?: number;
}

// ==========================================
// Proyectos
// ==========================================
export interface CreateProyectoDto {
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  link_proyecto?: string;
  estado?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  creado_por?: number;
  activo?: boolean;
}

export type UpdateProyectoDto = Partial<CreateProyectoDto>;

// ==========================================
// Proyecto — Miembros (tabla intermedia)
// ==========================================
export interface ProyectoUsuario {
  id: number;
  proyecto_id: number;
  usuario_id: number;
  rol_en_proyecto?: string;
  fecha_ingreso?: string;
  fecha_salida?: string;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
  usuario?: Pick<User, 'id' | 'nombre' | 'email'>;
}

export interface Proyecto extends CreateProyectoDto {
  id: number;
  created_at?: string;
  updated_at?: string;
  creador?: Pick<User, 'id' | 'nombre' | 'email'>;
  proyecto_usuarios?: ProyectoUsuario[];
  productos?: Producto[];
}

// ==========================================
// Tipos de Producto
// ==========================================
export interface TipoProducto {
  id: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

// ==========================================
// Productos
// ==========================================
export interface CreateProductoDto {
  titulo: string;
  descripcion?: string;
  proyecto_id: number;
  tipo_producto_id: number;
  estado?: 'en_proceso' | 'enviado' | 'publicado' | 'rechazado' | string;
  anio_produccion?: number;
  doi?: string;
  url_evidencia?: string;
  activo?: boolean;
}

export type UpdateProductoDto = Partial<CreateProductoDto>;

// Interfaz unificada para entidad de Producto
export interface Producto extends CreateProductoDto {
  id: number;
  created_at?: string;
  updated_at?: string;
  proyecto?: { id: number; nombre: string };
  tipo_producto?: TipoProducto;
  autores?: ProductoAutor[];
}

// ==========================================
// Producto - Autores (Tabla Intermedia)
// ==========================================
export interface CreateProductoAutorDto {
  producto_id: number;
  usuario_id: number;
  rol_autor?: string;
  es_autor_principal?: boolean;
}

export interface ProductoAutor extends CreateProductoAutorDto {
  id: number;
  usuario?: {
    id: number;
    nombre: string;
    email: string;
  };
  producto?: Producto;
}
// ==========================================
// Grupos Minciencias (FALTABA ESTE MÓDULO)
// ==========================================
export interface CreateGrupoMincienciasDto {
  nombre: string;
  codigo?: string;
  descripcion?: string;
  activo?: boolean;
}

export type UpdateGrupoMincienciasDto = Partial<CreateGrupoMincienciasDto>;

export interface GrupoMinciencias extends CreateGrupoMincienciasDto {
  id: number | string;
}

// ==========================================
// Líneas de Investigación
// ==========================================
export interface CreateLineaInvestigacionDto {
  nombre: string;
  codigo?: string;
  descripcion?: string;
  grupo_id?: number | string;
  activo?: boolean;
}

export type UpdateLineaInvestigacionDto = Partial<CreateLineaInvestigacionDto>;

export interface LineaInvestigacion extends CreateLineaInvestigacionDto {
  id: number | string;
  grupo?: GrupoMinciencias;
}

// ==========================================
// DTOs adicionales para Usuarios
// ==========================================
export interface CreateUserDto {
  nombre: string;
  email: string;
  password?: string;
  rol_id: number;
  activo?: boolean;
}

export type UpdateUserDto = Partial<CreateUserDto>;