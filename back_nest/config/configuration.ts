import { registerAs } from '@nestjs/config';

const accessTokenExpireMinutes = Number.parseInt(
  process.env.ACCESS_TOKEN_EXPIRE_MINUTES ?? '60',
  10,
);

export default registerAs('config', () => ({
  appName: process.env.APP_NAME || 'Semillero Mamba API',
  appVersion: process.env.APP_VERSION || '1.0.0',
  debug: process.env.DEBUG === 'true',
  databaseUrl: process.env.DATABASE_URL,
  secretKey: process.env.SECRET_KEY,
  algorithm: process.env.ALGORITHM || 'HS256',
  accessTokenExpireMinutes,
}));