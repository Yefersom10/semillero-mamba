import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProyectoUsuarioDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  proyecto_id: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  usuario_id: number;

  @ApiPropertyOptional({ example: 'Líder Técnico' })
  @IsOptional()
  @IsString()
  rol_en_proyecto?: string;

  @ApiPropertyOptional({ example: '2026-02-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  fecha_ingreso?: Date;

  @ApiPropertyOptional({ example: '2026-11-30T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  fecha_salida?: Date;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}
