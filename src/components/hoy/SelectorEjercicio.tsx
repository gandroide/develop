import styles from './SelectorEjercicio.module.css';
import { EJERCICIOS } from '../../data/ejercicios';

interface Props {
  seleccionadoId: string | undefined;
  onCambiar: (id: string) => void;
}

export const SelectorEjercicio = ({ seleccionadoId, onCambiar }: Props) => {
  return (
    <div className={styles.contenedor} role="radiogroup" aria-label="Ejercicio del día">
      {EJERCICIOS.map((e) => {
        const activo = e.id === seleccionadoId;
        return (
          <button
            key={e.id}
            type="button"
            role="radio"
            aria-checked={activo}
            className={`${styles.chip} ${activo ? styles.chipActivo : ''}`}
            onClick={() => onCambiar(e.id)}
          >
            {e.nombre}
          </button>
        );
      })}
    </div>
  );
};
