import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';

@Injectable()
export abstract class BaseService<T extends { id: any }> {
  constructor(protected readonly repository: Repository<T>) {}

  async get(id: T['id']): Promise<T> {
    const item = await this.repository.findOne({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }
    return item;
  }

  async getMulti(skip: number = 0, limit: number = 100): Promise<T[]> {
    return await this.repository.find({
      skip,
      take: limit,
    });
  }

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return await this.repository.save(entity);
  }

  async update(id: T['id'], updateDto: DeepPartial<T>): Promise<T> {
    const item = await this.get(id);
    const updated = this.repository.merge(item, updateDto);
    return await this.repository.save(updated);
  }

  async remove(id: T['id']): Promise<T> {
    const item = await this.get(id);
    return await this.repository.remove(item);
  }

  async getByNombre(nombre: string): Promise<T | null> {
    return await this.repository.findOne({
      where: { nombre } as unknown as FindOptionsWhere<T>,
    });
  }
}
