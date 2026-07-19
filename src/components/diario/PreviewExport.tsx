import { useEffect, useRef } from 'react';
import styles from './PreviewExport.module.css';

interface Props {
  abierto: boolean;
  titulo: string;
  nombreArchivo: string;
  contenido: string;
  onDescargar: () => void;
  onCerrar: () => void;
}

export const PreviewExport = ({
  abierto,
  titulo,
  nombreArchivo,
  contenido,
  onDescargar,
  onCerrar,
}: Props) => {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  const tamano = new Blob([contenido]).size;
  const lineas = contenido ? contenido.split('\n').length : 0;

  return (
    <dialog
      ref={ref}
      className={styles.dialogo}
      onClose={onCerrar}
      onCancel={onCerrar}
      aria-labelledby="preview-export-titulo"
    >
      <header className={`${styles.cabecera} tiraPelicula`}>
        <div className={styles.marca}>
          <span className={styles.sello}>Proof</span>
          <span id="preview-export-titulo" className={styles.titulo}>{titulo}</span>
        </div>
        <dl className={styles.datos}>
          <dt className={styles.datoEtiqueta}>Archivo</dt>
          <dd className={styles.datoValor}>{nombreArchivo}</dd>
          <dt className={styles.datoEtiqueta}>Peso</dt>
          <dd className={styles.datoValor}>{formatearTamano(tamano)}</dd>
          <dt className={styles.datoEtiqueta}>Líneas</dt>
          <dd className={styles.datoValor}>{lineas}</dd>
        </dl>
      </header>
      <div className={styles.cuerpo}>
        {contenido.trim().length > 0 ? (
          <pre className={styles.contenido}>{contenido}</pre>
        ) : (
          <p className={styles.vacio}>Sin contenido para previsualizar.</p>
        )}
      </div>
      <footer className={styles.pie}>
        <button
          type="button"
          className={`${styles.boton} ${styles.botonSecundario}`}
          onClick={onCerrar}
        >
          Cancelar
        </button>
        <button type="button" className={`${styles.boton} ${styles.botonPrimario}`} onClick={onDescargar}>
          Descargar
        </button>
      </footer>
    </dialog>
  );
};

const formatearTamano = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
