import { ConfigService } from '@nestjs/config';
import { getJwtSecret } from './jwt-secret';

const configCon = (secret?: string) =>
  ({ get: () => secret }) as unknown as ConfigService;

describe('getJwtSecret', () => {
  it('devuelve una clave válida', () => {
    const secret = 'a'.repeat(32);
    expect(getJwtSecret(configCon(secret))).toBe(secret);
  });

  it.each([undefined, '', 'corta', '123456789'])(
    'aborta con una clave ausente o débil (%p)',
    (secret) => {
      expect(() => getJwtSecret(configCon(secret))).toThrow(/SECRET_KEY/);
    },
  );
});
