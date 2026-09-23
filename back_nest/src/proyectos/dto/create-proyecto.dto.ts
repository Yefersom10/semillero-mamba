import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProyectoDto {
  @ApiProperty({ example: 'Sistema de Monitoreo Agrícola' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiPropertyOptional({ example: 'Proyecto IoT para medición de cultivos' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 'https://ejemplo.com/imagen.png' })
  @IsOptional()
  @IsUrl()
  imagen_url?: string;

  @ApiPropertyOptional({ example: 'https://github.com/proyecto' })
  @IsOptional()
  @IsUrl()
  link_proyecto?: string;

  @ApiPropertyOptional({ example: 'activo' })
  @IsOptional()
  @IsString()
  estado?: string = 'activo';

  @ApiPropertyOptional({ example: '2026-01-15T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  fecha_inicio?: Date;

  @ApiPropertyOptional({ example: '2026-12-15T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  fecha_fin?: Date;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  creado_por?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}
