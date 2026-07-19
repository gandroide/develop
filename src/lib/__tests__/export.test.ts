import { describe, it, expect } from 'vitest';
import { generarMarkdown, generarRespaldo, serializarRespaldo, parsearRespaldo } from '../export';
import type { Entrada, Rollo, Config } from '../../types';

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
});

describe('respaldo round-trip', () => {
  it('serializa y parsea sin pérdida', () => {
    const respaldo = generarRespaldo(entradas, rollos, config);
    const json = serializarRespaldo(respaldo);
    const restaurado = parsearRespaldo(json);
    expect(restaurado.entradas).toEqual(entradas);
    expect(restaurado.rollos).toEqual(rollos);
    expect(restaurado.config).toEqual(config);
    expect(restaurado.version).toBe(1);
  });

  it('rechaza versiones desconocidas', () => {
    const raw = JSON.stringify({ version: 999, entradas: [], rollos: [], config });
    expect(() => parsearRespaldo(raw)).toThrow(/versión/);
  });

  it('rechaza estructura corrupta', () => {
    expect(() => parsearRespaldo('null')).toThrow();
    expect(() => parsearRespaldo(JSON.stringify({ version: 1 }))).toThrow();
  });
});
