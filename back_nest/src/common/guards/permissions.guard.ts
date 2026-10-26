import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permission.decorator';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { RolPermiso } from '../../roles/entities/rol-permiso.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: Usuario }>();
    const user = request.user;

    if (!user || !user.rol) {
      throw new ForbiddenException('El usuario no tiene un rol asignado');
    }

    // Fix 1: Soporta 'Administrador' o cualquier variante que contenga 'admin'
    const rolNombre = user.rol.nombre?.toLowerCase() || '';
    if (
      user.rol_id === 1 ||
      user.rol.id === 1 ||
      rolNombre === 'administrador' ||
      rolNombre.includes('admin')
    ) {
      return true;
    }

    // Fix 2: Búsqueda flexible de la relación del rol
    const rol = user.rol as Usuario['rol'] & {
      rol_permisos?: RolPermiso[];
      rolesPermisos?: RolPermiso[];
    };
    const rolesPermisos: RolPermiso[] =
      rol.roles_permisos || rol.rol_permisos || rol.rolesPermisos || [];

    if (!rolesPermisos || rolesPermisos.length === 0) {
      throw new ForbiddenException(
        'El rol del usuario no tiene permisos asociados',
      );
    }

    // Fix 3: Mapea múltiples formatos (nombre, modulo:accion, accion:modulo)
    const userPermissions = new Set<string>();

    rolesPermisos.forEach((rp) => {
      if (rp.permiso) {
        if (rp.permiso.nombre)
          userPermissions.add(rp.permiso.nombre.toLowerCase());
        if (rp.permiso.modulo && rp.permiso.accion) {
          userPermissions.add(
            `${rp.permiso.modulo}:${rp.permiso.accion}`.toLowerCase(),
          );
          userPermissions.add(
            `${rp.permiso.accion}:${rp.permiso.modulo}`.toLowerCase(),
          );
          userPermissions.add(
            `${rp.permiso.modulo}_${rp.permiso.accion}`.toLowerCase(),
          );
        }
      }
    });

    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.has(perm.toLowerCase()),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'No tienes los permisos suficientes para ejecutar esta acción',
      );
    }

    return true;
  }
}
