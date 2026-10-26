import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '.././usuarios/entities/usuario.entity';
import { getJwtSecret } from '../common/config/jwt-secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(configService),
    });
  }

  async validate(payload: { sub: string | number; email: string }) {
    const user = await this.usuarioRepository.findOne({
      where: { id: payload.sub as any, activo: true },
      relations: {
        rol: {
          roles_permisos: {
            permiso: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario inactivo o token no válido');
    }

    return user;
  }
}
