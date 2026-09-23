import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async findAll(skip: number = 0, limit: number = 100): Promise<Producto[]> {
    return await this.productoRepository.find({
      skip,
      take: limit,
      relations: {
        tipo_producto: {
          grupo: true,
        },
        proyecto: true,
        producto_autores: {
          usuario: true,
        },
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: {
        tipo_producto: {
          grupo: true,
        },
        proyecto: true,
        producto_autores: {
          usuario: true,
        },
      },
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async create(dto: CreateProductoDto): Promise<Producto> {
    const nuevoProducto = this.productoRepository.create(dto);
    const guardado = await this.productoRepository.save(nuevoProducto);
    return this.findOne(guardado.id);
  }

  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    Object.assign(producto, dto);
    await this.productoRepository.save(producto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.softRemove(producto);
  }
}
