import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CatalogosService } from './catalogos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Catálogos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('catalogos')
export class CatalogosController {
  constructor(private readonly catalogosService: CatalogosService) {}

  // --- GRUPOS MINCIENCIAS ---
  @Get('grupos-minciencias')
  @ApiOperation({ summary: 'Obtener todos los grupos de Minciencias' })
  getGrupos() {
    return this.catalogosService.findAllGrupos();
  }

  @Get('grupos-minciencias/:id')
  @ApiOperation({ summary: 'Obtener un grupo por ID' })
  getGrupoById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogosService.findOneGrupo(id);
  }

  @Post('grupos-minciencias')
  @ApiOperation({ summary: 'Crear un nuevo grupo de Minciencias' })
  createGrupo(@Body() createGrupoDto: CreateGrupoDto) {
    return this.catalogosService.createGrupo(createGrupoDto);
  }

  // --- TIPOS DE PRODUCTO ---
  @Get('tipos-producto')
  @ApiOperation({ summary: 'Obtener todos los tipos de productos' })
  getTiposProducto() {
    return this.catalogosService.findAllTipos();
  }

  @Get('tipos-producto/:id')
  @ApiOperation({ summary: 'Obtener un tipo de producto por ID' })
  getTipoProductoById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogosService.findOneTipo(id);
  }

  @Post('tipos-producto')
  @ApiOperation({ summary: 'Crear un tipo de producto' })
  createTipoProducto(@Body() createTipoProductoDto: CreateTipoProductoDto) {
    return this.catalogosService.createTipo(createTipoProductoDto);
  }
}
