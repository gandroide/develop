import { describe, it, expect } from 'vitest';
import { generarMarkdown, generarRespaldo, serializarRespaldo, parsearRespaldo } from '../export';
import type { Entrada, NotaCuaderno, Rollo, Config } from '../../types';

const rollos: Rollo[] = [
  { id: 'r1', numero: 1, fechaInicio: '2026-07-01', fechaCierre: '2026-07-30' },
  { id: 'r2', numero: 2, fechaInicio: '2026-07-31' },
];

const entradas: Entrada[] = [
  {
    fecha: '2026-07-01',
    rolloId: 'r1',
    ejercicioId: 'lista-tomas',
    nota: 'Primera nota.',
    proyecto: 'cueva',
    creadoEn: '2026-07-01T20:00:00.000Z',
  },
  {
    fecha: '2026-07-02',
    rolloId: 'r1',
    ejercicioId: 'un-objeto-30-formas',
    nota: 'Segunda nota.',
    creadoEn: '2026-07-02T20:00:00.000Z',
  },
];

const notas: NotaCuaderno[] = [
  {
    id: 'n1',
    creadaEn: '2026-07-03T09:00:00.000Z',
    texto: 'La luz en el patio a las 7am.',
    tipo: 'idea-de-foto',
    proyecto: 'cueva',
  },
  {
    id: 'n2',
    creadaEn: '2026-07-05T18:00:00.000Z',
    texto: 'Sontag: fotografiar es apropiarse.',
    tipo: 'referencia',
  },
];

const config: Config = { rolloActivoId: 'r2', recordatorioHora: '19:00' };

describe('markdown', () => {
  it('agrupa por rollo y ordena por fecha', () => {
    const md = generarMarkdown(entradas, rollos);
    expect(md).toContain('# Diario Revelado');
    expect(md).toContain('## Rollo Nº1');
    expect(md).toContain('### 2026-07-01');
    expect(md).toContain('### 2026-07-02');
    expect(md.indexOf('2026-07-01')).toBeLessThan(md.indexOf('2026-07-02'));
  });

  it('marca notas vacías', () => {
    const vacio: Entrada = { ...entradas[0], nota: '  ' };
    const md = generarMarkdown([vacio], rollos.slice(0, 1));
    expect(md).toContain('_(sin nota)_');
  });

  it('añade sección de cuaderno cuando hay notas', () => {
    const md = generarMarkdown(entradas, rollos, notas);
    expect(md).toContain('## Cuaderno');
    expect(md).toContain('La luz en el patio a las 7am.');
    expect(md).toContain('Idea de foto');
    expect(md).toContain('cueva');
    expect(md).toContain('Sontag: fotografiar es apropiarse.');
    expect(md.indexOf('2026-07-03')).toBeLessThan(md.indexOf('2026-07-05'));
  });

  it('omite sección de cuaderno cuando no hay notas', () => {
    const md = generarMarkdown(entradas, rollos, []);
    expect(md).not.toContain('## Cuaderno');
  });
});

describe('respaldo round-trip', () => {
  it('serializa y parsea sin pérdida', () => {
    const respaldo = generarRespaldo(entradas, rollos, notas, config);
    const json = serializarRespaldo(respaldo);
    const restaurado = parsearRespaldo(json);
    expect(restaurado.entradas).toEqual(entradas);
    expect(restaurado.rollos).toEqual(rollos);
    expect(restaurado.notasCuaderno).toEqual(notas);
    expect(restaurado.config).toEqual(config);
    expect(restaurado.version).toBe(2);
  });

  it('tolera respaldos v1 sin notas', () => {
    const raw = JSON.stringify({
      version: 1,
      exportadoEn: '2026-07-01T00:00:00.000Z',
      entradas,
      rollos,
      config,
    });
    const restaurado = parsearRespaldo(raw);
    expect(restaurado.version).toBe(2);
    expect(restaurado.notasCuaderno).toEqual([]);
    expect(restaurado.entradas).toEqual(entradas);
  });

  it('rechaza versiones desconocidas', () => {
    const raw = JSON.stringify({ version: 999, entradas: [], rollos: [], config });
    expect(() => parsearRespaldo(raw)).toThrow(/versión/);
  });

  it('rechaza estructura corrupta', () => {
    expect(() => parsearRespaldo('null')).toThrow();
    expect(() => parsearRespaldo(JSON.stringify({ version: 2 }))).toThrow();
  });
});
