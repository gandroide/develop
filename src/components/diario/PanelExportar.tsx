import { useMemo, useRef, useState } from 'react';
import styles from './PanelExportar.module.css';
import type { Entrada, Rollo, Config } from '../../types';
import {
  generarMarkdown,
  generarRespaldo,
  serializarRespaldo,
  parsearRespaldo,
} from '../../lib/export';
import { PreviewExport } from './PreviewExport';

interface Props {
  entradas: Entrada[];
  rollos: Rollo[];
  config: Config;
  onImportar: (json: string) => Promise<void>;
}

type Formato = 'md' | 'json';

interface Preview {
  formato: Formato;
  titulo: string;
  nombre: string;
  mime: string;
  contenido: string;
}

export const PanelExportar = ({ entradas, rollos, config, onImportar }: Props) => {
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [mensaje, setMensaje] = useState<string>('');
  const [preview, setPreview] = useState<Preview | null>(null);

  const contenidoMd = useMemo(() => generarMarkdown(entradas, rollos), [entradas, rollos]);
  const contenidoJson = useMemo(
    () => serializarRespaldo(generarRespaldo(entradas, rollos, config)),
    [entradas, rollos, config],
  );

  const descargar = (nombre: string, mime: string, contenido: string) => {
    const blob = new Blob([contenido], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  };

  const abrirPreviewMd = () => {
    setPreview({
      formato: 'md',
      titulo: 'Vista previa · Markdown',
      nombre: 'revelado-diario.md',
      mime: 'text/markdown',
      contenido: contenidoMd,
    });
  };

  const abrirPreviewJson = () => {
    setPreview({
      formato: 'json',
      titulo: 'Vista previa · Respaldo JSON',
      nombre: 'revelado-respaldo.json',
      mime: 'application/json',
      contenido: contenidoJson,
    });
  };

  const confirmarDescarga = () => {
    if (!preview) return;
    descargar(preview.nombre, preview.mime, preview.contenido);
    setPreview(null);
  };

  const abrirImport = () => inputFile.current?.click();

  const alSeleccionarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const texto = await file.text();
    try {
      parsearRespaldo(texto);
      await onImportar(texto);
      setMensaje('Importado.');
    } catch (err) {
      setMensaje(err instanceof Error ? err.message : 'Error al importar.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <section className={styles.panel} aria-label="Exportar e importar">
      <span className={styles.titulo}>Respaldo</span>
      <div className={styles.botones}>
        <button type="button" className={styles.boton} onClick={abrirPreviewMd}>
          Previsualizar .md
        </button>
        <button type="button" className={styles.boton} onClick={abrirPreviewJson}>
          Previsualizar .json
        </button>
        <button type="button" className={`${styles.boton} ${styles.botonRojo}`} onClick={abrirImport}>
          Importar respaldo
        </button>
        <input
          ref={inputFile}
          type="file"
          accept="application/json"
          className="sr-only"
          onChange={alSeleccionarArchivo}
          aria-label="Archivo de respaldo"
        />
      </div>
      {mensaje && <span className={styles.mensaje}>{mensaje}</span>}
      <PreviewExport
        abierto={preview !== null}
        titulo={preview?.titulo ?? ''}
        nombreArchivo={preview?.nombre ?? ''}
        contenido={preview?.contenido ?? ''}
        onDescargar={confirmarDescarga}
        onCerrar={() => setPreview(null)}
      />
    </section>
  );
};
