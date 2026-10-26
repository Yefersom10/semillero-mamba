import { api } from './api';
import { 
  Producto, 
  CreateProductoDto, 
  UpdateProductoDto,
  TipoProducto,
  ProductoAutor,
  CreateProductoAutorDto
} from '../types/api';

// ... (Auth y Proyectos se mantienen igual)

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

// --- TIPOS DE PRODUCTO ---
export const tiposProductoService = {
  getAll: async () => {
    const response = await api.get<TipoProducto[]>('/tipos-producto');
    return response.data;
  },
};

// --- PRODUCTO AUTORES ---
export const productoAutoresService = {
  getAll: async () => {
    const response = await api.get<ProductoAutor[]>('/producto-autores');
    return response.data;
  },
  create: async (data: CreateProductoAutorDto) => {
    const response = await api.post<ProductoAutor>('/producto-autores', data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/producto-autores/${id}`);
    return response.data;
  },
};