import { PartialType } from '@nestjs/swagger';
import { CreateProyectoUsuarioDto } from './create-proyecto-usuario.dto';

export class UpdateProyectoUsuarioDto extends PartialType(
  CreateProyectoUsuarioDto,
) {}
