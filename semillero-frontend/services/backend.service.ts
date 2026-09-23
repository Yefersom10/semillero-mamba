import { api } from './api';
import { 
  LoginDto, 
  LoginResponse, // 1. Importamos LoginResponse
  Proyecto, 
  CreateProyectoDto, 
  UpdateProyectoDto, 
  Producto, 
  CreateProductoDto, 
  UpdateProductoDto 
} from '../types/api';

// --- AUTH ---
export const authService = {
  login: async (credentials: LoginDto) => {
    // 2. Usamos LoginResponse como el tipo genérico de retorno
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Obtener el token ya sea que venga como access_token o como token
    const token = response.data.access_token || response.data.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// --- PROYECTOS ---
export const proyectosService = {
  getPublicos: async () => {
    const response = await api.get<Proyecto[]>('/proyectos/publico');
    return response.data;
  },
  getAll: async () => {
    const response = await api.get<Proyecto[]>('/proyectos');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<Proyecto>(`/proyectos/${id}`);
    return response.data;
  },
  create: async (data: CreateProyectoDto) => {
    const response = await api.post<Proyecto>('/proyectos', data);
    return response.data;
  },
  update: async (id: number, data: UpdateProyectoDto) => {
    const response = await api.patch<Proyecto>(`/proyectos/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/proyectos/${id}`);
    return response.data;
  },
};

// --- PRODUCTOS ---
export const productosService = {
  getAll: async () => {
    const response = await api.get<Producto[]>('/productos');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<Producto>(`/productos/${id}`);
    return response.data;
  },
  create: async (data: CreateProductoDto) => {
    const response = await api.post<Producto>('/productos', data);
    return response.data;
  },
  update: async (id: number, data: UpdateProductoDto) => {
    const response = await api.patch<Producto>(`/productos/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },
};