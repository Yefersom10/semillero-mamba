import { Producto, Proyecto, User } from '@/types/api';

export interface ActivityItem {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string; // ISO, para ordenar
  fechaRelativa: string;
  tipo: 'producto' | 'proyecto' | 'usuario';
  badgeColor: string;
}

const COLORES: Record<ActivityItem['tipo'], string> = {
  producto: '#10b981',
  proyecto: '#f59e0b',
  usuario: '#004080',
};

// "Hace 2 h", "Ayer", "12/03/2026"...
export function formatoRelativo(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  if (Number.isNaN(fecha.getTime())) return '';

  const ahora = new Date();
  const diferenciaMs = ahora.getTime() - fecha.getTime();
  const minutos = Math.floor(diferenciaMs / 60000);

  if (minutos < 1) return 'Hace un momento';
  if (minutos < 60) return `Hace ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} h`;

  const dias = Math.floor(horas / 24);
  if (dias === 1) return 'Ayer';
  if (dias < 7) return `Hace ${dias} días`;

  return fecha.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Un registro con created_at ≈ updated_at → "Nuevo"; si se modificó después → "Actualizado"
function decidirEvento(
  tipo: ActivityItem['tipo'],
  id: number,
  titulo: string,
  creado: string | undefined,
  actualizado: string | undefined,
  prefijoCreado: string,
  prefijoActualizado: string
): ActivityItem | null {
  const fechaCreacion = creado ? new Date(creado) : null;
  const fechaActualizacion = actualizado ? new Date(actualizado) : fechaCreacion;
  if (!fechaActualizacion || Number.isNaN(fechaActualizacion.getTime())) return null;

  const esActualizacion =
    fechaCreacion !== null &&
    fechaActualizacion.getTime() - fechaCreacion.getTime() > 60000; // > 1 min

  const fechaISO = (esActualizacion ? fechaActualizacion : (fechaCreacion ?? fechaActualizacion)).toISOString();

  return {
    id: `${tipo}-${id}`,
    titulo: esActualizacion ? `${prefijoActualizado} ${titulo}` : `${prefijoCreado} ${titulo}`,
    descripcion: esActualizacion
      ? 'Se actualizó la información registrada en el sistema.'
      : 'Se registró una nueva entrada en el semillero.',
    fecha: fechaISO,
    fechaRelativa: formatoRelativo(fechaISO),
    tipo,
    badgeColor: COLORES[tipo],
  };
}

interface EntradaActividad {
  proyectos?: Proyecto[];
  productos?: Producto[];
  usuarios?: User[] | null;
  limite?: number;
}

// Fusiona proyectos, productos y (opcional) usuarios en un feed ordenado por fecha
export function construirActividad({
  proyectos = [],
  productos = [],
  usuarios = null,
  limite = 6,
}: EntradaActividad): ActivityItem[] {
  const eventos: ActivityItem[] = [];

  proyectos.forEach((p) => {
    const evento = decidirEvento(
      'proyecto',
      Number(p.id),
      `"${p.nombre}"`,
      p.created_at,
      p.updated_at,
      'Nuevo proyecto:',
      'Proyecto actualizado:'
    );
    if (evento) eventos.push(evento);
  });

  productos.forEach((prod) => {
    const evento = decidirEvento(
      'producto',
      Number(prod.id),
      `"${prod.titulo}"`,
      prod.created_at,
      prod.updated_at,
      'Nuevo producto registrado:',
      'Producto actualizado:'
    );
    if (evento) eventos.push(evento);
  });

  (usuarios || []).forEach((u) => {
    const evento = decidirEvento(
      'usuario',
      Number(u.id),
      u.nombre,
      u.created_at,
      u.created_at, // usuarios: solo nos interesa su registro
      'Nuevo usuario registrado:',
      'Usuario actualizado:'
    );
    if (evento) eventos.push(evento);
  });

  return eventos
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, limite);
}
