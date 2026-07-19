import styles from './HojaContactos.module.css';
import { CuadroContacto } from './CuadroContacto';
import type { Rollo } from '../../types';

interface Props {
  rollo: Rollo;
  fechasCompletadas: string[];
  hoyIso: string;
  cuadroReciente?: number;
}

export const HojaContactos = ({ rollo, fechasCompletadas, hoyIso, cuadroReciente }: Props) => {
  const set = new Set(fechasCompletadas);
  const cuadros = calcularCuadros(rollo.fechaInicio, hoyIso, set);

  return (
    <section className={styles.hoja} aria-label="Hoja de contactos">
      <div className={styles.grid} role="list">
        {cuadros.map((c) => (
          <CuadroContacto
            key={c.numero}
            numero={c.numero}
            completado={c.completado}
            esHoy={c.esHoy}
            animarAlEntrar={c.numero === cuadroReciente}
          />
        ))}
      </div>
      <div className={styles.pie}>
        <span>Rollo Nº{String(rollo.numero).padStart(2, '0')}</span>
        <span>Inicio {rollo.fechaInicio}</span>
      </div>
    </section>
  );
};

interface CuadroInfo {
  numero: number;
  completado: boolean;
  esHoy: boolean;
}

const calcularCuadros = (
  fechaInicioIso: string,
  hoyIso: string,
  completadas: Set<string>,
): CuadroInfo[] => {
  const out: CuadroInfo[] = [];
  for (let i = 0; i < 30; i++) {
    const fecha = desplazar(fechaInicioIso, i);
    out.push({
      numero: i + 1,
      completado: completadas.has(fecha),
      esHoy: fecha === hoyIso,
    });
  }
  return out;
};

const desplazar = (iso: string, dias: number): string => {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + dias);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};
