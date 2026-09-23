import { ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProyectosService } from './proyectos.service';
import { Proyecto } from './entities/proyecto.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

describe('ProyectosService — control de pertenencia (editar/eliminar)', () => {
  let service: ProyectosService;

  // Proyecto de prueba: creado por el usuario 10, miembro activo el usuario 20
  const proyectoBase = (): Proyecto =>
    ({
      id: 5,
      nombre: 'Proyecto de prueba',
      creado_por: 10,
      proyecto_usuarios: [
        {
          id: 1,
          proyecto_id: 5,
          usuario_id: 20,
          rol_en_proyecto: 'Investigador',
          activo: true,
        },
        {
          id: 2,
          proyecto_id: 5,
          usuario_id: 30,
          rol_en_proyecto: 'Saliente',
          activo: false,
        },
      ],
    }) as unknown as Proyecto;

  const repo = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    softRemove: jest.fn(),
    create: jest.fn(),
  };

  const admin = {
    id: 1,
    rol_id: 1,
    rol: { id: 1, nombre: 'Administrador' },
  } as Usuario;
  const docenteNoAsociado = {
    id: 40,
    rol_id: 2,
    rol: { id: 2, nombre: 'Profesor' },
  } as Usuario;
  const docenteCreador = {
    id: 10,
    rol_id: 2,
    rol: { id: 2, nombre: 'Profesor' },
  } as Usuario;
  const estudianteMiembro = {
    id: 20,
    rol_id: 3,
    rol: { id: 3, nombre: 'Estudiante' },
  } as Usuario;
  const estudianteMiembroInactivo = {
    id: 30,
    rol_id: 3,
    rol: { id: 3, nombre: 'Estudiante' },
  } as Usuario;
  const estudianteAjeno = {
    id: 99,
    rol_id: 3,
    rol: { id: 3, nombre: 'Estudiante' },
  } as Usuario;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProyectosService(repo as unknown as Repository<Proyecto>);

    repo.findOne.mockResolvedValue(proyectoBase());
    repo.save.mockResolvedValue(proyectoBase());
    repo.softRemove.mockResolvedValue(undefined);
  });

  describe('update', () => {
    it('permite al administrador editar cualquier proyecto', async () => {
      await expect(
        service.update(5, { nombre: 'Nuevo nombre' }, admin),
      ).resolves.toBeDefined();
      expect(repo.save).toHaveBeenCalled();
    });

    it('permite al docente creador del proyecto editarlo', async () => {
      await expect(
        service.update(5, { nombre: 'Nuevo nombre' }, docenteCreador),
      ).resolves.toBeDefined();
      expect(repo.save).toHaveBeenCalled();
    });

    it('permite al estudiante miembro activo editar el proyecto', async () => {
      await expect(
        service.update(5, { nombre: 'Nuevo nombre' }, estudianteMiembro),
      ).resolves.toBeDefined();
      expect(repo.save).toHaveBeenCalled();
    });

    it('rechaza al docente que NO está asociado al proyecto', async () => {
      await expect(
        service.update(5, { nombre: 'Hack' }, docenteNoAsociado),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('rechaza al estudiante que NO está asociado al proyecto', async () => {
      await expect(
        service.update(5, { nombre: 'Hack' }, estudianteAjeno),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('rechaza al miembro cuya membresía está inactiva', async () => {
      await expect(
        service.update(5, { nombre: 'Hack' }, estudianteMiembroInactivo),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('permite eliminar al administrador', async () => {
      await expect(service.remove(5, admin)).resolves.toBeUndefined();
      expect(repo.softRemove).toHaveBeenCalled();
    });

    it('permite eliminar al estudiante miembro activo', async () => {
      await expect(
        service.remove(5, estudianteMiembro),
      ).resolves.toBeUndefined();
      expect(repo.softRemove).toHaveBeenCalled();
    });

    it('rechaza eliminar al estudiante no asociado', async () => {
      await expect(service.remove(5, estudianteAjeno)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(repo.softRemove).not.toHaveBeenCalled();
    });

    it('rechaza eliminar al docente no asociado', async () => {
      await expect(service.remove(5, docenteNoAsociado)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(repo.softRemove).not.toHaveBeenCalled();
    });
  });
});
