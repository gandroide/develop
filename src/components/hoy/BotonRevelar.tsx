import styles from './BotonRevelar.module.css';

interface Props {
  onClick: () => void;
  desactivado: boolean;
}

export const BotonRevelar = ({ onClick, desactivado }: Props) => (
  <button type="button" className={styles.boton} onClick={onClick} disabled={desactivado}>
    Revelar el día
  </button>
);
