import { describe, it, expect } from 'vitest';
import { calcularRacha } from '../racha';

describe('calcularRacha', () => {
  it('sin fechas devuelve ceros', () => {
    expect(calcularRacha([], '2026-07-18')).toEqual({ actual: 0, maxima: 0, totalCompletados: 0 });
  });

  it('racha actual incluye hoy si está completado', () => {
    const r = calcularRacha(['2026-07-16', '2026-07-17', '2026-07-18'], '2026-07-18');
    expect(r.actual).toBe(3);
    expect(r.maxima).toBe(3);
    expect(r.totalCompletados).toBe(3);
  });

  it('racha actual cuenta ayer si hoy aún no está marcado', () => {
    const r = calcularRacha(['2026-07-16', '2026-07-17'], '2026-07-18');
    expect(r.actual).toBe(2);
  });

  it('un hueco de un día rompe la racha actual', () => {
    const r = calcularRacha(['2026-07-14', '2026-07-15', '2026-07-17', '2026-07-18'], '2026-07-18');
    expect(r.actual).toBe(2);
    expect(r.maxima).toBe(2);
  });

  it('máxima considera todo el histórico aunque la actual sea corta', () => {
    const fechas = ['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-10', '2026-06-11'];
    const r = calcularRacha(fechas, '2026-07-18');
    expect(r.actual).toBe(0);
    expect(r.maxima).toBe(4);
    expect(r.totalCompletados).toBe(6);
  });

  it('elimina duplicados antes de contar', () => {
    const r = calcularRacha(['2026-07-18', '2026-07-18'], '2026-07-18');
    expect(r.totalCompletados).toBe(1);
    expect(r.actual).toBe(1);
  });
});
