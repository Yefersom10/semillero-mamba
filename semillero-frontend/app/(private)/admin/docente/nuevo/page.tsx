'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { docentesService } from '@/services/docentesService';

export default function CrearDocentePage() {
    const router = useRouter();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await docentesService.create({ nombre, email, password });
            alert('Docente registrado correctamente.');
            router.push('/docente');
        } catch (err: any) {
            alert(err.message || 'Error al guardar docente.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="container container-small">
            <div className="card" style={{ padding: '1.5rem' }}>
                <h2>➕ Nuevo Docente</h2>
                <form onSubmit={handleSubmit} className="form" style={{ marginTop: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label>Nombre Completo</label>
                        <input
                            type="text"
                            required
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            style={{ width: '100%', height: '38px' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label>Correo Institucional</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', height: '38px' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Contraseña Acceso</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', height: '38px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn-secondary" onClick={() => router.push('/docentes')}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Guardando...' : '💾 Registrar'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}