# Backend — Semillero MAMBA (NestJS)

API REST del semillero: autenticación con JWT, usuarios, roles y permisos, grupos Minciencias, tipos de producto, proyectos y productos científicos. Usa **NestJS 11**, **TypeORM** y **PostgreSQL**.

## Puesta en marcha

### Con Docker (recomendado)

Desde la **raíz del repositorio** (levanta backend, frontend y PostgreSQL):

```bash
cp .env.example .env     # completar SECRET_KEY y POSTGRES_PASSWORD
docker compose up --build
```

Ver el [README principal](../README.md) para URLs y opciones.

### Local

Requiere Node.js 20+ y un PostgreSQL accesible.

```bash
cd back_nest
npm install
cp .env.example .env     # completar SECRET_KEY y DATABASE_URL
npm run start:dev        # http://localhost:8000
```

Documentación interactiva (Swagger): `http://localhost:8000/api/docs`

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `SECRET_KEY` | Sí | Clave para firmar los JWT. Mínimo 16 caracteres; el backend **no arranca** si falta o es un valor débil. |
| `DATABASE_URL` | Sí | Cadena de conexión, p. ej. `postgresql://usuario:clave@localhost:5432/semillero_mamba`. |
| `APP_PORT` | No | Puerto de la API (por defecto `3000`; en Docker y en `.env.example` es `8000`). |
| `FRONTEND_URL` | No | Orígenes permitidos por CORS, separados por coma. Por defecto `http://localhost:3001,http://127.0.0.1:3001`. |
| `DEBUG` | No | `true` activa `synchronize` de TypeORM (crea/actualiza tablas automáticamente). |
| `SEED_ENABLED` | No | `false` desactiva la creación de tablas y de los datos de demostración al arrancar. Usar en producción. |

Para generar una clave segura:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Datos de demostración (seed)

Al arrancar, si la base de datos está vacía, se crean roles (Administrador, Profesor, Estudiante, Usuario), permisos, grupos, tipos de producto, un proyecto y un producto de ejemplo, y cuatro usuarios de prueba (`julian@mamba.com`, `jose@mamba.com`, `maria@mamba.com`, `carlos@mamba.com`) con la contraseña `123456`. Si ya existen roles, no hace nada.

> ⚠️ En producción define `SEED_ENABLED=false`: los usuarios de demostración tienen una contraseña conocida.

## Autenticación y permisos

- `POST /auth/login` devuelve un `access_token` (JWT, válido 8 h) que se envía como `Authorization: Bearer <token>`.
- `POST /auth/registro` crea usuarios con el rol por defecto (ID 4, «Usuario»).
- Los endpoints protegidos usan `JwtAuthGuard` y `PermissionsGuard`; los permisos se declaran con `@RequirePermission('modulo:accion')` (p. ej. `proyectos:actualizar`). El rol Administrador tiene acceso total.

## Estructura

```
src/
├── auth/         # login, registro, estrategia JWT
├── usuarios/     # usuarios
├── roles/        # roles y permisos
├── catalogos/    # grupos Minciencias y tipos de producto
├── proyectos/    # proyectos
├── productos/    # productos científicos
├── relaciones/   # proyecto-usuario y producto-autor
├── common/       # guards, decoradores, servicio base y validación de SECRET_KEY
└── database/     # seed
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Desarrollo con recarga |
| `npm run build` | Compila a `dist/` |
| `npm run start:prod` | Ejecuta el build |
| `npm test` | Pruebas unitarias (Jest) |
| `npm run test:e2e` | Pruebas e2e |
| `npm run lint` | ESLint (con `--fix`); el CI exige 0 errores |

## Pruebas

Las pruebas unitarias cubren login y registro (`auth.service.spec.ts`), la validación de `SECRET_KEY`, las reglas de pertenencia de proyectos y el controlador de relaciones.
