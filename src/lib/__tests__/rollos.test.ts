import { describe, it, expect, beforeEach } from 'vitest';
import { indexedDB } from 'fake-indexeddb';
import { _resetDBPromise, DB_NAME } from '../db';
import { rolloActivo, archivarRolloYCrearSiguiente, listarRollos } from '../rollos';
import { guardarEntrada, entradasPorRollo } from '../entradas';

const resetear = async (): Promise<void> => {
  await _resetDBPromise();
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
};

describe('rollos', () => {
  beforeEach(resetear);

  it('crea el rollo Nº1 automáticamente si no existe', async () => {
    const r = await rolloActivo();
    expect(r.numero).toBe(1);
    expect(r.fechaCierre).toBeUndefined();
  });

  it('archivar cierra el actual y arranca el siguiente', async () => {
    const primero = await rolloActivo();
    const segundo = await archivarRolloYCrearSiguiente();
    expect(segundo.numero).toBe(2);
    expect(segundo.fechaCierre).toBeUndefined();

    const rollos = await listarRollos();
    expect(rollos).toHaveLength(2);
    const primeroTrasCierre = rollos.find((r) => r.id === primero.id)!;
    expect(primeroTrasCierre.fechaCierre).toBeDefined();
  });

  it('las entradas conservan su rolloId al archivar', async () => {
    const primero = await rolloActivo();
    await guardarEntrada({
      fecha: '2026-07-18',
      rolloId: primero.id,
      ejercicioId: 'lista-tomas',
      nota: 'Primera.',
    });
    const segundo = await archivarRolloYCrearSiguiente();
    await guardarEntrada({
      fecha: '2026-07-19',
      rolloId: segundo.id,
      ejercicioId: 'lista-tomas',
      nota: 'Nueva era.',
    });

    const enPrimero = await entradasPorRollo(primero.id);
    const enSegundo = await entradasPorRollo(segundo.id);
    expect(enPrimero).toHaveLength(1);
    expect(enSegundo).toHaveLength(1);
    expect(enPrimero[0].fecha).toBe('2026-07-18');
    expect(enSegundo[0].fecha).toBe('2026-07-19');
  });

  it('rolloActivo siempre devuelve el más reciente sin fechaCierre', async () => {
    await rolloActivo();
    const segundo = await archivarRolloYCrearSiguiente();
    const activo = await rolloActivo();
    expect(activo.id).toBe(segundo.id);
    expect(activo.fechaCierre).toBeUndefined();
  });
});
