// Única fuente de verdad para las URLs de los servicios.
// Se definen en .env.local (o como build args en Docker).

/** Backend NestJS */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/** Microservicio del chatbot (FastAPI) */
export const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:8001';
