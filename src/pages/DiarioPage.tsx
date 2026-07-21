import { useMemo, useState } from 'react';
import styles from './DiarioPage.module.css';
import { FiltroProyecto, type FiltroValor } from '../components/diario/FiltroProyecto';
import { ListaEntradas } from '../components/diario/ListaEntradas';
import { PanelExportar } from '../components/diario/PanelExportar';
import { PanelAjustes } from '../components/ajustes/PanelAjustes';
import type { Entrada, NotaCuaderno, Rollo, Config } from '../types';

interface Props {
  entradas: Entrada[];
  rollos: Rollo[];
  notas: NotaCuaderno[];
  config: Config;
  onImportar: (json: string) => Promise<void>;
  onCambiarHora: (hora: string | undefined) => Promise<void>;
}

export const DiarioPage = ({ entradas, rollos, notas, config, onImportar, onCambiarHora }: Props) => {
  const [filtro, setFiltro] = useState<FiltroValor>('todos');

  const filtradas = useMemo(() => {
    if (filtro === 'todos') return entradas;
    return entradas.filter((e) => e.proyecto === filtro);
  }, [entradas, filtro]);

  const resumen = useMemo(() => {
    if (entradas.length === 0) {
      return { total: 0, primera: undefined as string | undefined, ultima: undefined as string | undefined };
    }
    const fechas = entradas.map((e) => e.fecha).sort();
    return {
      total: entradas.length,
      primera: fechas[0],
      ultima: fechas[fechas.length - 1],
    };
  }, [entradas]);

  return (
    <div className={`contenedor ${styles.contenedor}`}>
      <div className={styles.hoja}>
        <header className={styles.encabezado}>
          <div className={styles.filaTitulo}>
            <span className={styles.rotulo}>Diario</span>
            <span className={styles.total}>{String(resumen.total).padStart(2, '0')} entradas</span>
          </div>
          <div className={styles.filaCampos}>
            <div className={styles.campo}>
              <span className={styles.campoEtiqueta}>Rollos</span>
              <span className={styles.campoValor}>{String(rollos.length).padStart(2, '0')}</span>
            </div>
            <div className={styles.campo}>
              <span className={styles.campoEtiqueta}>Primer día</span>
              <span className={styles.campoValor}>{resumen.primera ?? '—'}</span>
            </div>
            <div className={styles.campo}>
              <span className={styles.campoEtiqueta}>Último día</span>
              <span className={styles.campoValor}>{resumen.ultima ?? '—'}</span>
            </div>
          </div>
        </header>

        <PanelAjustes horaGuardada={config.recordatorioHora} onCambiarHora={onCambiarHora} />

        <PanelExportar
          entradas={entradas}
          rollos={rollos}
          notas={notas}
          config={config}
          onImportar={onImportar}
        />

        <section className={styles.bloqueFiltro} aria-label="Filtrar entradas">
          <span className={styles.bloqueTitulo}>Filtrar por proyecto</span>
          <FiltroProyecto valor={filtro} onCambiar={setFiltro} />
        </section>

        <section className={styles.bloqueEntradas} aria-label="Entradas">
          <div className={styles.bloqueEncabezado}>
            <span className={styles.bloqueTitulo}>Entradas</span>
            <span className={styles.bloqueMeta}>
              {filtro === 'todos'
                ? `${filtradas.length} total`
                : `${filtradas.length} en ${filtro}`}
            </span>
          </div>
          <ListaEntradas entradas={filtradas} />
        </section>
      </div>
    </div>
  );
};
