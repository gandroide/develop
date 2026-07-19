import type { Rollo } from '../../types';
import styles from './EtiquetaRollo.module.css';

interface Props {
  rollo: Rollo;
}

export const EtiquetaRollo = ({ rollo }: Props) => {
  const numero = String(rollo.numero).padStart(2, '0');
  return (
    <span className={styles.etiqueta} aria-label={`Rollo número ${rollo.numero}`}>
      Rollo Nº{numero} · {rollo.fechaInicio}
    </span>
  );
};
