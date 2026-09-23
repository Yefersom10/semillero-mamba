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
import { CreateProductoAutorDto } from './dto/create-producto-autor.dto';
import { UpdateProductoAutorDto } from './dto/update-producto-autor.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Producto — Autores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('producto-autores')
export class ProductoAutoresController {
  constructor(private readonly relacionesService: RelacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar autores de productos' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 100,
  ) {
    return this.relacionesService.findAllProductoAutores(+skip, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener autor por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.relacionesService.findOneProductoAutor(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Asignar autor a producto' })
  create(@Body() createDto: CreateProductoAutorDto) {
    return this.relacionesService.createProductoAutor(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar autor de producto' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductoAutorDto,
  ) {
    return this.relacionesService.updateProductoAutor(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar autor de producto' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.relacionesService.removeProductoAutor(id);
  }
}
