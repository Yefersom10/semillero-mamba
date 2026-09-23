// =============================================================
// chatService.ts - Cliente HTTP del microservicio MAMBA AI
// Conecta el frontend con la API FastAPI (main.py) en /api/chat
// =============================================================

import axios from 'axios';

// URL base del microservicio (definida en .env.local)
const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:8000';

// Instancia de axios dedicada al chatbot
// (timeout de 40s porque Claude puede tardar en responder)
export const chatApi = axios.create({
  baseURL: CHAT_URL,
  timeout: 40000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Tipos de datos ---

/** Mensaje previo de la conversación que se envía como historial */
export interface ChatHistoryItem {
  sender: 'user' | 'bot';
  text: string;
}

/** Cuerpo de la petición POST /api/chat */
export interface ChatRequest {
  message: string;
  userRole: string;
  userName: string;
  history: ChatHistoryItem[];
}

/** Respuesta del microservicio */
export interface ChatResponse {
  reply: string;
}

// --- Llamado al endpoint del chat ---

export const sendChatMessage = (
  message: string,
  userRole: string,
  userName: string,
  history: ChatHistoryItem[]
) =>
  chatApi.post<ChatResponse>('/api/chat', {
    message,
    user_role: userRole,
    user_name: userName,
    history,
  });
