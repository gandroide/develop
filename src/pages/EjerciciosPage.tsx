import styles from './EjerciciosPage.module.css';
import { AcordeonEjercicio } from '../components/ejercicios/AcordeonEjercicio';
import { EJERCICIOS } from '../data/ejercicios';

export const EjerciciosPage = () => (
  <div className={`contenedor ${styles.contenedor}`}>
    <div className={styles.hoja}>
      <header className={styles.encabezado}>
        <div className={styles.filaTitulo}>
          <span className={styles.rotulo}>Los siete ejercicios del rollo</span>
          <span className={styles.total}>07 fichas</span>
        </div>
        <p className={styles.subtitulo}>
          Cartuchos de trabajo. Ábrelos cuando el rollo pida un empujón.
        </p>
      </header>

      <ol className={styles.lista}>
        {EJERCICIOS.map((e, i) => (
          <AcordeonEjercicio key={e.id} ejercicio={e} indice={i + 1} total={EJERCICIOS.length} />
        ))}
      </ol>
    </div>
  </div>
);
