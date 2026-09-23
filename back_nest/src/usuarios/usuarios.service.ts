import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { BaseService } from '../common/services/base.service';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService extends BaseService<Usuario> {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {
    super(usuarioRepository);
  }

  async findAll(
    skip: number = 0,
    limit: number = 100,
  ): Promise<Omit<Usuario, 'password_hash'>[]> {
    const usuarios = await this.usuarioRepository.find({
      skip,
      take: limit,
      relations: { rol: true },
      order: { id: 'ASC' },
    });

    return usuarios.map(({ password_hash, ...rest }) => rest as Usuario);
  }

  async getUsuarioById(id: number): Promise<Omit<Usuario, 'password_hash'>> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: { rol: true },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const { password_hash, ...rest } = usuario;
    return rest;
  }

  async getByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { email },
      relations: { rol: true },
    });
  }

  async createUsuario(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<Omit<Usuario, 'password_hash'>> {
    const { password, ...rest } = createUsuarioDto;
    const password_hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = this.usuarioRepository.create({
      ...rest,
      password_hash,
    });

    const saved = await this.usuarioRepository.save(nuevoUsuario);
    return this.getUsuarioById(saved.id);
  }

  async updateUsuario(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Omit<Usuario, 'password_hash'>> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUsuarioDto.password) {
      usuario.password_hash = await bcrypt.hash(updateUsuarioDto.password, 10);
      delete updateUsuarioDto.password;
    }

    Object.assign(usuario, updateUsuarioDto);
    await this.usuarioRepository.save(usuario);
    return this.getUsuarioById(id);
  }
}
