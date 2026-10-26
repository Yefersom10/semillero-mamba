# =============================================================
# main.py - API del microservicio MAMBA AI (FastAPI)
# Expone el endpoint /api/chat que conecta el frontend con Claude
# =============================================================

import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import responder_consulta

# -------------------------------------------------------------
# Configuración general de la aplicación
# -------------------------------------------------------------
app = FastAPI(title="MAMBA AI Service")

# -------------------------------------------------------------
# Middleware CORS: permite que el frontend (Next.js) llame a esta API.
# Orígenes configurables con CORS_ORIGINS (separados por coma).
# Por defecto: frontend en desarrollo/Docker (:3001) y alternativo (:3000).
# -------------------------------------------------------------
allowed_origins = [
    o.strip().rstrip("/")
    for o in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# Modelos de datos (esquema de la petición y respuesta)
# -------------------------------------------------------------
class HistorialItem(BaseModel):
    """Una mensaje previo de la conversación ('user' o 'bot')."""
    sender: str
    text: str

class ChatPayload(BaseModel):
    """Cuerpo que envía el frontend al microservicio."""
    message: str                      # Mensaje actual del usuario
    user_role: str = "estudiante"     # Rol: estudiante | investigador | coordinador
    user_name: str = "Usuario"        # Nombre del usuario (para personalizar)
    history: list[HistorialItem] = [] # Historial previo de la conversación

# -------------------------------------------------------------
# Endpoint principal del chat
# -------------------------------------------------------------
@app.post("/api/chat")
async def chat_endpoint(payload: ChatPayload):
    # Validación: el mensaje no puede estar vacío
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío.")

    try:
        # Delega en agent.py: arma el prompt con contexto de la DB,
        # el historial y el rol, y llama a la API de Claude (Haiku)
        respuesta = responder_consulta(
            mensaje_usuario=payload.message,
            user_role=payload.user_role,
            user_name=payload.user_name,
            historial=[h.model_dump() for h in payload.history],
        )
        return {"reply": respuesta}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------------------
# Punto de entrada: uvicorn en el puerto 8001
# (el 8000 queda reservado para el backend mamba-api en Docker)
# -------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
