import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Rol } from '../roles/entities/role.entity';
import { Permiso } from '../roles/entities/permiso.entity';
import { RolPermiso } from '../roles/entities/rol-permiso.entity';
import { GrupoMinciencias } from '../catalogos/entities/grupo-minciencias.entity';
import { TipoProducto } from '../catalogos/entities/tipo-producto.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import { ProyectoUsuario } from '../relaciones/entities/proyecto-usuario.entity';
import { Producto } from '../productos/entities/producto.entity';
import { ProductoAutor } from '../relaciones/entities/producto-autor.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    // SEED_ENABLED=false desactiva la creación de tablas y los datos de
    // demostración (usuarios con contraseña conocida): usar en producción.
    if (process.env.SEED_ENABLED === 'false') {
      this.logger.log('Seed desactivado (SEED_ENABLED=false)');
      return;
    }
    await this.run();
  }

  async run() {
    // Forzar la creación de tablas si no existen en PostgreSQL
    await this.dataSource.synchronize();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const rolRepo = queryRunner.manager.getRepository(Rol);
      if ((await rolRepo.count()) > 0) {
        this.logger.log('Base de datos ya sembrada');
        await queryRunner.rollbackTransaction();
        return;
      }

      // ======================
      // ROLES
      // ======================
      const [admin, profesor, estudiante, usuario] = await rolRepo.save([
        { nombre: 'Administrador' },
        { nombre: 'Profesor' },
        { nombre: 'Estudiante' },
        { nombre: 'Usuario' },
      ]);

      // ======================
      // PERMISOS
      // ======================
      const permisoRepo = queryRunner.manager.getRepository(Permiso);
      const permisos = await permisoRepo.save([
        { nombre: 'Crear Usuario', modulo: 'usuarios', accion: 'crear' },
        { nombre: 'Leer Usuario', modulo: 'usuarios', accion: 'leer' },
        {
          nombre: 'Actualizar Usuario',
          modulo: 'usuarios',
          accion: 'actualizar',
        },
        { nombre: 'Eliminar Usuario', modulo: 'usuarios', accion: 'eliminar' },

        { nombre: 'Crear Proyecto', modulo: 'proyectos', accion: 'crear' },
        { nombre: 'Leer Proyecto', modulo: 'proyectos', accion: 'leer' },
        {
          nombre: 'Actualizar Proyecto',
          modulo: 'proyectos',
          accion: 'actualizar',
        },
        {
          nombre: 'Eliminar Proyecto',
          modulo: 'proyectos',
          accion: 'eliminar',
        },

        { nombre: 'Crear Producto', modulo: 'productos', accion: 'crear' },
        { nombre: 'Leer Producto', modulo: 'productos', accion: 'leer' },
        {
          nombre: 'Actualizar Producto',
          modulo: 'productos',
          accion: 'actualizar',
        },
        {
          nombre: 'Eliminar Producto',
          modulo: 'productos',
          accion: 'eliminar',
        },

        { nombre: 'Crear Rol', modulo: 'roles', accion: 'crear' },
        { nombre: 'Leer Rol', modulo: 'roles', accion: 'leer' },
        { nombre: 'Actualizar Rol', modulo: 'roles', accion: 'actualizar' },
        { nombre: 'Eliminar Rol', modulo: 'roles', accion: 'eliminar' },
      ]);

      const permMap = new Map(permisos.map((p) => [p.nombre, p]));
      const rolPermisoRepo = queryRunner.manager.getRepository(RolPermiso);

      // Asignaciones
      const adminPerms = permisos.map((p) => ({
        rol_id: admin.id,
        permiso_id: p.id,
      }));

      const profNames = [
        'Leer Usuario',
        'Crear Proyecto',
        'Leer Proyecto',
        'Actualizar Proyecto',
        'Eliminar Proyecto',
        'Crear Producto',
        'Eliminar Producto',
        'Actualizar Producto',
        'Leer Producto',
      ];
      const profPerms = profNames.map((n) => ({
        rol_id: profesor.id,
        permiso_id: permMap.get(n)!.id,
      }));

      const estNames = [
        'Leer Proyecto',
        'Actualizar Proyecto',
        'Eliminar Proyecto',
        'Leer Producto',
      ];
      const estPerms = estNames.map((n) => ({
        rol_id: estudiante.id,
        permiso_id: permMap.get(n)!.id,
      }));

      const userNames = ['Leer Proyecto'];
      const userPerms = userNames.map((n) => ({
        rol_id: usuario.id,
        permiso_id: permMap.get(n)!.id,
      }));

      await rolPermisoRepo.save([
        ...adminPerms,
        ...profPerms,
        ...estPerms,
        ...userPerms,
      ]);

      // ======================
      // GRUPOS Y TIPOS PRODUCTO
      // ======================
      const grupoRepo = queryRunner.manager.getRepository(GrupoMinciencias);
      const [grupoIng, grupoSocial] = await grupoRepo.save([
        { nombre: 'Ingeniería' },
        { nombre: 'Ciencias Sociales' },
      ]);

      const tipoRepo = queryRunner.manager.getRepository(TipoProducto);
      const [articulo] = await tipoRepo.save([
        { grupo_id: grupoIng.id, nombre: 'Artículo Científico' },
        { grupo_id: grupoSocial.id, nombre: 'Ponencia' },
      ]);

      // ======================
      // USUARIOS
      // ======================
      const passHash = await bcrypt.hash('123456', 10);
      const usuarioRepo = queryRunner.manager.getRepository(Usuario);
      const [userAdmin, userProf, userEst] = await usuarioRepo.save([
        {
          nombre: 'Julian',
          email: 'julian@mamba.com',
          password_hash: passHash,
          rol_id: admin.id,
        },
        {
          nombre: 'Jose',
          email: 'jose@mamba.com',
          password_hash: passHash,
          rol_id: profesor.id,
        },
        {
          nombre: 'Maria',
          email: 'maria@mamba.com',
          password_hash: passHash,
          rol_id: estudiante.id,
        },
        {
          nombre: 'Carlos',
          email: 'carlos@mamba.com',
          password_hash: passHash,
          rol_id: usuario.id,
        },
      ]);

      // ======================
      // PROYECTO Y RELACIONES
      // ======================
      const proyectoRepo = queryRunner.manager.getRepository(Proyecto);
      const proyecto = await proyectoRepo.save({
        nombre: 'Sistema seccional de gestión investigativa',
        descripcion: 'Plataforma para gestión investigativa',
        imagen_url:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu3-_TbUInL975rAfMjR83kQAjePhVRRJFfw&s',
        link_proyecto:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu3-_TbUInL975rAfMjR83kQAjePhVRRJFfw&s',
        estado: 'activo',
        fecha_inicio: new Date(),
        creado_por: userAdmin.id,
      });

      const puRepo = queryRunner.manager.getRepository(ProyectoUsuario);
      await puRepo.save([
        {
          proyecto_id: proyecto.id,
          usuario_id: userProf.id,
          rol_en_proyecto: 'Director',
        },
        {
          proyecto_id: proyecto.id,
          usuario_id: userEst.id,
          rol_en_proyecto: 'Investigador',
        },
      ]);

      // ======================
      // PRODUCTO Y AUTORES
      // ======================
      const productoRepo = queryRunner.manager.getRepository(Producto);
      const producto = await productoRepo.save({
        tipo_producto_id: articulo.id,
        proyecto_id: proyecto.id,
        titulo: 'Modelo Predictivo con IA',
        descripcion: 'Investigación aplicada con machine learning',
        estado: 'finalizado',
        anio_produccion: 2026,
      });

      const paRepo = queryRunner.manager.getRepository(ProductoAutor);
      await paRepo.save([
        {
          producto_id: producto.id,
          usuario_id: userProf.id,
          rol_autor: 'Autor Principal',
          es_autor_principal: true,
        },
        {
          producto_id: producto.id,
          usuario_id: userEst.id,
          rol_autor: 'Coautor',
        },
      ]);

      await queryRunner.commitTransaction();
      this.logger.log('Seed ejecutado correctamente');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error al ejecutar el seed', error);
    } finally {
      await queryRunner.release();
    }
  }
}
