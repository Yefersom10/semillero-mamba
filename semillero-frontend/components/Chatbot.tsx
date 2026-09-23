'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { createPortal } from 'react-dom';
// Servicio HTTP que conecta con el microservicio mamba-ai-service (FastAPI)
import { sendChatMessage, ChatHistoryItem } from '@/services/chatService';
// Renderizado de Markdown en las respuestas del bot (títulos, listas, negritas, tablas...)
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type UserRole = 'estudiante' | 'investigador' | 'coordinador';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface ChatbotProps {
  userRole?: UserRole;
  userName?: string;
}

const ROLE_PROMPTS: Record<UserRole, string[]> = {
  estudiante: [
    '¿Cómo registro un nuevo avance?',
    '¿Dónde veo las publicaciones?'
  ],
  investigador: [
    '¿Cómo agrego un producto científico?',
    '¿Estado de revisión de mis proyectos?'
  ],
  coordinador: [
    '¿Cómo apruebo o rechazo un producto?',
    'Generar reporte de actividades'
  ]
};

export default function Chatbot({ 
  userRole = 'estudiante', 
  userName = 'Usuario' 
}: ChatbotProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  // Estado de carga: true mientras Claude genera la respuesta
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: `¡Hola ${userName}! Soy el asistente virtual de MAMBA. Modo: ${userRole.toUpperCase()}.`,
      timestamp: new Date()
    }
  ]);

  // Asegura que el portal solo se ejecute en el cliente (evita errores de SSR en Next.js)
  useEffect(() => {
    setMounted(true);
  }, []);

  // ---------------------------------------------------------
  // Envío de mensajes: llama al microservicio mamba-ai-service
  // (FastAPI + Claude Haiku) en lugar de respuestas simuladas
  // ---------------------------------------------------------
  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    // 1. Agrega el mensaje del usuario a la conversación
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    // Historial previo que se envía al backend para que Claude tenga contexto
    const history: ChatHistoryItem[] = messages.map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 2. Llamado real al microservicio (POST /api/chat)
      const { data } = await sendChatMessage(query, userRole, userName, history);

      // 3. Agrega la respuesta del asistente
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      // 4. Error de conexión: el microservicio está apagado o falló
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: '⚠️ No pude contactar al asistente. Verifica que el servicio (mamba-ai-service) esté activo e intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend();
  };

  if (!mounted) return null;

  const chatbotContent = (
    <div className="chatbot-wrapper">
      {/* Ventana Rectangular Sobrepuesta */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <h3>MAMBA Bot 🐍</h3>
              <small>Rol: {userRole}</small>
            </div>
            <button 
              type="button" 
              className="btn-action btn-delete" 
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-msg ${
                  msg.sender === 'user' ? 'msg-user' : 'msg-bot'
                }`}
              >
                {msg.sender === 'bot' ? (
                  <div className="chatbot-md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {/* Indicador de "escribiendo..." mientras Claude responde */}
            {loading && (
              <div className="chatbot-msg msg-bot">MAMBA Bot está escribiendo…</div>
            )}
          </div>

          <div className="chatbot-suggestions">
            {ROLE_PROMPTS[userRole]?.map((prompt, i) => (
              <button
                key={i}
                type="button"
                className="btn-action"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="chatbot-input-area">
            <input
              type="text"
              className="search-input"
              placeholder={loading ? 'Esperando respuesta…' : 'Escribe tu consulta...'}
              value={input}
              disabled={loading}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              Enviar
            </button>
          </form>
        </div>
      )}

      {/* Botón Flotante */}
      <button
        type="button"
        className="whatsapp-button chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir Asistente"
      >
        💬
      </button>
    </div>
  );

  // Renderiza el componente al final del document.body para evitar conflictos de apilamiento CSS
  return createPortal(chatbotContent, document.body);
}