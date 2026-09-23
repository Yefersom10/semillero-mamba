import { api } from './api';
import { User } from '@/types/api';

export interface CreateDocenteDto {
    nombre: string;
    email: string;
    password?: string;
    rol_id?: number;
}

export const docentesService = {
    // Obtener solo usuarios con rol Profesor
    async getAll(): Promise<User[]> {
        const response = await api.get<User[]>('/usuarios');
        const todos: User[] = response.data;

        // Filtrado local por nombre de rol o id según tu backend
        return todos.filter((u) => {
            const nombreRol = typeof u.rol === 'object' ? u.rol.nombre : u.rol;
            return (
                nombreRol?.toLowerCase() === 'profesor' ||
                nombreRol?.toLowerCase() === 'docente' ||
                u.rol_id === 2 // Asumiendo ID de rol profesor
            );
        });
    },

    async getById(id: number): Promise<User> {
        const response = await api.get<User>(`/usuarios/${id}`);
        return response.data;
    },

    // 🔴 CAMBIO AQUÍ: Usar CreateDocenteDto en lugar de Partial<User>
    async create(data: CreateDocenteDto): Promise<User> {
        const response = await api.post<User>('/usuarios', {
            ...data,
            rol_id: 2, // Fuerza la asignación como Docente/Profesor
        });
        return response.data;
    },

    async update(id: number, data: Partial<User>): Promise<User> {
        const response = await api.patch<User>(`/usuarios/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/usuarios/${id}`);
    },
};