import type { Entrada, Respaldo, Rollo, Config } from '../types';
import { ejercicioPorId } from '../data/ejercicios';
import { formatearHumano } from './fechas';

export const generarMarkdown = (entradas: Entrada[], rollos: Rollo[]): string => {
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
  return secciones.join('\n');
};

export const generarRespaldo = (
  entradas: Entrada[],
  rollos: Rollo[],
  config: Config,
): Respaldo => ({
  version: 1,
  exportadoEn: new Date().toISOString(),
  entradas,
  rollos,
  config,
});

export const serializarRespaldo = (respaldo: Respaldo): string =>
  JSON.stringify(respaldo, null, 2);

export const parsearRespaldo = (json: string): Respaldo => {
  const data = JSON.parse(json);
  if (!data || typeof data !== 'object') throw new Error('Respaldo inválido: no es un objeto.');
  if (data.version !== 1) throw new Error(`Respaldo inválido: versión ${data.version} desconocida.`);
  if (!Array.isArray(data.entradas)) throw new Error('Respaldo inválido: entradas ausentes.');
  if (!Array.isArray(data.rollos)) throw new Error('Respaldo inválido: rollos ausentes.');
  if (!data.config || typeof data.config !== 'object') throw new Error('Respaldo inválido: config ausente.');
  return data as Respaldo;
};
