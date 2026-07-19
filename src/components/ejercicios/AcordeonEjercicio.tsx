import { useId, useState } from 'react';
import styles from './AcordeonEjercicio.module.css';
import type { Ejercicio } from '../../types';

interface Props {
  ejercicio: Ejercicio;
  indice: number;
  total: number;
}

export const AcordeonEjercicio = ({ ejercicio, indice, total }: Props) => {
  const [abierto, setAbierto] = useState(false);
  const idPanel = useId();
  const idBoton = useId();
  const referencia = `${String(indice).padStart(2, '0')}/${String(total).padStart(2, '0')}`;

  return (
    <li className={`${styles.item} ${abierto ? styles.itemAbierto : ''}`}>
      <button
        id={idBoton}
        type="button"
        className={styles.disparador}
        aria-expanded={abierto}
        aria-controls={idPanel}
        onClick={() => setAbierto((v) => !v)}
      >
        <span className={styles.referencia} aria-hidden="true">{referencia}</span>
        <span className={styles.textos}>
          <span className={styles.nombre}>{ejercicio.nombre}</span>
          <span className={styles.origen}>{ejercicio.origen}</span>
        </span>
        <span className={styles.toggle} aria-hidden="true">{abierto ? '−' : '+'}</span>
      </button>
      {abierto && (
        <div id={idPanel} role="region" aria-labelledby={idBoton} className={styles.contenido}>
          <p className={styles.resumen}>{ejercicio.resumen}</p>
          <p className={styles.detalle}>{ejercicio.detalle}</p>
          <p className={styles.pieOrigen}>
            <span className={styles.pieEtiqueta}>Origen</span>
            <span className={styles.pieValor}>{ejercicio.origen}</span>
          </p>
        </div>
      )}
    </li>
  );
};
