# Semillero MAMBA — Proyecto de Grado

Repositorio principal del **proyecto de grado** del Semillero de Investigación **MAMBA** de **CORHUILA**. Aquí se centralizan los tres componentes que conforman la plataforma:

| Componente | Tecnología | Descripción |
|---|---|---|
| [`semillero-frontend/`](./semillero-frontend) | Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 | Aplicación web: gestión de proyectos, productos científicos e integrantes, blog público y panel de administración. |
| [`back_nest/`](./back_nest) | NestJS · TypeScript · PostgreSQL | API REST principal: autenticación, usuarios, roles, grupos, proyectos y productos. |
| [`mamba-ai-service/`](./mamba-ai-service) | FastAPI · Python · Claude Haiku (Anthropic) | Microservicio del chatbot: responde consultas con contexto en tiempo real de la base de datos del semillero. |

## Arquitectura

```
                        ┌─────────────────────────────┐
                        │   semillero-frontend        │
                        │   Next.js (localhost:3001)   │
                        └──────────┬──────────────────┘
                 NEXT_PUBLIC_API_URL│        │ POST /api/chat
                    (:8000)         │        │ (:8001)
                        ┌──────────▼───┐  ┌─▼──────────────────┐
                        │  back_nest   │  │ mamba-ai-service   │
                        │  NestJS API  │◄─┤ FastAPI + Claude   │
                        │  :8000       │  │ Haiku              │
                        └──────┬───────┘  └────────────────────┘
                               │
                        ┌──────▼───────┐
                        │  PostgreSQL  │
                        └──────────────┘
```

1. El **frontend** consume la API REST de `back_nest` para la gestión de datos.
2. El **chatbot** envía las preguntas del usuario a `mamba-ai-service`, que consulta la base de datos del backend para enriquecer el prompt y genera la respuesta con Claude Haiku.

## Requisitos previos

- [Docker](https://www.docker.com/) (para la puesta en marcha con contenedor) **o** bien:
  - [Node.js](https://nodejs.org/) 20 o superior
  - [PostgreSQL](https://www.postgresql.org/)
- [Python](https://www.python.org/) 3.10 o superior (solo para el chatbot)
- Clave de API de [Anthropic](https://www.anthropic.com/) (para el chatbot)

## Puesta en marcha

### Opción A: Docker (frontend + backend + base de datos)

Desde la raíz del repositorio:

```bash
cp .env.example .env        # y completar SECRET_KEY y POSTGRES_PASSWORD
docker compose up --build
```

`SECRET_KEY` (mínimo 16 caracteres) y `POSTGRES_PASSWORD` son **obligatorias**: el backend no arranca con valores ausentes o por defecto. Para generar una clave:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Levanta dos contenedores: `mamba_app` (backend NestJS y frontend Next.js en la misma imagen, como usuario no root y con healthcheck) y `mamba_db` (PostgreSQL 15).

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3001 |
| Backend (API) | http://localhost:8000 |
| Swagger | http://localhost:8000/api/docs |
| PostgreSQL | 127.0.0.1:5432 (solo local; cambia el puerto con `DB_HOST_PORT`) |

Notas:

- Todas las variables disponibles están en [`.env.example`](./.env.example).
- `FRONTEND_URL` admite varios orígenes CORS separados por coma.
- `SEED_ENABLED=false` desactiva la creación de tablas y de los usuarios de demostración (usar en producción).
- `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_CHAT_URL` se incrustan al **compilar** el frontend: si las cambias, reconstruye con `docker compose up --build`.
- **Chatbot (opcional):** `docker compose --profile chatbot up --build` agrega el contenedor `mamba_chatbot` en `http://localhost:8001` (requiere `ANTHROPIC_API_KEY` en `.env`).
- Para detener todo: `docker compose down` (agrega `-v` para borrar también los datos de la base de datos).

### Opción B: ejecución local (sin Docker)

#### 1. Backend (`back_nest`)

```bash
cd back_nest
npm install
cp .env.example .env   # configurar variables (SECRET_KEY obligatoria)
npm run start:dev      # http://localhost:8000
npm test               # pruebas unitarias
npm run lint           # eslint (el CI lo exige sin errores)
```

#### 2. Servicio de IA (`mamba-ai-service`)

```bash
cd mamba-ai-service
python -m venv venv
venv\Scripts\activate        # Windows — en Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env         # configurar ANTHROPIC_API_KEY y datos de la DB
uvicorn main:app --reload --port 8001
```

#### 3. Frontend (`semillero-frontend`)

```bash
cd semillero-frontend
npm install
cp .env.example .env.local   # configurar NEXT_PUBLIC_API_URL
npm run dev                  # http://localhost:3001
```

## Estructura del repositorio

```
semillero-mamba/
├── README.md               ← este archivo
├── Dockerfile              ← imagen única: backend + frontend
├── docker-compose.yaml     ← app (backend + frontend) + PostgreSQL (+ chatbot con --profile chatbot)
├── .github/workflows/      ← CI: build, tests y Docker
├── docker-entrypoint.sh    ← arranca ambos procesos en el contenedor
├── semillero-frontend/     ← interfaz web (Next.js)
├── back_nest/              ← API REST (NestJS)
└── mamba-ai-service/       ← chatbot con IA (FastAPI)
```

## Seguridad

- Los archivos `.env` y `.env.local` con credenciales **no están incluidos** en este repositorio; solo se comparten los `.env.example` como plantilla.
- Cada subcarpeta conserva su propio `.gitignore`.

## Licencia

Proyecto académico desarrollado como trabajo de grado — Semillero MAMBA, CORHUILA.
