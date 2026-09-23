import { PartialType } from '@nestjs/mapped-types';
import { CreateRelacioneDto } from './create-relacione.dto';

export class UpdateRelacioneDto extends PartialType(CreateRelacioneDto) {}
