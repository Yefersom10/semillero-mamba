import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelacionesService } from './relaciones.service';
import { ProyectoUsuariosController } from './proyecto-usuarios.controller';
import { ProductoAutoresController } from './producto-autores.controller';
import { ProyectoUsuario } from '../relaciones/entities/proyecto-usuario.entity';
import { ProductoAutor } from '../relaciones/entities/producto-autor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProyectoUsuario, ProductoAutor])],
  controllers: [ProyectoUsuariosController, ProductoAutoresController],
  providers: [RelacionesService],
  exports: [RelacionesService],
})
export class RelacionesModule {}
