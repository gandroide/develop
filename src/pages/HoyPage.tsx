import { useMemo, useState, useEffect } from 'react';
import styles from './HoyPage.module.css';
import { SelectorEjercicio } from '../components/hoy/SelectorEjercicio';
import { SelectorProyecto } from '../components/hoy/SelectorProyecto';
import { CampoDiario } from '../components/hoy/CampoDiario';
import { BotonRevelar } from '../components/hoy/BotonRevelar';
import { EstadoCompletado } from '../components/hoy/EstadoCompletado';
import { BannerDiaEditor } from '../components/hoy/BannerDiaEditor';
import { SheetIdeaSuelta } from '../components/cuaderno/SheetIdeaSuelta';
import type { Entrada, NotaCuaderno, Proyecto, Rollo, TipoNota } from '../types';
import { guardarEntrada, borrarEntrada, leerEntrada } from '../lib/entradas';
import { crearNota } from '../lib/cuaderno';
import { diasEntre, esDomingo, formatearHumano, hoyISO } from '../lib/fechas';

interface Props {
  rollo: Rollo;
  notas: NotaCuaderno[];
  onCambio: () => void;
  onCambioNotas: () => Promise<void>;
}

export const HoyPage = ({ rollo, notas, onCambio, onCambioNotas }: Props) => {
  const hoy = hoyISO();
  const numeroPagina = calcularPagina(rollo.fechaInicio, hoy);
  const [entradaHoy, setEntradaHoy] = useState<Entrada | undefined>();
  const [ejercicioId, setEjercicioId] = useState<string | undefined>();
  const [proyecto, setProyecto] = useState<Proyecto | undefined>();
  const [nota, setNota] = useState('');
  const [sheetAbierto, setSheetAbierto] = useState(false);

  useEffect(() => {
    let vivo = true;
    leerEntrada(rollo.id, hoy).then((e) => {
      if (vivo) setEntradaHoy(e);
    });
    return () => {
      vivo = false;
    };
  }, [rollo.id, hoy]);

  const ideasSemana = useMemo(() => {
    if (!esDomingo(hoy)) return [];
    const limite = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return notas
      .filter((n) => n.tipo === 'idea-de-foto' && new Date(n.creadaEn).getTime() >= limite)
      .sort((a, b) => b.creadaEn.localeCompare(a.creadaEn))
      .slice(0, 3);
  }, [notas, hoy]);

  const revelar = async () => {
    if (!ejercicioId) return;
    await guardarEntrada({ fecha: hoy, rolloId: rollo.id, ejercicioId, nota, proyecto });
    const nueva = await leerEntrada(rollo.id, hoy);
    setEntradaHoy(nueva);
    onCambio();
  };

  const deshacer = async () => {
    await borrarEntrada(rollo.id, hoy);
    setEntradaHoy(undefined);
    setNota('');
    setEjercicioId(undefined);
    setProyecto(undefined);
    onCambio();
  };

  const anotarIdea = async (texto: string, p: Proyecto | undefined, t: TipoNota | undefined) => {
    await crearNota({ texto, proyecto: p, tipo: t });
    await onCambioNotas();
  };

  return (
    <div className={`contenedor ${styles.contenedor}`}>
      <div className={styles.hoja}>
        <header className={styles.encabezado}>
          <div className={styles.fila}>
            <span className={styles.fecha}>{hoy}</span>
            <span className={styles.pagina} aria-label={`Página ${numeroPagina} de 30`}>
              Pág.<span className={styles.paginaNumero}>{String(numeroPagina).padStart(2, '0')}</span>/30
            </span>
          </div>
          <h2 className={styles.titulo}>{formatearHumano(hoy)}</h2>
          <div className={styles.filaRolloAtajo}>
            <div className={styles.rolloTag}>
              Rollo Nº{String(rollo.numero).padStart(2, '0')}
            </div>
            <button
              type="button"
              className={styles.atajoIdea}
              onClick={() => setSheetAbierto(true)}
            >
              ＋ idea suelta
            </button>
          </div>
        </header>

        {esDomingo(hoy) && <BannerDiaEditor ideasSemana={ideasSemana} />}

        {entradaHoy ? (
          <EstadoCompletado entrada={entradaHoy} onDeshacer={deshacer} />
        ) : (
          <>
            <section className={styles.seccion} aria-labelledby="lbl-ejercicio">
              <span id="lbl-ejercicio" className={styles.etiqueta}>Ejercicio</span>
              <SelectorEjercicio seleccionadoId={ejercicioId} onCambiar={setEjercicioId} />
            </section>

            <section className={styles.seccion} aria-labelledby="lbl-proyecto">
              <span id="lbl-proyecto" className={styles.etiqueta}>Proyecto (opcional)</span>
              <SelectorProyecto valor={proyecto} onCambiar={setProyecto} />
            </section>

            <section className={styles.seccion}>
              <CampoDiario valor={nota} onCambiar={setNota} />
            </section>

            <BotonRevelar onClick={revelar} desactivado={!ejercicioId} />
          </>
        )}
      </div>
      <SheetIdeaSuelta
        abierto={sheetAbierto}
        onCerrar={() => setSheetAbierto(false)}
        onAnotar={anotarIdea}
      />
    </div>
  );
};

const calcularPagina = (fechaInicio: string, hoy: string): number => {
  const d = diasEntre(fechaInicio, hoy);
  if (d < 0) return 1;
  if (d >= 30) return 30;
  return d + 1;
};
