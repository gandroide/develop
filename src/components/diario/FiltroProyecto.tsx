import styles from './FiltroProyecto.module.css';
import type { Proyecto } from '../../types';

export type FiltroValor = 'todos' | Proyecto;

interface Props {
  valor: FiltroValor;
  onCambiar: (v: FiltroValor) => void;
}

const OPCIONES: { id: FiltroValor; etiqueta: string }[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'cueva', etiqueta: 'Cueva' },
  { id: 'madre', etiqueta: 'Madre' },
  { id: 'otro', etiqueta: 'Otro' },
];

export const FiltroProyecto = ({ valor, onCambiar }: Props) => (
  <div className={styles.grupo} role="radiogroup" aria-label="Filtrar por proyecto">
    {OPCIONES.map((o) => {
      const activo = o.id === valor;
      return (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={activo}
          className={`${styles.chip} ${activo ? styles.activo : ''}`}
          onClick={() => onCambiar(o.id)}
        >
          {o.etiqueta}
        </button>
      );
    })}
  </div>
);
