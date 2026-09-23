import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GrupoMinciencias } from './entities/grupo-minciencias.entity';
import { TipoProducto } from './entities/tipo-producto.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CatalogosService {
  constructor(
    @InjectRepository(GrupoMinciencias)
    private readonly grupoRepo: Repository<GrupoMinciencias>,
    @InjectRepository(TipoProducto)
    private readonly tipoProductoRepo: Repository<TipoProducto>,
  ) {}

  // ==========================================
  // GRUPOS MINCIENCIAS
  // ==========================================
  async findAllGrupos(skip = 0, limit = 100): Promise<GrupoMinciencias[]> {
    return await this.grupoRepo.find({
      where: { activo: true },
      skip,
      take: limit,
    });
  }

  async findOneGrupo(id: number): Promise<GrupoMinciencias> {
    const grupo = await this.grupoRepo.findOne({ where: { id, activo: true } });
    if (!grupo) throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    return grupo;
  }

  async createGrupo(
    createDto: CreateGrupoDto | Partial<GrupoMinciencias>,
  ): Promise<GrupoMinciencias> {
    const nuevo = this.grupoRepo.create(createDto);
    return await this.grupoRepo.save(nuevo);
  }

  async updateGrupo(
    id: number,
    updateDto: UpdateGrupoDto | Partial<GrupoMinciencias>,
  ): Promise<GrupoMinciencias> {
    const grupo = await this.findOneGrupo(id);
    Object.assign(grupo, updateDto);
    return await this.grupoRepo.save(grupo);
  }

  async removeGrupo(id: number): Promise<void> {
    const grupo = await this.findOneGrupo(id);
    grupo.activo = false;
    await this.grupoRepo.save(grupo);
  }

  // ==========================================
  // TIPOS DE PRODUCTO
  // ==========================================
  async findAllTipos(skip = 0, limit = 100): Promise<TipoProducto[]> {
    return await this.tipoProductoRepo.find({
      where: { activo: true },
      relations: { grupo: true },
      skip,
      take: limit,
    });
  }

  async findAllTiposProducto(skip = 0, limit = 100): Promise<TipoProducto[]> {
    return this.findAllTipos(skip, limit);
  }

  async findOneTipo(id: number): Promise<TipoProducto> {
    const tipo = await this.tipoProductoRepo.findOne({
      where: { id, activo: true },
      relations: { grupo: true },
    });
    if (!tipo)
      throw new NotFoundException(
        `Tipo de producto con ID ${id} no encontrado`,
      );
    return tipo;
  }

  async findOneTipoProducto(id: number): Promise<TipoProducto> {
    return this.findOneTipo(id);
  }

  async createTipo(
    createDto: CreateTipoProductoDto | Partial<TipoProducto>,
  ): Promise<TipoProducto> {
    const nuevoTipo = this.tipoProductoRepo.create(createDto);
    return await this.tipoProductoRepo.save(nuevoTipo);
  }

  async updateTipo(
    id: number,
    updateDto: UpdateTipoProductoDto | Partial<TipoProducto>,
  ): Promise<TipoProducto> {
    const tipo = await this.findOneTipo(id);
    Object.assign(tipo, updateDto);
    return await this.tipoProductoRepo.save(tipo);
  }

  async removeTipo(id: number): Promise<void> {
    const tipo = await this.tipoProductoRepo.findOne({
      where: { id },
    });

    if (!tipo) {
      throw new NotFoundException(
        `Tipo de producto con ID ${id} no encontrado`,
      );
    }

    await this.tipoProductoRepo.remove(tipo);
  }
}
