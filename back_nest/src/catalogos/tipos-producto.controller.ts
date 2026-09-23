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
import { CatalogosService } from './catalogos.service';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Tipos de Producto')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tipos-producto')
export class TiposProductoController {
  constructor(private readonly catalogosService: CatalogosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tipos de producto' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 100,
  ) {
    return this.catalogosService.findAllTiposProducto();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tipo de producto por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catalogosService.findOneTipoProducto(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear tipo de producto' })
  create(@Body() createTipoProductoDto: CreateTipoProductoDto) {
    return this.catalogosService.createTipo(createTipoProductoDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tipo de producto' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipoProductoDto: UpdateTipoProductoDto,
  ) {
    return this.catalogosService.updateTipo(id, updateTipoProductoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar tipo de producto' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catalogosService.removeTipo(id);
  }
}
