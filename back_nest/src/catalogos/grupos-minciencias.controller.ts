import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { CatalogosService } from './catalogos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';

@ApiTags('Grupos Minciencias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('grupos-minciencias')
export class GruposMincienciasController {
  constructor(private readonly catalogosService: CatalogosService) {}

  @Get()
  @RequirePermission('catalogos:leer')
  @ApiOperation({ summary: 'Listar grupos Minciencias paginados' })
  @ApiQuery({ name: 'skip', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 100 })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos obtenida correctamente',
  })
  findAll(
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 100,
  ) {
    return this.catalogosService.findAllGrupos(+skip, +limit);
  }

  @Get(':id')
  @RequirePermission('catalogos:leer')
  @ApiOperation({ summary: 'Obtener grupo Minciencias por ID' })
  @ApiResponse({ status: 200, description: 'Grupo encontrado' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catalogosService.findOneGrupo(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('catalogos:crear')
  @ApiOperation({ summary: 'Crear un nuevo grupo Minciencias' })
  @ApiResponse({ status: 201, description: 'Grupo creado exitosamente' })
  create(@Body() createGrupoDto: CreateGrupoDto) {
    return this.catalogosService.createGrupo(createGrupoDto);
  }

  @Patch(':id')
  @RequirePermission('catalogos:actualizar')
  @ApiOperation({ summary: 'Actualizar un grupo Minciencias' })
  @ApiResponse({ status: 200, description: 'Grupo actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGrupoDto: UpdateGrupoDto,
  ) {
    return this.catalogosService.updateGrupo(id, updateGrupoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('catalogos:eliminar')
  @ApiOperation({ summary: 'Eliminar o desactivar un grupo Minciencias' })
  @ApiResponse({ status: 204, description: 'Grupo eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catalogosService.removeGrupo(id);
  }
}
