import styles from './SelectorProyecto.module.css';
import type { Proyecto } from '../../types';

interface Props {
  valor: Proyecto | undefined;
  onCambiar: (p: Proyecto | undefined) => void;
}

const OPCIONES: { id: Proyecto; etiqueta: string }[] = [
  { id: 'cueva', etiqueta: 'Cueva' },
  { id: 'madre', etiqueta: 'Madre' },
  { id: 'otro', etiqueta: 'Otro' },
];

export const SelectorProyecto = ({ valor, onCambiar }: Props) => {
  return (
    <div className={styles.grupo} role="radiogroup" aria-label="Proyecto asociado">
      {OPCIONES.map((o) => {
        const activo = o.id === valor;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={activo}
            className={`${styles.chip} ${activo ? styles.activo : ''}`}
            onClick={() => onCambiar(activo ? undefined : o.id)}
          >
            {o.etiqueta}
          </button>
        );
      })}
    </div>
  );
};
