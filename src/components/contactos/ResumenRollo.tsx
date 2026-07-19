import styles from './ResumenRollo.module.css';

interface Props {
  racha: number;
  total: number;
  maxima: number;
  completadoTotal: boolean;
  onEmpezarSiguiente: () => void;
}

export const ResumenRollo = ({ racha, total, maxima, completadoTotal, onEmpezarSiguiente }: Props) => {
  return (
    <>
      <dl className={styles.grid} aria-label="Resumen del rollo">
        <div className={styles.celda}>
          <span className={styles.numero}>{racha}</span>
          <dt className={styles.etiqueta}>Racha</dt>
        </div>
        <div className={styles.celda}>
          <span className={styles.numero}>{total}/30</span>
          <dt className={styles.etiqueta}>Total</dt>
        </div>
        <div className={styles.celda}>
          <span className={styles.numero}>{maxima}</span>
          <dt className={styles.etiqueta}>Mejor</dt>
        </div>
      </dl>
      {completadoTotal && (
        <aside className={styles.cierre}>
          <h2 className={styles.cierreTitulo}>Rollo revelado</h2>
          <p className={styles.cierreTexto}>
            Treinta días en la hoja. Ahora empieza el trabajo lento: revisa el rollo, elige
            unas diez fotos y ordénalas en una primera secuencia. Cuando lo tengas, arranca el
            siguiente.
          </p>
          <button type="button" className={styles.boton} onClick={onEmpezarSiguiente}>
            Empezar rollo Nº2
          </button>
        </aside>
      )}
    </>
  );
};
