import { getDB } from './db';
import type { Entrada, Proyecto } from '../types';

export interface GuardarEntradaInput {
  fecha: string;
  rolloId: string;
  ejercicioId: string;
  nota: string;
  proyecto?: Proyecto;
}

export const guardarEntrada = async (input: GuardarEntradaInput): Promise<Entrada> => {
  const db = await getDB();
  const entrada: Entrada = {
    fecha: input.fecha,
    rolloId: input.rolloId,
    ejercicioId: input.ejercicioId,
    nota: input.nota,
    proyecto: input.proyecto,
    creadoEn: new Date().toISOString(),
  };
  await db.put('entradas', entrada);
  return entrada;
};

export const borrarEntrada = async (rolloId: string, fecha: string): Promise<void> => {
  const db = await getDB();
  await db.delete('entradas', [rolloId, fecha]);
};

export const leerEntrada = async (rolloId: string, fecha: string): Promise<Entrada | undefined> => {
  const db = await getDB();
  return db.get('entradas', [rolloId, fecha]);
};

export const entradasPorRollo = async (rolloId: string): Promise<Entrada[]> => {
  const db = await getDB();
  return db.getAllFromIndex('entradas', 'por-rollo', rolloId);
};

export const todasLasEntradas = async (): Promise<Entrada[]> => {
  const db = await getDB();
  return db.getAll('entradas');
};
