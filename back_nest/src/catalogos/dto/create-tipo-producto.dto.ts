import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTipoProductoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  grupo_id!: number;

  @ApiProperty({ example: 'Artículo Científico' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiPropertyOptional({ example: 'Artículo publicado en revista indexada' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}
