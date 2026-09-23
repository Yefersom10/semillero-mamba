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
                        │   Next.js (localhost:3000)   │
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

1. El **frontend** consumió la API REST de `back_nest` para la gestión de datos.
2. El **chatbot** envía las preguntas del usuario a `mamba-ai-service`, que consulta la base de datos del backend para enriquecer el prompt y genera la respuesta con Claude Haiku.

## Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior
- [Python](https://www.python.org/) 3.10 o superior
- [PostgreSQL](https://www.postgresql.org/)
- Clave de API de [Anthropic](https://www.anthropic.com/) (para el chatbot)

## Puesta en marcha

### 1. Backend (`back_nest`)

```bash
cd back_nest
npm install
cp .env.example .env   # configurar variables de entorno
npm run start:dev      # http://localhost:8000
```

### 2. Servicio de IA (`mamba-ai-service`)

```bash
cd mamba-ai-service
python -m venv venv
venv\Scripts\activate        # Windows — en Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env         # configurar ANTHROPIC_API_KEY y datos de la DB
uvicorn main:app --reload --port 8001
```

### 3. Frontend (`semillero-frontend`)

```bash
cd semillero-frontend
npm install
cp .env.example .env.local   # configurar NEXT_PUBLIC_API_URL
npm run dev                  # http://localhost:3000
```

## Estructura del repositorio

```
semillero-mamba/
├── README.md               ← este archivo
├── semillero-frontend/     ← interfaz web (Next.js)
├── back_nest/              ← API REST (NestJS)
└── mamba-ai-service/       ← chatbot con IA (FastAPI)
```

## Seguridad

- Los archivos `.env` y `.env.local` con credenciales **no están incluidos** en este repositorio; solo se comparten los `.env.example` como plantilla.
- Cada subcarpeta conserva su propio `.gitignore`.

## Licencia

Proyecto académico desarrollado como trabajo de grado — Semillero MAMBA, CORHUILA.
