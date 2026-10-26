import { ConfigService } from '@nestjs/config';

const MIN_SECRET_LENGTH = 16;
const INSECURE_SECRETS = ['123456789', 'secret', 'changeme'];

/** Devuelve SECRET_KEY o aborta el arranque si falta o es débil. */
export function getJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('SECRET_KEY');

  if (
    !secret ||
    secret.length < MIN_SECRET_LENGTH ||
    INSECURE_SECRETS.includes(secret)
  ) {
    throw new Error(
      `SECRET_KEY es obligatoria y debe tener al menos ${MIN_SECRET_LENGTH} caracteres (no se admiten valores por defecto). ` +
        'Genera una con: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
    );
  }

  return secret;
}
