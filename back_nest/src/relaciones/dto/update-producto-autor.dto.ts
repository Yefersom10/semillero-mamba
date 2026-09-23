import { PartialType } from '@nestjs/swagger';
import { CreateProductoAutorDto } from './create-producto-autor.dto';

export class UpdateProductoAutorDto extends PartialType(
  CreateProductoAutorDto,
) {}
