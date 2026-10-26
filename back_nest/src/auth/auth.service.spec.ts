import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService — login y registro', () => {
  let service: AuthService;

  const usuarioRepo = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const rolRepo = { findOneBy: jest.fn() };
  const jwtService = { sign: jest.fn().mockReturnValue('token-firmado') };

  const crearUsuario = async (overrides: Record<string, unknown> = {}) => ({
    id: 1,
    email: 'ana@mamba.com',
    password_hash: await bcrypt.hash('clave-correcta', 4),
    rol_id: 3,
    activo: true,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      usuarioRepo as any,
      rolRepo as any,
      jwtService as unknown as JwtService,
    );
  });

  describe('login', () => {
    it('devuelve un token con credenciales válidas', async () => {
      usuarioRepo.findOne.mockResolvedValue(await crearUsuario());

      const result = await service.login({
        email: 'ana@mamba.com',
        password: 'clave-correcta',
      });

      expect(result).toEqual({
        access_token: 'token-firmado',
        token_type: 'bearer',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 1, rol: 3 });
    });

    it('rechaza un email que no existe', async () => {
      usuarioRepo.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nadie@mamba.com', password: 'x' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rechaza una contraseña incorrecta', async () => {
      usuarioRepo.findOne.mockResolvedValue(await crearUsuario());

      await expect(
        service.login({ email: 'ana@mamba.com', password: 'incorrecta' }),
      ).rejects.toThrow(UnauthorizedException);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('rechaza a un usuario inactivo aunque la contraseña sea correcta', async () => {
      usuarioRepo.findOne.mockResolvedValue(
        await crearUsuario({ activo: false }),
      );

      await expect(
        service.login({ email: 'ana@mamba.com', password: 'clave-correcta' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('registro', () => {
    const dto = {
      nombre: 'Luis',
      email: 'luis@mamba.com',
      password: 'clave-segura',
    } as any;

    it('rechaza un email ya registrado', async () => {
      usuarioRepo.findOneBy.mockResolvedValue({ id: 9 });

      await expect(service.registro(dto)).rejects.toThrow(BadRequestException);
      expect(usuarioRepo.save).not.toHaveBeenCalled();
    });

    it('fuerza el rol por defecto y no devuelve el hash de la contraseña', async () => {
      usuarioRepo.findOneBy.mockResolvedValue(null);
      rolRepo.findOneBy.mockResolvedValue({ id: 4 });
      usuarioRepo.create.mockImplementation((u) => u);
      usuarioRepo.save.mockImplementation(async (u) => ({ id: 7, ...u }));

      const result: any = await service.registro({ ...dto, rol_id: 1 });

      expect(usuarioRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ rol_id: 4 }),
      );
      expect(result.password_hash).toBeUndefined();
      expect(result.password).toBeUndefined();
      expect(result.email).toBe('luis@mamba.com');
    });
  });
});
