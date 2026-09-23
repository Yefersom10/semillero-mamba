import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Rol } from './entities/role.entity';
import { RolPermiso } from './entities/rol-permiso.entity';
import { Permiso } from './entities/permiso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rol, RolPermiso, Permiso])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
