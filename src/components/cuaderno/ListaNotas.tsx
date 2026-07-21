import { useMemo, useState } from 'react';
import styles from './ListaNotas.module.css';
import type { NotaCuaderno, Proyecto, TipoNota } from '../../types';

interface Props {
  notas: NotaCuaderno[];
  onEditar: (nota: NotaCuaderno) => Promise<void>;
  onBorrar: (id: string) => Promise<void>;
}

interface Grupo {
  clave: string;
  titulo: string;
  notas: NotaCuaderno[];
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const TIPO_ETIQUETA: Record<TipoNota, string> = {
  'idea-de-foto': 'Idea de foto',
  pensamiento: 'Pensamiento',
  referencia: 'Referencia',
};

const PROYECTO_ETIQUETA: Record<Proyecto, string> = {
  cueva: 'Cueva',
  madre: 'Madre',
  otro: 'Otro',
};

const formatearMes = (iso: string): { clave: string; titulo: string } => {
  const d = new Date(iso);
  const clave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const titulo = `${MESES[d.getMonth()]} ${d.getFullYear()}`;
  return { clave, titulo };
};

const formatearFechaCorta = (iso: string): string => {
  const d = new Date(iso);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const hora = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dia}/${mes} · ${hora}:${min}`;
};

export const ListaNotas = ({ notas, onEditar, onBorrar }: Props) => {
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [textoEdicion, setTextoEdicion] = useState('');

  const grupos = useMemo<Grupo[]>(() => {
    const ordenadas = [...notas].sort((a, b) => b.creadaEn.localeCompare(a.creadaEn));
    const mapa = new Map<string, Grupo>();
    for (const n of ordenadas) {
      const { clave, titulo } = formatearMes(n.creadaEn);
      const g = mapa.get(clave) ?? { clave, titulo, notas: [] };
      g.notas.push(n);
      mapa.set(clave, g);
    }
    return [...mapa.values()];
  }, [notas]);

  if (notas.length === 0) {
    return <p className={styles.vacio}>Sin notas todavía</p>;
  }

  const empezarEdicion = (n: NotaCuaderno) => {
    setEditandoId(n.id);
    setTextoEdicion(n.texto);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setTextoEdicion('');
  };

  const guardarEdicion = async (n: NotaCuaderno) => {
    const limpio = textoEdicion.trim();
    if (!limpio) return;
    await onEditar({ ...n, texto: limpio });
    cancelarEdicion();
  };

  const confirmarBorrado = async (id: string) => {
    if (!window.confirm('¿Borrar esta nota?')) return;
    await onBorrar(id);
  };

  return (
    <div className={styles.contenedor}>
      {grupos.map((g) => (
        <section key={g.clave} className={styles.grupo} aria-labelledby={`mes-${g.clave}`}>
          <h3 id={`mes-${g.clave}`} className={styles.mesTitulo}>{g.titulo}</h3>
          <ol className={styles.lista}>
            {g.notas.map((n) => (
              <li key={n.id} className={styles.nota}>
                <div className={styles.metaFila}>
                  <span className={styles.fecha}>{formatearFechaCorta(n.creadaEn)}</span>
                  <span className={styles.chipsMeta}>
                    {n.tipo && <span className={styles.chipMeta}>{TIPO_ETIQUETA[n.tipo]}</span>}
                    {n.proyecto && <span className={styles.chipMeta}>{PROYECTO_ETIQUETA[n.proyecto]}</span>}
                  </span>
                </div>
                {editandoId === n.id ? (
                  <div className={styles.edicion}>
                    <textarea
                      className={styles.textareaEdicion}
                      value={textoEdicion}
                      onChange={(e) => setTextoEdicion(e.target.value)}
                      autoFocus
                    />
                    <div className={styles.acciones}>
                      <button type="button" className={styles.accion} onClick={cancelarEdicion}>
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className={`${styles.accion} ${styles.accionPrim}`}
                        onClick={() => void guardarEdicion(n)}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={styles.texto}>{n.texto}</p>
                    <div className={styles.acciones}>
                      <button type="button" className={styles.accion} onClick={() => empezarEdicion(n)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`${styles.accion} ${styles.accionRojo}`}
                        onClick={() => void confirmarBorrado(n.id)}
                      >
                        Borrar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
};
