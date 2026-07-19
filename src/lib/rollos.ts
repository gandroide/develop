import { getDB, leerConfig, escribirConfig } from './db';
import { hoyISO } from './fechas';
import type { Rollo, Config } from '../types';

const nuevoId = (numero: number): string => `rollo-${numero}-${Date.now().toString(36)}`;

export const listarRollos = async (): Promise<Rollo[]> => {
  const db = await getDB();
  const rollos = await db.getAll('rollos');
  return rollos.sort((a, b) => a.numero - b.numero);
};

export const rolloPorId = async (id: string): Promise<Rollo | undefined> => {
  const db = await getDB();
  return db.get('rollos', id);
};

export const rolloActivo = async (): Promise<Rollo> => {
  const config = await leerConfig();
  if (!config) {
    return crearRolloInicial();
  }
  const db = await getDB();
  const rollo = await db.get('rollos', config.rolloActivoId);
  if (!rollo) throw new Error(`Rollo activo ${config.rolloActivoId} no existe.`);
  return rollo;
};

const crearRolloInicial = async (): Promise<Rollo> => {
  const db = await getDB();
  const rollo: Rollo = {
    id: nuevoId(1),
    numero: 1,
    fechaInicio: hoyISO(),
  };
  await db.put('rollos', rollo);
  const config: Config = { rolloActivoId: rollo.id };
  await escribirConfig(config);
  return rollo;
};

export const archivarRolloYCrearSiguiente = async (): Promise<Rollo> => {
  const db = await getDB();
  const config = await leerConfig();
  if (!config) return crearRolloInicial();
  const actual = await db.get('rollos', config.rolloActivoId);
  if (!actual) throw new Error('Sin rollo activo para archivar.');
  const cerrado: Rollo = { ...actual, fechaCierre: hoyISO() };
  await db.put('rollos', cerrado);
  const siguiente: Rollo = {
    id: nuevoId(actual.numero + 1),
    numero: actual.numero + 1,
    fechaInicio: hoyISO(),
  };
  await db.put('rollos', siguiente);
  await escribirConfig({ ...config, rolloActivoId: siguiente.id });
  return siguiente;
};
