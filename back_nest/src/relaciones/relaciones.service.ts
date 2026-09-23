import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoUsuario } from '../relaciones/entities/proyecto-usuario.entity';
import { ProductoAutor } from '../relaciones/entities/producto-autor.entity';
import { CreateProyectoUsuarioDto } from './dto/create-proyecto-usuario.dto';
import { UpdateProyectoUsuarioDto } from './dto/update-proyecto-usuario.dto';
import { CreateProductoAutorDto } from './dto/create-producto-autor.dto';
import { UpdateProductoAutorDto } from './dto/update-producto-autor.dto';

@Injectable()
export class RelacionesService {
  constructor(
    @InjectRepository(ProyectoUsuario)
    private readonly puRepository: Repository<ProyectoUsuario>,
    @InjectRepository(ProductoAutor)
    private readonly paRepository: Repository<ProductoAutor>,
  ) {}

  // ── PROYECTO USUARIOS ──────────────────────────────────────────
  async findAllProyectoUsuarios(
    skip: number = 0,
    limit: number = 100,
  ): Promise<ProyectoUsuario[]> {
    return await this.puRepository.find({
      skip,
      take: limit,
      relations: { proyecto: true, usuario: true },
    });
  }

  async findOneProyectoUsuario(id: number): Promise<ProyectoUsuario> {
    const obj = await this.puRepository.findOne({
      where: { id },
      relations: { proyecto: true, usuario: true },
    });
    if (!obj) throw new NotFoundException('Membresía no encontrada');
    return obj;
  }

  async createProyectoUsuario(
    dto: CreateProyectoUsuarioDto,
  ): Promise<ProyectoUsuario> {
    const nuevo = this.puRepository.create(dto);
    return await this.puRepository.save(nuevo);
  }

  async updateProyectoUsuario(
    id: number,
    dto: UpdateProyectoUsuarioDto,
  ): Promise<ProyectoUsuario> {
    const obj = await this.findOneProyectoUsuario(id);
    Object.assign(obj, dto);
    return await this.puRepository.save(obj);
  }

  async removeProyectoUsuario(id: number): Promise<void> {
    const obj = await this.findOneProyectoUsuario(id);
    await this.puRepository.remove(obj);
  }

  // ── PRODUCTO AUTORES ───────────────────────────────────────────
  async findAllProductoAutores(
    skip: number = 0,
    limit: number = 100,
  ): Promise<ProductoAutor[]> {
    return await this.paRepository.find({
      skip,
      take: limit,
      relations: { producto: true, usuario: true },
    });
  }

  async findOneProductoAutor(id: number): Promise<ProductoAutor> {
    const obj = await this.paRepository.findOne({
      where: { id },
      relations: { producto: true, usuario: true },
    });
    if (!obj) throw new NotFoundException('Autor no encontrado');
    return obj;
  }

  async createProductoAutor(
    dto: CreateProductoAutorDto,
  ): Promise<ProductoAutor> {
    const nuevo = this.paRepository.create(dto);
    return await this.paRepository.save(nuevo);
  }

  async updateProductoAutor(
    id: number,
    dto: UpdateProductoAutorDto,
  ): Promise<ProductoAutor> {
    const obj = await this.findOneProductoAutor(id);
    Object.assign(obj, dto);
    return await this.paRepository.save(obj);
  }

  async removeProductoAutor(id: number): Promise<void> {
    const obj = await this.findOneProductoAutor(id);
    await this.paRepository.remove(obj);
  }
}
