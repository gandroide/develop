import { describe, it, expect, beforeEach } from 'vitest';
import { indexedDB } from 'fake-indexeddb';
import { _resetDBPromise, DB_NAME } from '../db';
import { crearNota, actualizarNota, borrarNota, todasLasNotas } from '../cuaderno';

const resetear = async (): Promise<void> => {
  await _resetDBPromise();
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
};

describe('cuaderno', () => {
  beforeEach(resetear);

  it('crea una nota con id y timestamp', async () => {
    const n = await crearNota({ texto: 'Idea rápida.', tipo: 'idea-de-foto', proyecto: 'cueva' });
    expect(n.id).toBeTruthy();
    expect(n.creadaEn).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(n.texto).toBe('Idea rápida.');
    expect(n.tipo).toBe('idea-de-foto');
    expect(n.proyecto).toBe('cueva');
  });

  it('lista todas las notas creadas', async () => {
    await crearNota({ texto: 'Uno.' });
    await crearNota({ texto: 'Dos.' });
    await crearNota({ texto: 'Tres.' });
    const notas = await todasLasNotas();
    expect(notas).toHaveLength(3);
    const textos = notas.map((n) => n.texto).sort();
    expect(textos).toEqual(['Dos.', 'Tres.', 'Uno.']);
  });

  it('edita el texto de una nota conservando id y fecha', async () => {
    const n = await crearNota({ texto: 'Original.' });
    await actualizarNota({ ...n, texto: 'Editada.' });
    const [tras] = await todasLasNotas();
    expect(tras.id).toBe(n.id);
    expect(tras.creadaEn).toBe(n.creadaEn);
    expect(tras.texto).toBe('Editada.');
  });

  it('borra una nota por id', async () => {
    const n1 = await crearNota({ texto: 'A borrar.' });
    await crearNota({ texto: 'A conservar.' });
    await borrarNota(n1.id);
    const notas = await todasLasNotas();
    expect(notas).toHaveLength(1);
    expect(notas[0].texto).toBe('A conservar.');
  });

  it('permite filtrar en memoria por proyecto y tipo', async () => {
    await crearNota({ texto: 'a', tipo: 'idea-de-foto', proyecto: 'cueva' });
    await crearNota({ texto: 'b', tipo: 'pensamiento', proyecto: 'cueva' });
    await crearNota({ texto: 'c', tipo: 'idea-de-foto', proyecto: 'madre' });
    const notas = await todasLasNotas();

    const ideasCueva = notas.filter((n) => n.tipo === 'idea-de-foto' && n.proyecto === 'cueva');
    expect(ideasCueva).toHaveLength(1);
    expect(ideasCueva[0].texto).toBe('a');

    const ideas = notas.filter((n) => n.tipo === 'idea-de-foto');
    expect(ideas).toHaveLength(2);
  });
});
