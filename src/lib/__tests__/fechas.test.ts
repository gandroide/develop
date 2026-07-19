import { describe, it, expect } from 'vitest';
import { aISO, deISO, esDomingo, diasEntre, sumarDias, hoyISO } from '../fechas';

describe('fechas', () => {
  it('aISO usa fecha local, no UTC', () => {
    const d = new Date(2026, 0, 1, 23, 59, 59); // 1 ene local
    expect(aISO(d)).toBe('2026-01-01');
  });

  it('deISO revierte aISO', () => {
    const iso = '2026-07-18';
    const d = deISO(iso);
    expect(aISO(d)).toBe(iso);
  });

  it('esDomingo detecta el día', () => {
    expect(esDomingo('2026-07-19')).toBe(true); // domingo
    expect(esDomingo('2026-07-20')).toBe(false); // lunes
  });

  it('diasEntre cuenta correctamente cruzando cambio de mes', () => {
    expect(diasEntre('2026-01-31', '2026-02-02')).toBe(2);
    expect(diasEntre('2026-07-18', '2026-07-18')).toBe(0);
  });

  it('sumarDias respeta cambio de mes y año', () => {
    expect(sumarDias('2026-01-31', 1)).toBe('2026-02-01');
    expect(sumarDias('2026-12-31', 1)).toBe('2027-01-01');
    expect(sumarDias('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('hoyISO usa zona local', () => {
    const iso = hoyISO(new Date(2026, 6, 18, 3, 0));
    expect(iso).toBe('2026-07-18');
  });
});
