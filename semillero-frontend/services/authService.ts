import { api } from './api';

export interface RegisterDto {
  nombre: string;
  email: string;
  password?: string;
  rol_id?: number;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    rol_id?: number;
    rol?: {
      id: number;
      nombre: string;
    } | string;
  };
}

export const authService = {
  async register(data: RegisterDto) {
    const response = await api.post('/auth/registro', data);
    return response.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/perfil');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};