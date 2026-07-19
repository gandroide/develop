import styles from './ListaEntradas.module.css';
import type { Entrada } from '../../types';
import { ejercicioPorId } from '../../data/ejercicios';
import { formatearHumano } from '../../lib/fechas';

interface Props {
  entradas: Entrada[];
}

export const ListaEntradas = ({ entradas }: Props) => {
  if (entradas.length === 0) {
    return <p className={styles.vacio}>Sin entradas</p>;
  }
  const ordenadas = [...entradas].sort((a, b) => b.fecha.localeCompare(a.fecha));
  return (
    <ol className={styles.lista}>
      {ordenadas.map((e) => {
        const ej = ejercicioPorId(e.ejercicioId);
        return (
          <li key={`${e.rolloId}-${e.fecha}`} className={`${styles.entrada} tiraPelicula`}>
            <div className={styles.encabezado}>
              <span className={styles.fecha}>{e.fecha}</span>
              <span className={styles.humano}>{formatearHumano(e.fecha)}</span>
            </div>
            <div className={styles.meta}>
              <span className={styles.etiqueta}>Ejercicio</span>
              <span className={styles.valor}>{ej?.nombre ?? e.ejercicioId}</span>
              {e.proyecto && (
                <>
                  <span className={styles.etiqueta}>Proyecto</span>
                  <span className={styles.valor}>{e.proyecto}</span>
                </>
              )}
            </div>
            <p className={styles.nota}>{e.nota.trim() || '—'}</p>
          </li>
        );
      })}
    </ol>
  );
};
