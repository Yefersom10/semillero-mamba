import { PartialType } from '@nestjs/swagger';
import { CreateRolDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRolDto) {}
