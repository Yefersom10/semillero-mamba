import { PlainLiteralObject } from '@nestjs/common';
import { Transform, plainToInstance } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsOptional()
  APP_NAME: string = 'Semillero Mamba API';

  @IsString()
  @IsOptional()
  APP_VERSION: string = '1.0.0';

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  DEBUG: boolean = true;

  @IsString()
  DATABASE_URL: string | undefined;

  @IsString()
  SECRET_KEY: string | undefined;

  @IsString()
  @IsOptional()
  ALGORITHM: string = 'HS256';

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  ACCESS_TOKEN_EXPIRE_MINUTES: number = 60;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}