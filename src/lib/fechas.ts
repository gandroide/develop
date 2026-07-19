export const hoyISO = (ahora: Date = new Date()): string => aISO(ahora);

export const aISO = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const deISO = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

export const esDomingo = (iso: string): boolean => deISO(iso).getDay() === 0;

export const diasEntre = (aIso: string, bIso: string): number => {
  const MS = 1000 * 60 * 60 * 24;
  const a = deISO(aIso).getTime();
  const b = deISO(bIso).getTime();
  return Math.round((b - a) / MS);
};

export const sumarDias = (iso: string, n: number): string => {
  const d = deISO(iso);
  d.setDate(d.getDate() + n);
  return aISO(d);
};

export const formatearHumano = (iso: string): string => {
  const d = deISO(iso);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};
