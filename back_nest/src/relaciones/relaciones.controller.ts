import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RelacionesService } from './relaciones.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';

@ApiTags('Relaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('relaciones')
export class RelacionesController {
  constructor(private readonly relacionesService: RelacionesService) {}

  // --- PROYECTO USUARIO ---
  @Get('proyecto-usuario')
  @RequirePermission('proyectos:leer')
  @ApiOperation({ summary: 'Listar asignaciones de miembros a proyectos' })
  getProyectoUsuarios(
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ) {
    return this.relacionesService.findAllProyectoUsuarios(
      skip ? +skip : 0,
      limit ? +limit : 100,
    );
  }

  @Get('proyecto-usuario/:id')
  @RequirePermission('proyectos:leer')
  @ApiOperation({ summary: 'Obtener asignación de proyecto por ID' })
  getProyectoUsuarioById(@Param('id', ParseIntPipe) id: number) {
    return this.relacionesService.findOneProyectoUsuario(id);
  }

  @Post('proyecto-usuario')
  @RequirePermission('proyectos:actualizar')
  @ApiOperation({ summary: 'Asignar un usuario a un proyecto' })
  addUsuarioAProyecto(@Body() body: any) {
    return this.relacionesService.createProyectoUsuario(body);
  }

  @Delete('proyecto-usuario/:id')
  @RequirePermission('proyectos:actualizar')
  @ApiOperation({ summary: 'Remover usuario de un proyecto' })
  removeUsuarioDeProyecto(@Param('id', ParseIntPipe) id: number) {
    return this.relacionesService.removeProyectoUsuario(id);
  }

  // --- PRODUCTO AUTOR ---
  @Get('producto-autor')
  @RequirePermission('productos:leer')
  @ApiOperation({ summary: 'Listar autores de productos' })
  getProductoAutores(
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ) {
    return this.relacionesService.findAllProductoAutores(
      skip ? +skip : 0,
      limit ? +limit : 100,
    );
  }

  @Get('producto-autor/:id')
  @RequirePermission('productos:leer')
  @ApiOperation({ summary: 'Obtener autor de producto por ID' })
  getProductoAutorById(@Param('id', ParseIntPipe) id: number) {
    return this.relacionesService.findOneProductoAutor(id);
  }

  @Post('producto-autor')
  @RequirePermission('productos:actualizar')
  @ApiOperation({ summary: 'Asignar autor a un producto' })
  addAutorAProducto(@Body() body: any) {
    return this.relacionesService.createProductoAutor(body);
  }

  @Delete('producto-autor/:id')
  @RequirePermission('productos:actualizar')
  @ApiOperation({ summary: 'Remover autor de un producto' })
  removeAutorDeProducto(@Param('id', ParseIntPipe) id: number) {
    return this.relacionesService.removeProductoAutor(id);
  }
}
