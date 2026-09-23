import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/role.entity';
import { CreateRolDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async findAll(skip: number = 0, limit: number = 100): Promise<Rol[]> {
    return await this.rolRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOneBy({ id });
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return rol;
  }

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const nuevoRol = this.rolRepository.create(createRolDto);
    return await this.rolRepository.save(nuevoRol);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Rol> {
    const rol = await this.findOne(id);
    Object.assign(rol, updateRoleDto);
    return await this.rolRepository.save(rol);
  }

  async remove(id: number): Promise<void> {
    const rol = await this.findOne(id);
    await this.rolRepository.remove(rol);
  }
}
