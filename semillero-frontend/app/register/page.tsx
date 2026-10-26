'use client';

import type { ApiError } from '@/lib/errors';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

interface AuthMessage {
  text: string;
  type: 'info' | 'success' | 'error';
}

export default function RegisterPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<AuthMessage | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmar) {
      setMensaje({
        text: '❌ Las contraseñas no coinciden.',
        type: 'error',
      });
      return;
    }

    if (!email.toLowerCase().endsWith('@corhuila.edu.co')) {
      setMensaje({
        text: '❌ El correo institucional debe terminar en @corhuila.edu.co',
        type: 'error',
      });
      return;
    }

    const datosRegistro = {
      nombre: nombre.trim(),
      email: email.trim(),
      password,
      rol_id: 4, // Rol predeterminado para estudiantes/nuevos usuarios
    };

    setLoading(true);
    setMensaje({ text: '⏳ Procesando registro...', type: 'info' });

    try {
      await authService.register(datosRegistro);

      setMensaje({
        text: '✅ ¡Registro exitoso! Redirigiendo al inicio de sesión...',
        type: 'success',
      });

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (errorRaw) {
      const error = errorRaw as ApiError;
      console.error('Error al registrar usuario:', error);
      
      const errorResponse = error.response?.data;
      let mensajeError = 'Error al registrar la cuenta.';

      if (errorResponse) {
        if (Array.isArray(errorResponse.message)) {
          mensajeError = errorResponse.message.join(', ');
        } else if (typeof errorResponse.message === 'string') {
          mensajeError = errorResponse.message;
        } else if (errorResponse.detail) {
          mensajeError = typeof errorResponse.detail === 'string' 
            ? errorResponse.detail 
            : 'Error en la validación de los datos.';
        }
      }

      setMensaje({
        text: `❌ ${mensajeError}`,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-wrapper"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/Imagenes/Imagen-fondo.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '20px',
      }}
    >
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo-wrapper">
            <Image
              src="/Logo/Logo.png"
              alt="Semillero Mamba"
              className="auth-logo-img"
              width={95}
              height={95}
              priority
            />
          </div>

          <Link
            href="/"
            className="btn-back"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#666',
              fontSize: '14px',
              marginBottom: '20px',
              fontWeight: 500,
            }}
          >
            ⬅️ Volver al Inicio
          </Link>

          <h1>Semillero Mamba</h1>
          <p>Crear nueva cuenta</p>
        </div>

        <form id="registroForm" className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              required
              placeholder="Tu nombre completo"
              autoComplete="name"
              autoFocus
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              required
              placeholder="correo@corhuila.edu.co"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              required
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <small className="form-helper">
              La contraseña debe tener al menos 8 caracteres
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmar">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmar"
              required
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />
          </div>

          {mensaje && (
            <div
              id="msg-form"
              className={`auth-message auth-message-${mensaje.type}`}
              style={{ display: 'block' }}
            >
              {mensaje.text}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary btn-auth"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <Link href="/login" className="auth-link">
            ¿Ya tienes cuenta? Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}