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
import { RelacionesService } from './relaciones.service';
import { CreateProyectoUsuarioDto } from './dto/create-proyecto-usuario.dto';
import { UpdateProyectoUsuarioDto } from './dto/update-proyecto-usuario.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Proyecto — Miembros')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('proyecto-usuarios')
export class ProyectoUsuariosController {
  constructor(private readonly relacionesService: RelacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar miembros de proyectos' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 100,
  ) {
    return this.relacionesService.findAllProyectoUsuarios(+skip, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener membresía por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.relacionesService.findOneProyectoUsuario(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Asignar miembro a proyecto' })
  create(@Body() createDto: CreateProyectoUsuarioDto) {
    return this.relacionesService.createProyectoUsuario(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar membresía de proyecto' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProyectoUsuarioDto,
  ) {
    return this.relacionesService.updateProyectoUsuario(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar membresía' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.relacionesService.removeProyectoUsuario(id);
  }
}
