'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 1. Importar el servicio de autenticación desde el cliente centralizado de Axios
import { authService } from '@/services/backend.service';
import { useAuth } from '@/AuthContext/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (val: string): string => {
    if (!val.trim()) return 'El correo es obligatorio.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Ingresa un formato de correo electrónico válido.';

    const emailLower = val.toLowerCase();

    // Acepta dominios de @corhuila.edu.co, @mamba.com o @manba.com
    const isDomainValid =
      emailLower.endsWith('@corhuila.edu.co') ||
      emailLower.endsWith('@mamba.com') ||
      emailLower.endsWith('@manba.com');

    if (!isDomainValid) {
      return 'Debes ingresar un correo permitido (@corhuila.edu.co, @mamba.com o @manba.com).';
    }

    return '';
  };

  const validatePassword = (val: string): string => {
    if (!val) return 'La contraseña es obligatoria.';
    if (val.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    const eError = validateEmail(email);
    const pError = validatePassword(password);

    setEmailError(eError);
    setPasswordError(pError);

    if (eError || pError) return;

    setLoading(true);

    // Guarda el usuario en localStorage Y sincroniza el AuthContext,
    // para que los guards (ej: /admin) lo vean sin necesidad de recargar
    const persistUser = (u: any) => {
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
    };

    try {
      const response = await authService.login({ email, password });

      // 1. Extraer JWT Token de la respuesta
      const token =
        response.access_token ||
        response.token ||
        response.data?.access_token ||
        response.data?.token;

      if (token) {
        // Guardar token
        localStorage.setItem('token', token);

        // 2. Comprobar si el backend envió el objeto 'user'
        const rawUser =
          response.user ||
          response.usuario ||
          response.data?.user ||
          response.data?.usuario;

        if (rawUser) {
          persistUser(rawUser);
        } else if (response.id && response.nombre) {
          const { access_token, token: t, data, ...userClean } = response;
          persistUser(userClean);
        } else {
          // 3. OPCIÓN B: Decodificar el payload del token JWT si no vino objeto 'user'
          try {
            const payloadBase64 = token.split('.')[1];
            const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const decoded = JSON.parse(jsonPayload);

            // Construir el objeto user a partir de las propiedades del JWT
            const userFromToken = {
              id: decoded.sub || decoded.id || 1,
              email: decoded.email || email,
              nombre: decoded.nombre || decoded.name || email.split('@')[0],
              rol: decoded.rol || decoded.role || 'Usuario',
              rol_id: decoded.rol_id || decoded.role_id,
            };

            persistUser(userFromToken);
          } catch (decodeErr) {
            console.error('Error al decodificar el JWT:', decodeErr);
            // Fallback mínimo de emergencia
            persistUser({
              email,
              nombre: email.split('@')[0],
              rol: 'Usuario',
            });
          }
        }

        // Redirigir exitosamente al dashboard
        router.push('/dashboard');
      } else {
        setErrorMsg('El servidor no devolvió un token de acceso válido.');
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Credenciales inválidas o error de conexión con el servidor.';
      setErrorMsg(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/Imagenes/Imagen-fondo.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', padding: '40px 30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/">
            <Image src="/Logo/Logo.png" alt="Logo Mamba" width={100} height={100} style={{ margin: '0 auto 12px auto', objectFit: 'contain' }} priority />
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 6px 0' }}>Semillero Mamba</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Ingresa tus credenciales para acceder a la plataforma</p>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '20px', textAlign: 'center' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '18px' }}>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Correo Institucional
            </label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@corhuila.edu.co"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(validateEmail(e.target.value));
              }}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: emailError ? '1px solid #dc2626' : '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
            {emailError && <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{emailError}</span>}
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(validatePassword(e.target.value));
              }}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: passwordError ? '1px solid #dc2626' : '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
            {passwordError && <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{passwordError}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#6ee7b7' : '#1a7c5e', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s ease' }}
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/" style={{ fontSize: '0.875rem', color: '#1a7c5e', textDecoration: 'none', fontWeight: '500' }}>
            ← Volver a la página principal
          </Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/register" style={{ fontSize: '0.875rem', color: '#1a7c5e', textDecoration: 'none', fontWeight: '500' }}>
            ¿No tienes cuenta? Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}