# MAMBA AI Service

Microservicio de chat con IA para el **Semillero de Investigación MAMBA de CORHUILA**. Expone una API en FastAPI que recibe las preguntas del frontend, las enriquece con datos reales de la base de datos del semillero y genera respuestas con Claude (Anthropic).

## Descripción general

El servicio funciona como intermediario entre el frontend (Next.js) y la API de Claude. Para cada consulta:

1. Recibe el mensaje del usuario en `POST /api/chat` junto con su rol, nombre e historial de conversación.
2. Consulta la base de datos PostgreSQL del backend NestJS para obtener **contexto en tiempo real** (proyectos activos y tipos de producto de investigación).
3. Construye un *system prompt* con el contexto de la DB, el perfil del rol del usuario y las restricciones de temática del semillero.
4. Llama al modelo `claude-3-5-haiku-20241022` (`max_tokens: 600`, `temperature: 0.2`) y devuelve la respuesta en Markdown.

## Arquitectura

```
┌──────────────────────────────┐
│  Frontend (Next.js)          │
│  localhost:3000 / 3001       │
└──────────────┬───────────────┘
               │  POST /api/chat
               ▼
┌──────────────────────────────┐
│  FastAPI (main.py)           │
│  localhost:8001              │
│  - Validación de payload     │
│  - CORS                      │
└──────────────┬───────────────┘
               │  responder_consulta()
               ▼
┌──────────────────────────────┐       ┌──────────────────────────────┐
│  agent.py                    │──────►│  PostgreSQL (backend NestJS) │
│  - Contexto de la DB         │       │  - proyectos                 │
│  - Prompt por rol            │       │  - tipo_producto             │
│  - Historial de mensajes     │       └──────────────────────────────┘
└──────────────┬───────────────┘
               │  API de Anthropic
               ▼
┌──────────────────────────────┐
│  Claude Haiku                │
│  claude-3-5-haiku-20241022   │
└──────────────────────────────┘
```

## Requisitos previos

- Python 3.10 o superior
- Base de datos PostgreSQL accesible (la del backend NestJS)
- Clave de API de Anthropic (`ANTHROPIC_API_KEY`)

## Instalación

```bash
# 1. Crear entorno virtual
python -m venv venv

# 2. Activarlo
# Windows
venv\Scripts\activate
# Linux / macOS
source venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

| Variable            | Descripción                         | Valor por defecto |
| ------------------- | ----------------------------------- | ----------------- |
| `ANTHROPIC_API_KEY` | Clave de la API de Anthropic        | *(requerida)*     |
| `DB_NAME`           | Nombre de la base de datos          | `mamba_db`        |
| `DB_USER`           | Usuario de la base de datos         | `postgres`        |
| `DB_PASSWORD`       | Contraseña de la base de datos      | `postgres`        |
| `DB_HOST`           | Host de la base de datos            | `localhost`       |
| `DB_PORT`           | Puerto de la base de datos          | `5432`            |

Ejemplo de `.env`:

```env
ANTHROPIC_API_KEY=sk-ant-...

DB_NAME=mamba_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

## Ejecución

```bash
python main.py
```

El servicio inicia uvicorn en `http://localhost:8001` con recarga automática. También se puede iniciar directamente con:

```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

Documentación interactiva (Swagger): `http://localhost:8001/docs`

## Endpoints

### `POST /api/chat`

Recibe un mensaje del usuario y devuelve la respuesta del asistente.

**Cuerpo de la petición:**

| Campo       | Tipo    | Descripción                                            | Requerido |
| ----------- | ------- | ------------------------------------------------------ | --------- |
| `message`   | string  | Mensaje actual del usuario (no puede estar vacío)      | Sí        |
| `user_role` | string  | Rol: `estudiante` \| `investigador` \| `coordinador`   | No (defecto: `estudiante`) |
| `user_name` | string  | Nombre del usuario para personalizar la respuesta      | No (defecto: `Usuario`)   |
| `history`   | array   | Historial previo: `[{ "sender": "user"\|"bot", "text": "..." }]` | No (defecto: `[]`) |

**Ejemplo de petición (curl):**

```bash
curl -X POST http://localhost:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Qué proyectos tiene el semillero?",
    "user_role": "estudiante",
    "user_name": "Ana",
    "history": [
      { "sender": "bot", "text": "¡Hola! Soy el asistente del Semillero MAMBA." },
      { "sender": "user", "text": "Hola, quiero saber más" }
    ]
  }'
```

**Ejemplo de respuesta:**

```json
{
  "reply": "¡Hola Ana! El Semillero MAMBA desarrolla proyectos de investigación en...\n\n- **Proyecto 1:** descripción\n- **Proyecto 2:** descripción"
}
```

**Errores:**

| Código | Condición                                    |
| ------ | -------------------------------------------- |
| `400`  | El mensaje está vacío                        |
| `500`  | Error interno (DB o API de Anthropic)        |

## Roles de usuario

El rol cambia las instrucciones del *system prompt* y, por tanto, el tono y el nivel de detalle de las respuestas:

| Rol            | Comportamiento del asistente                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| `estudiante`   | Explicaciones sencillas, guiadas paso a paso; fomenta la participación en las actividades del semillero.          |
| `investigador` | Terminología técnica de investigación (I+D, productos científicos, publicaciones) y respuestas más detalladas.    |
| `coordinador`  | Incluye información administrativa y de gestión (aprobaciones, reportes, seguimiento de proyectos y productos).  |

Si el rol no se reconoce, se usa `estudiante` por defecto.

## Restricciones del asistente

El asistente está configurado para responder **únicamente** sobre temas del Semillero MAMBA:

- El semillero en sí (qué es, objetivos, integrantes, líneas de investigación)
- Proyectos de investigación del semillero
- Productos científicos (publicaciones, ponencias, artículos)
- Actividades del semillero (avances, entregas, reuniones)
- Uso del sistema (cómo registrar avances, consultar publicaciones, etc.)

Si la pregunta trata de otro tema (noticias, matemáticas, recetas, política, programación, etc.), el asistente lo rechaza amablemente y sugiere una pregunta relacionada con el semillero.

## CORS y puertos

| Servicio                    | Puerto       |
| --------------------------- | ------------ |
| Frontend en desarrollo      | `3001`       |
| Frontend en producción      | `3000`       |
| MAMBA AI Service            | `8001`       |

El middleware CORS de FastAPI permite por defecto los orígenes `http://localhost:3000` y `http://localhost:3001`; se pueden cambiar con la variable `CORS_ORIGINS` (separados por coma). Todos los métodos y encabezados están habilitados.

## Docker

Desde la raíz del repositorio (necesita `ANTHROPIC_API_KEY` en `.env`):

```bash
docker compose --profile chatbot up --build
```

El servicio queda en `http://localhost:8001` y usa la base de datos del contenedor `db`.

## Estructura del proyecto

```
mamba-ai-service/
├── main.py            # API FastAPI: endpoint /api/chat, modelos y CORS
├── agent.py           # Lógica del asistente: contexto DB, prompt por rol, llamada a Claude
├── requirements.txt   # Dependencias Python
├── .env               # Variables de entorno (no incluido en el repositorio)
└── README.md          # Este archivo
```
