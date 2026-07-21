import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Entrada, Rollo, Config, NotaCuaderno } from '../types';

export const DB_NAME = 'revelado';
export const DB_VERSION = 2;

export interface ReveladoDB extends DBSchema {
  entradas: {
    key: [string, string]; // [rolloId, fecha]
    value: Entrada;
    indexes: { 'por-fecha': string; 'por-rollo': string; 'por-proyecto': string };
  };
  rollos: {
    key: string;
    value: Rollo;
  };
  config: {
    key: string;
    value: { k: string; v: unknown };
  };
  cuaderno: {
    key: string;
    value: NotaCuaderno;
    indexes: { 'por-fecha': string; 'por-proyecto': string; 'por-tipo': string };
  };
}

let dbPromise: Promise<IDBPDatabase<ReveladoDB>> | null = null;

export const getDB = (): Promise<IDBPDatabase<ReveladoDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<ReveladoDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const entradas = db.createObjectStore('entradas', { keyPath: ['rolloId', 'fecha'] });
          entradas.createIndex('por-fecha', 'fecha');
          entradas.createIndex('por-rollo', 'rolloId');
          entradas.createIndex('por-proyecto', 'proyecto');
          db.createObjectStore('rollos', { keyPath: 'id' });
          db.createObjectStore('config', { keyPath: 'k' });
        }
        if (oldVersion < 2) {
          const cuaderno = db.createObjectStore('cuaderno', { keyPath: 'id' });
          cuaderno.createIndex('por-fecha', 'creadaEn');
          cuaderno.createIndex('por-proyecto', 'proyecto');
          cuaderno.createIndex('por-tipo', 'tipo');
        }
      },
    });
  }
  return dbPromise;
};

// solo para tests
export const _resetDBPromise = async (): Promise<void> => {
  if (dbPromise) {
    try {
      const db = await dbPromise;
      db.close();
    } catch {
      /* noop */
    }
  }
  dbPromise = null;
};

const CONFIG_KEY = 'app';

export const leerConfig = async (): Promise<Config | undefined> => {
  const db = await getDB();
  const raw = await db.get('config', CONFIG_KEY);
  return raw?.v as Config | undefined;
};

export const escribirConfig = async (config: Config): Promise<void> => {
  const db = await getDB();
  await db.put('config', { k: CONFIG_KEY, v: config });
};
