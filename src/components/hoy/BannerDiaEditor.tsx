import styles from './BannerDiaEditor.module.css';
import type { NotaCuaderno } from '../../types';

interface Props {
  ideasSemana?: NotaCuaderno[];
}

export const BannerDiaEditor = ({ ideasSemana }: Props) => (
  <aside className={styles.banner} role="note">
    <span className={styles.etiqueta}>Día del editor</span>
    <p className={styles.mensaje}>
      Hoy el crítico sí trabaja: revisa la semana, elige 2–3 fotos y escribe por qué.
    </p>
    {ideasSemana && ideasSemana.length > 0 && (
      <div className={styles.ideas}>
        <span className={styles.ideasTitulo}>Ideas de esta semana que aún no fotografías</span>
        <ul className={styles.ideasLista}>
          {ideasSemana.map((n) => (
            <li key={n.id} className={styles.idea}>{n.texto}</li>
          ))}
        </ul>
      </div>
    )}
  </aside>
);
