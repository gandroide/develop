import { useRef, useState, useEffect } from 'react';
import styles from './CampoCaptura.module.css';
import type { Proyecto, TipoNota } from '../../types';

interface Props {
  onAnotar: (texto: string, proyecto: Proyecto | undefined, tipo: TipoNota | undefined) => Promise<void>;
  autoFocus?: boolean;
}

const PROYECTOS: { id: Proyecto; etiqueta: string }[] = [
  { id: 'cueva', etiqueta: 'Cueva' },
  { id: 'madre', etiqueta: 'Madre' },
  { id: 'otro', etiqueta: 'Otro' },
];

const TIPOS: { id: TipoNota; etiqueta: string }[] = [
  { id: 'idea-de-foto', etiqueta: 'Idea de foto' },
  { id: 'pensamiento', etiqueta: 'Pensamiento' },
  { id: 'referencia', etiqueta: 'Referencia' },
];

export const CampoCaptura = ({ onAnotar, autoFocus }: Props) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [texto, setTexto] = useState('');
  const [proyecto, setProyecto] = useState<Proyecto | undefined>();
  const [tipo, setTipo] = useState<TipoNota | undefined>();
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (autoFocus && ref.current) ref.current.focus();
  }, [autoFocus]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [texto]);

  const anotar = async () => {
    const limpio = texto.trim();
    if (!limpio || guardando) return;
    setGuardando(true);
    try {
      await onAnotar(limpio, proyecto, tipo);
      setTexto('');
      setProyecto(undefined);
      setTipo(undefined);
    } finally {
      setGuardando(false);
    }
  };

  const alTecla = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      void anotar();
    }
  };

  return (
    <div className={styles.grupo}>
      <label htmlFor="cuaderno-captura" className={styles.etiqueta}>
        Anotar
      </label>
      <textarea
        id="cuaderno-captura"
        ref={ref}
        className={styles.textarea}
        placeholder="Una idea, una imagen que pasó, una frase…"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={alTecla}
        rows={1}
      />
      <div className={styles.chipsFila} role="group" aria-label="Proyecto">
        <span className={styles.chipsRotulo}>Proyecto</span>
        <div className={styles.chips}>
          {PROYECTOS.map((p) => {
            const activo = proyecto === p.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={activo}
                className={`${styles.chip} ${activo ? styles.chipActivo : ''}`}
                onClick={() => setProyecto(activo ? undefined : p.id)}
              >
                {p.etiqueta}
              </button>
            );
          })}
        </div>
      </div>
      <div className={styles.chipsFila} role="group" aria-label="Tipo">
        <span className={styles.chipsRotulo}>Tipo</span>
        <div className={styles.chips}>
          {TIPOS.map((t) => {
            const activo = tipo === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={activo}
                className={`${styles.chip} ${activo ? styles.chipActivo : ''}`}
                onClick={() => setTipo(activo ? undefined : t.id)}
              >
                {t.etiqueta}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className={styles.boton}
        onClick={anotar}
        disabled={!texto.trim() || guardando}
      >
        Anotar
      </button>
    </div>
  );
};
