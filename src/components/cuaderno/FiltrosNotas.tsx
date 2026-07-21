import styles from './FiltrosNotas.module.css';
import type { Proyecto, TipoNota } from '../../types';

export type FiltroProyectoNota = 'todos' | Proyecto;
export type FiltroTipoNota = 'todos' | TipoNota;

interface Props {
  proyecto: FiltroProyectoNota;
  tipo: FiltroTipoNota;
  onProyecto: (v: FiltroProyectoNota) => void;
  onTipo: (v: FiltroTipoNota) => void;
}

const PROYECTOS: { id: FiltroProyectoNota; etiqueta: string }[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'cueva', etiqueta: 'Cueva' },
  { id: 'madre', etiqueta: 'Madre' },
  { id: 'otro', etiqueta: 'Otro' },
];

const TIPOS: { id: FiltroTipoNota; etiqueta: string }[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'idea-de-foto', etiqueta: 'Ideas' },
  { id: 'pensamiento', etiqueta: 'Pensamiento' },
  { id: 'referencia', etiqueta: 'Referencia' },
];

export const FiltrosNotas = ({ proyecto, tipo, onProyecto, onTipo }: Props) => (
  <div className={styles.grupo}>
    <div>
      <span className={styles.rotulo}>Proyecto</span>
      <div className={styles.fila} role="radiogroup" aria-label="Filtrar por proyecto">
        {PROYECTOS.map((o) => {
          const activo = o.id === proyecto;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={activo}
              className={`${styles.chip} ${activo ? styles.chipActivo : ''}`}
              onClick={() => onProyecto(o.id)}
            >
              {o.etiqueta}
            </button>
          );
        })}
      </div>
    </div>
    <div>
      <span className={styles.rotulo}>Tipo</span>
      <div className={styles.fila} role="radiogroup" aria-label="Filtrar por tipo">
        {TIPOS.map((o) => {
          const activo = o.id === tipo;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={activo}
              className={`${styles.chip} ${activo ? styles.chipActivo : ''}`}
              onClick={() => onTipo(o.id)}
            >
              {o.etiqueta}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
