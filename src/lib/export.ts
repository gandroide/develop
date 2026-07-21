import type { Entrada, NotaCuaderno, Respaldo, Rollo, Config } from '../types';
import { ejercicioPorId } from '../data/ejercicios';
import { formatearHumano } from './fechas';

const TIPO_ETIQUETA: Record<NonNullable<NotaCuaderno['tipo']>, string> = {
  'idea-de-foto': 'Idea de foto',
  pensamiento: 'Pensamiento',
  referencia: 'Referencia',
};

export const generarMarkdown = (
  entradas: Entrada[],
  rollos: Rollo[],
  notas: NotaCuaderno[] = [],
): string => {
  const porRollo = new Map<string, Entrada[]>();
  for (const e of entradas) {
    const arr = porRollo.get(e.rolloId) ?? [];
    arr.push(e);
    porRollo.set(e.rolloId, arr);
  }
  const rollosOrdenados = [...rollos].sort((a, b) => a.numero - b.numero);
  const secciones: string[] = ['# Diario Revelado', ''];
  for (const rollo of rollosOrdenados) {
    const items = (porRollo.get(rollo.id) ?? []).slice().sort((a, b) => a.fecha.localeCompare(b.fecha));
    secciones.push(`## Rollo Nº${rollo.numero}`);
    secciones.push('');
    secciones.push(
      `_Inicio: ${rollo.fechaInicio}${rollo.fechaCierre ? ` · Cierre: ${rollo.fechaCierre}` : ' · en curso'}_`,
    );
    secciones.push('');
    for (const e of items) {
      const ej = ejercicioPorId(e.ejercicioId);
      secciones.push(`### ${e.fecha} — ${formatearHumano(e.fecha)}`);
      secciones.push('');
      secciones.push(`- **Ejercicio:** ${ej?.nombre ?? e.ejercicioId}`);
      if (e.proyecto) secciones.push(`- **Proyecto:** ${e.proyecto}`);
      secciones.push('');
      secciones.push(e.nota.trim() || '_(sin nota)_');
      secciones.push('');
    }
  }
  if (notas.length > 0) {
    secciones.push('## Cuaderno');
    secciones.push('');
    const ordenadas = [...notas].sort((a, b) => a.creadaEn.localeCompare(b.creadaEn));
    for (const n of ordenadas) {
      const fecha = n.creadaEn.slice(0, 10);
      const meta: string[] = [];
      if (n.tipo) meta.push(TIPO_ETIQUETA[n.tipo]);
      if (n.proyecto) meta.push(n.proyecto);
      const cabecera = meta.length > 0 ? `${fecha} · ${meta.join(' · ')}` : fecha;
      secciones.push(`### ${cabecera}`);
      secciones.push('');
      secciones.push(n.texto.trim() || '_(sin texto)_');
      secciones.push('');
    }
  }
  return secciones.join('\n');
};

export const generarRespaldo = (
  entradas: Entrada[],
  rollos: Rollo[],
  notasCuaderno: NotaCuaderno[],
  config: Config,
): Respaldo => ({
  version: 2,
  exportadoEn: new Date().toISOString(),
  entradas,
  rollos,
  notasCuaderno,
  config,
});

export const serializarRespaldo = (respaldo: Respaldo): string =>
  JSON.stringify(respaldo, null, 2);

export const parsearRespaldo = (json: string): Respaldo => {
  const data = JSON.parse(json);
  if (!data || typeof data !== 'object') throw new Error('Respaldo inválido: no es un objeto.');
  if (data.version !== 1 && data.version !== 2) {
    throw new Error(`Respaldo inválido: versión ${data.version} desconocida.`);
  }
  if (!Array.isArray(data.entradas)) throw new Error('Respaldo inválido: entradas ausentes.');
  if (!Array.isArray(data.rollos)) throw new Error('Respaldo inválido: rollos ausentes.');
  if (!data.config || typeof data.config !== 'object') throw new Error('Respaldo inválido: config ausente.');
  const notasCuaderno: NotaCuaderno[] = Array.isArray(data.notasCuaderno) ? data.notasCuaderno : [];
  return {
    version: 2,
    exportadoEn: data.exportadoEn ?? new Date().toISOString(),
    entradas: data.entradas,
    rollos: data.rollos,
    notasCuaderno,
    config: data.config,
  };
};
