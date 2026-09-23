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
} from '@nestjs/swagger';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@ApiTags('Proyectos')
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Get('publico')
  @ApiOperation({ summary: 'Listar proyectos públicos' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPublic(
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 100,
  ) {
    return this.proyectosService.findAll(+skip, +limit);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermission('proyectos:leer')
  @ApiOperation({ summary: 'Listar proyectos (autenticado)' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 100,
  ) {
    return this.proyectosService.findAll(+skip, +limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermission('proyectos:leer')
  @ApiOperation({ summary: 'Obtener proyecto por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('proyectos:crear')
  @ApiOperation({ summary: 'Crear proyecto' })
  create(
    @Body() createProyectoDto: CreateProyectoDto,
    @GetUser('id') userId: number,
  ) {
    return this.proyectosService.create(createProyectoDto, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermission('proyectos:actualizar')
  @ApiOperation({
    summary: 'Actualizar proyecto (solo admin o asociados al proyecto)',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProyectoDto: UpdateProyectoDto,
    @GetUser() user: Usuario,
  ) {
    return this.proyectosService.update(id, updateProyectoDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('proyectos:eliminar')
  @ApiOperation({
    summary: 'Eliminar proyecto (solo admin o asociados al proyecto)',
  })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: Usuario) {
    return this.proyectosService.remove(id, user);
  }
}
