import { useMemo, useState } from 'react';
import styles from './CuadernoPage.module.css';
import { CampoCaptura } from '../components/cuaderno/CampoCaptura';
import {
  FiltrosNotas,
  type FiltroProyectoNota,
  type FiltroTipoNota,
} from '../components/cuaderno/FiltrosNotas';
import { ListaNotas } from '../components/cuaderno/ListaNotas';
import type { NotaCuaderno, Proyecto, TipoNota } from '../types';
import { actualizarNota, borrarNota, crearNota } from '../lib/cuaderno';

interface Props {
  notas: NotaCuaderno[];
  onCambio: () => Promise<void>;
}

export const CuadernoPage = ({ notas, onCambio }: Props) => {
  const [proyecto, setProyecto] = useState<FiltroProyectoNota>('todos');
  const [tipo, setTipo] = useState<FiltroTipoNota>('todos');

  const filtradas = useMemo(() => {
    return notas.filter((n) => {
      if (proyecto !== 'todos' && n.proyecto !== proyecto) return false;
      if (tipo !== 'todos' && n.tipo !== tipo) return false;
      return true;
    });
  }, [notas, proyecto, tipo]);

  const anotar = async (texto: string, p: Proyecto | undefined, t: TipoNota | undefined) => {
    await crearNota({ texto, proyecto: p, tipo: t });
    await onCambio();
  };

  const editar = async (n: NotaCuaderno) => {
    await actualizarNota(n);
    await onCambio();
  };

  const borrar = async (id: string) => {
    await borrarNota(id);
    await onCambio();
  };

  return (
    <div className={`contenedor ${styles.contenedor}`}>
      <div className={styles.hoja}>
        <header className={styles.encabezado}>
          <div className={styles.filaTitulo}>
            <span className={styles.rotulo}>Cuaderno</span>
            <span className={styles.total}>{String(notas.length).padStart(2, '0')} notas</span>
          </div>
          <p className={styles.subtitulo}>
            Captura rápida. Sin fecha obligatoria, sin ritual.
          </p>
        </header>

        <section className={styles.bloque} aria-label="Anotar">
          <CampoCaptura onAnotar={anotar} />
        </section>

        <section className={styles.bloque} aria-label="Filtros">
          <FiltrosNotas
            proyecto={proyecto}
            tipo={tipo}
            onProyecto={setProyecto}
            onTipo={setTipo}
          />
        </section>

        <section className={styles.bloque} aria-label="Notas">
          <div className={styles.bloqueEncabezado}>
            <span className={styles.bloqueTitulo}>Notas</span>
            <span className={styles.bloqueMeta}>
              {proyecto === 'todos' && tipo === 'todos'
                ? `${filtradas.length} total`
                : `${filtradas.length} filtradas`}
            </span>
          </div>
          <ListaNotas notas={filtradas} onEditar={editar} onBorrar={borrar} />
        </section>
      </div>
    </div>
  );
};
