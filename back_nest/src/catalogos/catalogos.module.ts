import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogosService } from './catalogos.service';
import { GruposMincienciasController } from './grupos-minciencias.controller';
import { TiposProductoController } from './tipos-producto.controller';
import { GrupoMinciencias } from '../catalogos/entities/grupo-minciencias.entity';
import { TipoProducto } from '../catalogos/entities/tipo-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GrupoMinciencias, TipoProducto])],
  controllers: [GruposMincienciasController, TiposProductoController],
  providers: [CatalogosService],
  exports: [CatalogosService],
})
export class CatalogosModule {}
