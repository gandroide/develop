import styles from './CuadroContacto.module.css';
import { CirculoGraso } from './CirculoGraso';

interface Props {
  numero: number;
  completado: boolean;
  esHoy?: boolean;
  animarAlEntrar?: boolean;
}

export const CuadroContacto = ({ numero, completado, esHoy = false, animarAlEntrar = false }: Props) => {
  const etiqueta = String(numero).padStart(2, '0');
  return (
    <div
      className={`${styles.cuadro} ${esHoy ? styles.hoy : ''}`}
      role="listitem"
      aria-label={`Cuadro ${etiqueta}${completado ? ', completado' : ''}`}
    >
      {completado && (
        <div className={styles.circulo}>
          <CirculoGraso seed={numero * 977} animar={animarAlEntrar} />
        </div>
      )}
      <span className={styles.numero}>{etiqueta}</span>
    </div>
  );
};
