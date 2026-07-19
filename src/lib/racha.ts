import { diasEntre } from './fechas';

export interface EstadoRacha {
  actual: number;
  maxima: number;
  totalCompletados: number;
}

export const calcularRacha = (fechasCompletadas: string[], hoyIso: string): EstadoRacha => {
  if (fechasCompletadas.length === 0) {
    return { actual: 0, maxima: 0, totalCompletados: 0 };
  }
  const ordenadas = [...new Set(fechasCompletadas)].sort();
  const set = new Set(ordenadas);

  let maxima = 0;
  let corriendo = 0;
  let anterior: string | null = null;
  for (const f of ordenadas) {
    if (anterior && diasEntre(anterior, f) === 1) {
      corriendo += 1;
    } else {
      corriendo = 1;
    }
    if (corriendo > maxima) maxima = corriendo;
    anterior = f;
  }

  let actual = 0;
  let cursor = hoyIso;
  if (!set.has(hoyIso)) {
    cursor = sumarDia(cursor, -1);
  }
  while (set.has(cursor)) {
    actual += 1;
    cursor = sumarDia(cursor, -1);
  }

  return { actual, maxima, totalCompletados: ordenadas.length };
};

const sumarDia = (iso: string, n: number): string => {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + n);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};
