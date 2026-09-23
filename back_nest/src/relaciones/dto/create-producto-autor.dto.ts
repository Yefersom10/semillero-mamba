import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoAutorDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  producto_id: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsNotEmpty()
  usuario_id: number;

  @ApiPropertyOptional({ example: 'Coautor' })
  @IsOptional()
  @IsString()
  rol_autor?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  es_autor_principal?: boolean = false;
}
