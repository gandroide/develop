import { useState, useEffect } from 'react';
import styles from './HoyPage.module.css';
import { SelectorEjercicio } from '../components/hoy/SelectorEjercicio';
import { SelectorProyecto } from '../components/hoy/SelectorProyecto';
import { CampoDiario } from '../components/hoy/CampoDiario';
import { BotonRevelar } from '../components/hoy/BotonRevelar';
import { EstadoCompletado } from '../components/hoy/EstadoCompletado';
import { BannerDiaEditor } from '../components/hoy/BannerDiaEditor';
import type { Entrada, Rollo, Proyecto } from '../types';
import { guardarEntrada, borrarEntrada, leerEntrada } from '../lib/entradas';
import { diasEntre, esDomingo, formatearHumano, hoyISO } from '../lib/fechas';

interface Props {
  rollo: Rollo;
  onCambio: () => void;
}

export const HoyPage = ({ rollo, onCambio }: Props) => {
  const hoy = hoyISO();
  const numeroPagina = calcularPagina(rollo.fechaInicio, hoy);
  const [entradaHoy, setEntradaHoy] = useState<Entrada | undefined>();
  const [ejercicioId, setEjercicioId] = useState<string | undefined>();
  const [proyecto, setProyecto] = useState<Proyecto | undefined>();
  const [nota, setNota] = useState('');

  useEffect(() => {
    let vivo = true;
    leerEntrada(rollo.id, hoy).then((e) => {
      if (vivo) setEntradaHoy(e);
    });
    return () => {
      vivo = false;
    };
  }, [rollo.id, hoy]);

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
          <div className={styles.rolloTag}>
            Rollo Nº{String(rollo.numero).padStart(2, '0')}
          </div>
        </header>

        {esDomingo(hoy) && <BannerDiaEditor />}

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
    </div>
  );
};

const calcularPagina = (fechaInicio: string, hoy: string): number => {
  const d = diasEntre(fechaInicio, hoy);
  if (d < 0) return 1;
  if (d >= 30) return 30;
  return d + 1;
};
