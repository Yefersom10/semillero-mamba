import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
  ) {}

  // Evita que password_hash de usuarios embebidos salga en las respuestas
  private sanitizar(proyecto: Proyecto): Proyecto {
    const limpiar = (usuario?: Usuario | null): Usuario | undefined => {
      if (!usuario) return undefined;
      const copia = { ...usuario } as Partial<Usuario>;
      delete copia.password_hash;
      return copia as Usuario;
    };

    if (proyecto.creador) {
      proyecto.creador = limpiar(proyecto.creador)!;
    }
    if (proyecto.proyecto_usuarios) {
      proyecto.proyecto_usuarios.forEach((pu) => {
        if (pu.usuario) {
          pu.usuario = limpiar(pu.usuario)!;
        }
      });
    }
    return proyecto;
  }

  private esAdmin(user?: Usuario): boolean {
    if (!user) return false;
    const rolId = user.rol_id ?? user.rol?.id;
    const nombreRol = (user.rol?.nombre || '').toLowerCase();
    return rolId === 1 || nombreRol.includes('admin');
  }

  // Admin siempre; el resto (docente/estudiante) solo si es creador o miembro activo
  private puedeGestionar(proyecto: Proyecto, user?: Usuario): boolean {
    if (this.esAdmin(user)) return true;
    if (!user) return false;

    const userId = Number(user.id);
    if (Number(proyecto.creado_por) === userId) return true;

    return (proyecto.proyecto_usuarios || []).some(
      (pu) => Number(pu.usuario_id) === userId && pu.activo !== false,
    );
  }

  private assertPuedeGestionar(proyecto: Proyecto, user?: Usuario): void {
    if (!this.puedeGestionar(proyecto, user)) {
      throw new ForbiddenException(
        'No estás asociado a este proyecto: solo los miembros y el administrador pueden modificarlo',
      );
    }
  }

  async findAll(skip: number = 0, limit: number = 100): Promise<Proyecto[]> {
    const proyectos = await this.proyectoRepository.find({
      skip,
      take: limit,
      relations: {
        creador: true,
        proyecto_usuarios: {
          usuario: true,
        },
        productos: true,
      },
      order: {
        id: 'ASC',
      },
    });
    return proyectos.map((p) => this.sanitizar(p));
  }

  async findOne(id: number): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
      relations: {
        creador: true,
        proyecto_usuarios: {
          usuario: true,
        },
        productos: true,
      },
    });
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
    return this.sanitizar(proyecto);
  }

  async create(dto: CreateProyectoDto, userId: number): Promise<Proyecto> {
    const nuevoProyecto = this.proyectoRepository.create({
      ...dto,
      creado_por: userId,
    });
    const guardado = await this.proyectoRepository.save(nuevoProyecto);
    return this.findOne(guardado.id);
  }

  async update(
    id: number,
    dto: UpdateProyectoDto,
    user?: Usuario,
  ): Promise<Proyecto> {
    const proyecto = await this.findOne(id);
    this.assertPuedeGestionar(proyecto, user);
    Object.assign(proyecto, dto);
    await this.proyectoRepository.save(proyecto);
    return this.findOne(id);
  }

  async remove(id: number, user?: Usuario): Promise<void> {
    const proyecto = await this.findOne(id);
    this.assertPuedeGestionar(proyecto, user);
    await this.proyectoRepository.softRemove(proyecto);
  }
}
