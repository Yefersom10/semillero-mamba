import { api } from './api';
import {
  User,
  Rol,
  TipoProducto,
  GrupoMinciencias,
  CreateGrupoMincienciasDto,
  UpdateGrupoMincienciasDto,
} from '../types/api';

export const adminService = {
  // === USUARIOS ===
  async getUsuarios(): Promise<User[]> {
    const response = await api.get<User[]>('/usuarios');
    return response.data;
  },

  async crearUsuario(payload: Partial<User>): Promise<User> {
    const response = await api.post<User>('/usuarios', payload);
    return response.data;
  },

  async actualizarUsuario(id: number | string, payload: Partial<User>): Promise<User> {
    const response = await api.patch<User>(`/usuarios/${id}`, payload);
    return response.data;
  },

  async eliminarUsuario(id: number | string): Promise<void> {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  // === ROLES ===
  async getRoles(): Promise<Rol[]> {
    const response = await api.get<Rol[]>('/roles');
    return response.data;
  },

  async crearRol(payload: Partial<Rol>): Promise<Rol> {
    const response = await api.post<Rol>('/roles', payload);
    return response.data;
  },

  async actualizarRol(id: number | string, payload: Partial<Rol>): Promise<Rol> {
    const response = await api.patch<Rol>(`/roles/${id}`, payload);
    return response.data;
  },

  async eliminarRol(id: number | string): Promise<void> {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  },

  // === GRUPOS MINCIENCIAS ===
  async getGrupos(): Promise<GrupoMinciencias[]> {
    const response = await api.get<GrupoMinciencias[]>('/grupos-minciencias');
    return response.data;
  },

  async createGrupo(payload: CreateGrupoMincienciasDto): Promise<GrupoMinciencias> {
    const response = await api.post<GrupoMinciencias>('/grupos-minciencias', payload);
    return response.data;
  },

  async updateGrupo(id: number | string, payload: UpdateGrupoMincienciasDto): Promise<GrupoMinciencias> {
    const response = await api.patch<GrupoMinciencias>(`/grupos-minciencias/${id}`, payload);
    return response.data;
  },

  async deleteGrupo(id: number | string): Promise<void> {
    // Corregido: apunte consistente a /grupos-minciencias
    const response = await api.delete(`/grupos-minciencias/${id}`);
    return response.data;
  },

  // === TIPOS DE PRODUCTO ===
  async getTipos(): Promise<TipoProducto[]> {
    const response = await api.get<TipoProducto[]>('/tipos-producto');
    return response.data;
  },

  async crearTipo(payload: Partial<TipoProducto>): Promise<TipoProducto> {
  try {
    const response = await api.post<TipoProducto>(
      '/tipos-producto',
      payload
    );

    return response.data;
  } catch (error: any) {
    console.error('❌ Error creando tipo:', error);
    console.error('📦 Payload enviado:', payload);
    console.error('📡 Status:', error.response?.status);
    console.error('💬 Respuesta backend:', error.response?.data);

    throw error;
  }
},

  async actualizarTipo(id: number | string, payload: Partial<TipoProducto>): Promise<TipoProducto> {
    const response = await api.patch<TipoProducto>(`/tipos-producto/${id}`, payload);
    return response.data;
  },

  async eliminarTipo(id: number | string): Promise<void> {
    const response = await api.delete(`/tipos-producto/${id}`);
    return response.data;
  },
};