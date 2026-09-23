import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Rol } from '../roles/entities/role.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { email: loginDto.email },
      relations: { rol: true },
    });

    if (
      !usuario ||
      !(await bcrypt.compare(loginDto.password, usuario.password_hash))
    ) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!usuario.activo) {
      throw new ForbiddenException('Usuario inactivo');
    }

    const payload = { sub: usuario.id, rol: usuario.rol_id };

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'bearer',
    };
  }

  async registro(createUsuarioDto: CreateUsuarioDto) {
    const existing = await this.usuarioRepository.findOneBy({
      email: createUsuarioDto.email,
    });
    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Buscar directamente el rol ID 4
    const rolDefecto = await this.rolRepository.findOneBy({ id: 4 });
    if (!rolDefecto) {
      throw new InternalServerErrorException(
        'El rol por defecto (ID 4) no existe',
      );
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

    // Extraemos datos evitando que traiga un rol_id previo
    const { password, ...datosUsuario } = createUsuarioDto;

    const nuevoUsuario = this.usuarioRepository.create({
      ...datosUsuario,
      password_hash: hashedPassword,
      rol_id: rolDefecto.id, // Forzado a ID 4
    });

    const saved = await this.usuarioRepository.save(nuevoUsuario);
    const { password_hash, ...usuarioSinPassword } = saved;
    return usuarioSinPassword;
  }

  async getMe(userId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: userId },
      relations: { rol: true },
    });

    if (!usuario || !usuario.activo) {
      throw new ForbiddenException('Usuario inactivo o no encontrado');
    }

    const { password_hash, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }
}
