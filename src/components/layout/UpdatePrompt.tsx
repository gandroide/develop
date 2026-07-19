import styles from './UpdatePrompt.module.css';

interface Props {
  visible: boolean;
  onActualizar: () => void;
}

export const UpdatePrompt = ({ visible, onActualizar }: Props) => {
  if (!visible) return null;
  return (
    <div className={styles.contenedor} role="status" aria-live="polite">
      <div className={styles.tarjeta}>
        <span>Nueva copia lista</span>
        <button type="button" className={styles.boton} onClick={onActualizar}>
          Actualizar
        </button>
      </div>
    </div>
  );
};
