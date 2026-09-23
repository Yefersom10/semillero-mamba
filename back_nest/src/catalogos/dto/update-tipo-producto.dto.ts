import { PartialType } from '@nestjs/swagger';
import { CreateTipoProductoDto } from './create-tipo-producto.dto';

export class UpdateTipoProductoDto extends PartialType(CreateTipoProductoDto) {}
