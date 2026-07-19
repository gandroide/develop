import { useMemo } from 'react';
import styles from './CirculoGraso.module.css';

interface Props {
  seed: number;
  animar?: boolean;
}

// Genera un camino cerrado tipo "círculo dibujado a lápiz graso":
// puntos en un ángulo uniforme con radios y ligeros offsets pseudoaleatorios.
const generarPath = (seed: number): string => {
  const rand = mulberry32(seed);
  const cx = 50;
  const cy = 50;
  const rBase = 34;
  const puntos = 14;
  const pts: [number, number][] = [];
  for (let i = 0; i < puntos; i++) {
    const t = (i / puntos) * Math.PI * 2 + rand() * 0.15;
    const r = rBase + (rand() - 0.5) * 8;
    pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
  }
  // Curva cerrada suave con cuadráticas entre puntos medios.
  let d = '';
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    if (i === 0) d += `M ${mx.toFixed(2)} ${my.toFixed(2)}`;
    else d += ` Q ${x1.toFixed(2)} ${y1.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }
  d += ' Z';
  return d;
};

const mulberry32 = (a: number) => () => {
  a = (a + 0x6d2b79f5) | 0;
  let t = a;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const CirculoGraso = ({ seed, animar = true }: Props) => {
  const d = useMemo(() => generarPath(seed), [seed]);
  // largo aproximado del path para el stroke-dasharray. 400 es un buen valor por defecto.
  const style = { '--largo': 420 } as React.CSSProperties;
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 100 100"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={d}
        className={`${styles.trazo} ${animar ? '' : styles.estatico}`}
        style={style}
      />
    </svg>
  );
};
