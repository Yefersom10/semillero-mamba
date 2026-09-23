# =============================================================
# agent.py - Lógica del asistente del Semillero MAMBA
# Consulta la base de datos del backend (NestJS), construye el
# prompt según el rol del usuario y llama a Claude (Haiku)
# =============================================================

import os
import psycopg2
from anthropic import Anthropic
from dotenv import load_dotenv

# -------------------------------------------------------------
# Configuración: carga variables del .env y crea el cliente de Anthropic
# -------------------------------------------------------------
load_dotenv()

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# -------------------------------------------------------------
# Contexto en tiempo real: consulta la base de datos del backend
# para que las respuestas se basen en datos reales del semillero
# -------------------------------------------------------------
def obtener_contexto_db() -> str:
    """Consulta la base de datos de NestJS para estructurar el contexto actual."""
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME", "mamba_db"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "postgres"),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432")
        )
        cursor = conn.cursor()

        # Consultar proyectos activos
        # (el esquema de TypeORM usa nombres en PLURAL: proyectos, tipos_producto)
        cursor.execute("SELECT nombre, descripcion FROM proyectos LIMIT 10;")
        proyectos = cursor.fetchall()

        # Consultar catálogo / líneas
        cursor.execute("SELECT nombre FROM tipos_producto LIMIT 10;")
        tipos_producto = cursor.fetchall()

        cursor.close()
        conn.close()

        contexto = "PROYECTOS ACTUALES:\n"
        for p in proyectos:
            contexto += f"- {p[0]}: {p[1]}\n"

        contexto += "\nTIPOS DE PRODUCTOS DE INVESTIGACIÓN:\n"
        for t in tipos_producto:
            contexto += f"- {t[0]}\n"

        return contexto

    except Exception as e:
        print(f"Error consultando DB: {e}")
        return "Información general del Semillero MAMBA (CORHUILA)."

# -------------------------------------------------------------
# Perfil de rol: adapta las instrucciones según quién pregunta
# -------------------------------------------------------------
def obtener_prompt_rol(user_role: str, user_name: str) -> str:
    """Devuelve las instrucciones específicas para el rol del usuario."""
    perfiles = {
        "estudiante": (
            f"El usuario {user_name} es ESTUDIANTE del semillero. "
            "Explica de forma sencilla y guiada paso a paso, "
            "fomentando su participación en las actividades del semillero."
        ),
        "investigador": (
            f"El usuario {user_name} es INVESTIGADOR del semillero. "
            "Puedes usar terminología técnica de investigación (I+D, productos científicos, "
            "publicaciones) y dar respuestas más detalladas."
        ),
        "coordinador": (
            f"El usuario {user_name} es COORDINADOR del semillero. "
            "Incluye información administrativa y de gestión "
            "(aprobaciones, reportes, seguimiento de proyectos y productos)."
        ),
    }
    return perfiles.get(user_role, perfiles["estudiante"])

# -------------------------------------------------------------
# Historial: convierte los mensajes previos al formato de la API
# de Claude (alternando roles user/assistant)
# -------------------------------------------------------------
def construir_mensajes(historial: list, mensaje_usuario: str) -> list:
    """
    Convierte el historial del frontend ([{sender, text}]) a la lista
    de mensajes que exige la API de Claude, y agrega el mensaje actual.
    """
    mensajes = []
    for item in historial:
        # 'user' -> rol user | 'bot' -> rol assistant
        rol = "user" if item.get("sender") == "user" else "assistant"
        texto = (item.get("text") or "").strip()
        if not texto:
            continue

        # La API exige que no haya dos mensajes consecutivos del mismo rol
        if mensajes and mensajes[-1]["role"] == rol:
            mensajes[-1]["content"] += f"\n{texto}"
        else:
            mensajes.append({"role": rol, "content": texto})

    # La conversación debe iniciar con un mensaje de tipo 'user':
    # se descarta el saludo inicial del bot si está al principio
    if mensajes and mensajes[0]["role"] == "assistant":
        mensajes.pop(0)

    # Agrega el mensaje actual del usuario
    if mensajes and mensajes[-1]["role"] == "user":
        mensajes[-1]["content"] += f"\n{mensaje_usuario}"
    else:
        mensajes.append({"role": "user", "content": mensaje_usuario})

    return mensajes

# -------------------------------------------------------------
# Función principal: genera la respuesta con Claude
# -------------------------------------------------------------
def responder_consulta(
    mensaje_usuario: str,
    user_role: str = "estudiante",
    user_name: str = "Usuario",
    historial: list = None,
) -> str:
    # 1. Datos reales del semillero consultados a la base de datos
    contexto_dinamico = obtener_contexto_db()

    # 2. Instrucciones del rol (estudiante / investigador / coordinador)
    contexto_rol = obtener_prompt_rol(user_role, user_name)

    # 3. System prompt: RESTRINGIDO solo al Semillero MAMBA
    system_prompt = f"""
    Eres el asistente virtual del Semillero de Investigación MAMBA de CORHUILA.

    --- RESTRICCIÓN DE TEMÁTICA (OBLIGATORIO) ---
    SOLO respondes preguntas relacionadas con:
    - El Semillero MAMBA de CORHUILA (qué es, objetivos, integrantes, líneas de investigación)
    - Proyectos de investigación del semillero
    - Productos científicos (publicaciones, ponencias, artículos, tipos de producto)
    - Actividades del semillero (avances, entregas, reuniones)
    - Uso del sistema (cómo registrar avances, cómo consultar publicaciones, etc.)

    Si te preguntan de OTRO tema (noticias, matemáticas, recetas, política, programación,
    etc.), NO respondas la pregunta. Responde amablemente que solo puedes ayudar con
    temas del Semillero MAMBA y sugiere una pregunta relacionada con el semillero.
    ---------------------------------------------

    --- PERFIL DEL USUARIO ---
    {contexto_rol}
    --------------------------

    --- CONTEXTO EN TIEMPO REAL DE LA BASE DE DATOS ---
    {contexto_dinamico}
    --------------------------------------------------

    Mantén respuestas concisas, amigables y formateadas en Markdown.
    Si no tienes información sobre un tema del semillero, dilo honestamente.
    """

    # 4. Historial de la conversación (si el frontend lo envió)
    mensajes = construir_mensajes(historial or [], mensaje_usuario)

    # 5. Llamado a la API de Claude (modelo Haiku)
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=600,
        system=system_prompt,
        messages=mensajes,
    )

    return response.content[0].text
