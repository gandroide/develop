import { useEffect, useState } from 'react';
import styles from './ContactosPage.module.css';
import { HojaContactos } from '../components/contactos/HojaContactos';
import { ResumenRollo } from '../components/contactos/ResumenRollo';
import { ListaEntradas } from '../components/diario/ListaEntradas';
import { calcularRacha } from '../lib/racha';
import { hoyISO } from '../lib/fechas';
import { listarRollos } from '../lib/rollos';
import { entradasPorRollo } from '../lib/entradas';
import type { Entrada, Rollo } from '../types';

interface Props {
  rollo: Rollo;
  entradasActivas: Entrada[];
  onEmpezarSiguiente: () => Promise<void>;
}

export const ContactosPage = ({ rollo, entradasActivas, onEmpezarSiguiente }: Props) => {
  const hoy = hoyISO();
  const [rollos, setRollos] = useState<Rollo[]>([]);
  const [archivados, setArchivados] = useState<Rollo[]>([]);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [entradasArchivado, setEntradasArchivado] = useState<Entrada[]>([]);

  useEffect(() => {
    listarRollos().then((rs) => {
      setRollos(rs);
      setArchivados(rs.filter((r) => r.id !== rollo.id));
    });
  }, [rollo.id]);

  useEffect(() => {
    if (!seleccion) {
      setEntradasArchivado([]);
      return;
    }
    entradasPorRollo(seleccion).then(setEntradasArchivado);
  }, [seleccion]);

  const fechasActivas = entradasActivas.map((e) => e.fecha);
  const racha = calcularRacha(fechasActivas, hoy);
  const completadoTotal = fechasActivas.length >= 30;
  const cuadroReciente = ultimoCuadro(rollo.fechaInicio, fechasActivas, hoy);

  const rolloSeleccionado = seleccion ? rollos.find((r) => r.id === seleccion) : undefined;
  const fechasArchivado = entradasArchivado.map((e) => e.fecha);
  const rachaArchivada = rolloSeleccionado
    ? calcularRacha(fechasArchivado, rolloSeleccionado.fechaCierre ?? hoy)
    : null;

  return (
    <div className={`contenedor ${styles.contenedor}`}>
      <div className={styles.hoja}>
        <header className={styles.encabezado}>
          <div className={styles.filaTitulo}>
            <span className={styles.rotulo}>Hoja de contactos</span>
            <span className={styles.estado}>En curso</span>
          </div>
          <div className={styles.filaCampos}>
            <div className={styles.campo}>
              <span className={styles.campoEtiqueta}>Rollo</span>
              <span className={styles.campoValor}>Nº{String(rollo.numero).padStart(2, '0')}</span>
            </div>
            <div className={styles.campo}>
              <span className={styles.campoEtiqueta}>Inicio</span>
              <span className={styles.campoValor}>{rollo.fechaInicio}</span>
            </div>
            <div className={styles.campo}>
              <span className={styles.campoEtiqueta}>Cierre</span>
              <span className={styles.campoValor}>—</span>
            </div>
          </div>
        </header>

        <HojaContactos
          rollo={rollo}
          fechasCompletadas={fechasActivas}
          hoyIso={hoy}
          cuadroReciente={cuadroReciente}
        />
        <ResumenRollo
          racha={racha.actual}
          maxima={racha.maxima}
          total={racha.totalCompletados}
          completadoTotal={completadoTotal}
          onEmpezarSiguiente={onEmpezarSiguiente}
        />

        {archivados.length > 0 && (
          <section className={styles.archivo} aria-label="Rollos archivados">
            <div className={styles.divisorArchivo}>
              <span className={styles.tabDivisor}>Archivo</span>
            </div>
            {archivados.map((r) => (
              <button
                key={r.id}
                type="button"
                className={styles.rolloArchivado}
                onClick={() => setSeleccion((s) => (s === r.id ? null : r.id))}
                aria-expanded={seleccion === r.id}
              >
                <span className={styles.rolloArchivadoNumero}>Rollo Nº{String(r.numero).padStart(2, '0')}</span>
                <span>{r.fechaInicio} → {r.fechaCierre ?? '—'}</span>
              </button>
            ))}

            {rolloSeleccionado && rachaArchivada && (
              <div className={styles.detalleArchivado}>
                <div className={styles.filaCampos}>
                  <div className={styles.campo}>
                    <span className={styles.campoEtiqueta}>Rollo</span>
                    <span className={styles.campoValor}>Nº{String(rolloSeleccionado.numero).padStart(2, '0')}</span>
                  </div>
                  <div className={styles.campo}>
                    <span className={styles.campoEtiqueta}>Inicio</span>
                    <span className={styles.campoValor}>{rolloSeleccionado.fechaInicio}</span>
                  </div>
                  <div className={styles.campo}>
                    <span className={styles.campoEtiqueta}>Cierre</span>
                    <span className={styles.campoValor}>{rolloSeleccionado.fechaCierre ?? '—'}</span>
                  </div>
                </div>
                <HojaContactos
                  rollo={rolloSeleccionado}
                  fechasCompletadas={fechasArchivado}
                  hoyIso={rolloSeleccionado.fechaCierre ?? hoy}
                />
                <ResumenRollo
                  racha={rachaArchivada.actual}
                  maxima={rachaArchivada.maxima}
                  total={rachaArchivada.totalCompletados}
                  completadoTotal={false}
                  onEmpezarSiguiente={() => {}}
                />
                <div className={styles.entradasArchivado}>
                  <h4 className={styles.tituloEntradas}>Entradas</h4>
                  <ListaEntradas entradas={entradasArchivado} />
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

const ultimoCuadro = (fechaInicio: string, completadas: string[], hoy: string): number | undefined => {
  const set = new Set(completadas);
  if (!set.has(hoy)) return undefined;
  const dias = diasEntre(fechaInicio, hoy);
  return dias >= 0 && dias < 30 ? dias + 1 : undefined;
};

const diasEntre = (aIso: string, bIso: string): number => {
  const MS = 1000 * 60 * 60 * 24;
  const parse = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1).getTime();
  };
  return Math.round((parse(bIso) - parse(aIso)) / MS);
};
