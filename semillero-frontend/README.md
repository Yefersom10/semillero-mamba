# MAMBA Frontend 🐍

Aplicación web del **Semillero de Investigación MAMBA (CORHUILA)** para la gestión de proyectos, productos científicos e integrantes. Proyecto de grado.

## 🧩 Arquitectura

```
semillero-frontend (Next.js)  ──▶  Backend NestJS (NEXT_PUBLIC_API_URL → :8000)
        │
        └──▶ mamba-ai-service (FastAPI + Claude Haiku)  [chatbot → :8001]
```

- **Frontend** (este repositorio): interfaz de usuario.
- **Backend NestJS**: API REST principal (auth, proyectos, productos, usuarios).
- **mamba-ai-service**: microservicio Python que responde el chatbot con Claude Haiku y contexto en tiempo real de la base de datos.

## 🛠 Tecnologías

- [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Axios](https://axios-http.com/) (peticiones HTTP) · [react-hot-toast](https://react-hot-toast.com/) (notificaciones)

## 📁 Estructura del proyecto

| Carpeta | Descripción |
|---|---|
| `app/` | Rutas (App Router): inicio, login, registro, blog público |
| `app/(private)/` | Zona protegida: `dashboard`, `perfil`, `proyectos`, `productos` |
| `app/(private)/admin/` | Panel de administración: usuarios, grupos, roles, docentes, tipos |
| `AuthContext/` | Contexto de autenticación (sesión del usuario) |
| `services/` | Clientes API (`api.ts`, `authService.ts`, `adminService.ts`, `chatService.ts`, ...) |
| `components/` | Componentes reutilizables (incluye `Chatbot.tsx`) |
| `types/` | Tipos compartidos de TypeScript |
| `lib/`, `utils/` | Utilidades y helpers |
| `public/` | Assets estáticos |

## ⚙️ Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior
- [Docker](https://www.docker.com/) para levantar backend + base de datos (o todo el stack, ver README de la raíz) — o el backend corriendo local con `npm run start:dev`
- *Opcional:* microservicio [`mamba-ai-service`](../mamba-ai-service) para el chatbot (`http://localhost:8001`)

## 🚀 Puesta en marcha

```bash
# 1. Backend (Docker): base de datos + API en el puerto 8000
#    (desde la raíz del repo; también levanta este frontend en :3001)
cd .. && docker compose up -d --build

# 2. Microservicio del chatbot (opcional, puerto 8001)
cd ../mamba-ai-service
venv\Scripts\activate && python main.py

# 3. Frontend
npm install
npm run dev                  # http://localhost:3001
```

> ⚠️ El servidor de desarrollo corre en el **puerto 3001** (no 3000).

### Variables de entorno (`.env.local`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL del backend NestJS | `http://localhost:8000` |
| `NEXT_PUBLIC_CHAT_URL` | URL del microservicio del chatbot | `http://localhost:8001` |

## 💬 Chatbot (MAMBA Bot)

- Componente: `components/Chatbot.tsx` → servicio `services/chatService.ts`
- Consume `POST /api/chat` del microservicio `mamba-ai-service` (FastAPI + Claude Haiku)
- Envía el **rol**, el **nombre** del usuario y el **historial** de la conversación
- Responde **solo sobre temas del semillero** (proyectos, productos, actividades, uso del sistema)
- Muestra indicador de carga y mensaje de fallback si el servicio no está disponible

Para activarlo, levanta el microservicio en una terminal aparte:

```bash
cd ../mamba-ai-service
pip install -r requirements.txt
python main.py               # http://localhost:8001
```

## 📦 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (puerto 3001) |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build de producción |
| `npm run lint` | Lint con ESLint |

## 🔐 Roles

`estudiante` · `investigador` · `coordinador`

Determinan los permisos en el panel privado y personalizan las respuestas del chatbot.

## 🚀 Despliegue

Para producción se recomienda [Vercel](https://vercel.com/new). Configura las variables de entorno (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CHAT_URL`) en el dashboard de Vercel.
