import styles from './BannerDiaEditor.module.css';

export const BannerDiaEditor = () => (
  <aside className={styles.banner} role="note">
    <span className={styles.etiqueta}>Día del editor</span>
    <p className={styles.mensaje}>
      Hoy el crítico sí trabaja: revisa la semana, elige 2–3 fotos y escribe por qué.
    </p>
  </aside>
);
