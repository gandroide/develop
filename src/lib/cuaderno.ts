import { getDB } from './db';
import type { NotaCuaderno, Proyecto, TipoNota } from '../types';

export interface CrearNotaInput {
  texto: string;
  proyecto?: Proyecto;
  tipo?: TipoNota;
}

const nuevoId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `n-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const crearNota = async (input: CrearNotaInput): Promise<NotaCuaderno> => {
  const nota: NotaCuaderno = {
    id: nuevoId(),
    creadaEn: new Date().toISOString(),
    texto: input.texto,
    proyecto: input.proyecto,
    tipo: input.tipo,
  };
  const db = await getDB();
  await db.put('cuaderno', nota);
  return nota;
};

export const actualizarNota = async (nota: NotaCuaderno): Promise<void> => {
  const db = await getDB();
  await db.put('cuaderno', nota);
};

export const borrarNota = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('cuaderno', id);
};

export const todasLasNotas = async (): Promise<NotaCuaderno[]> => {
  const db = await getDB();
  return db.getAll('cuaderno');
};
