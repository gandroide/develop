import styles from './EstadoCompletado.module.css';
import { CirculoGraso } from '../contactos/CirculoGraso';
import type { Entrada } from '../../types';
import { ejercicioPorId } from '../../data/ejercicios';

interface Props {
  entrada: Entrada;
  onDeshacer: () => void;
}

export const EstadoCompletado = ({ entrada, onDeshacer }: Props) => {
  const ej = ejercicioPorId(entrada.ejercicioId);
  return (
    <div className={styles.contenedor} aria-live="polite">
      <span className={styles.sello} aria-hidden="true">Revelado</span>
      <div className={styles.encabezado}>
        <div className={styles.marca}>
          <CirculoGraso seed={hashSeed(entrada.fecha)} animar />
        </div>
        <div>
          <div className={styles.titulo}>Día revelado</div>
          <div className={styles.meta}>
            {ej?.nombre ?? entrada.ejercicioId}
            {entrada.proyecto ? ` · ${entrada.proyecto}` : ''}
          </div>
        </div>
      </div>
      {entrada.nota.trim() && <p className={styles.nota}>{entrada.nota}</p>}
      <button type="button" className={styles.deshacer} onClick={onDeshacer}>
        Deshacer
      </button>
    </div>
  );
};

const hashSeed = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};
