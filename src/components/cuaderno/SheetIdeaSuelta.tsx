import { useEffect, useRef } from 'react';
import styles from './SheetIdeaSuelta.module.css';
import { CampoCaptura } from './CampoCaptura';
import type { Proyecto, TipoNota } from '../../types';

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  onAnotar: (texto: string, proyecto: Proyecto | undefined, tipo: TipoNota | undefined) => Promise<void>;
}

export const SheetIdeaSuelta = ({ abierto, onCerrar, onAnotar }: Props) => {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  const anotarYCerrar = async (
    texto: string,
    proyecto: Proyecto | undefined,
    tipo: TipoNota | undefined,
  ) => {
    await onAnotar(texto, proyecto, tipo);
    onCerrar();
  };

  return (
    <dialog
      ref={ref}
      className={styles.dialogo}
      onClose={onCerrar}
      onCancel={onCerrar}
      aria-labelledby="sheet-idea-titulo"
    >
      <header className={styles.cabecera}>
        <span id="sheet-idea-titulo" className={styles.titulo}>Idea suelta</span>
        <button
          type="button"
          className={styles.cerrar}
          onClick={onCerrar}
          aria-label="Cerrar"
        >
          ✕
        </button>
      </header>
      <div className={styles.cuerpo}>
        <CampoCaptura onAnotar={anotarYCerrar} autoFocus={abierto} />
      </div>
    </dialog>
  );
};
