export type Proyecto = 'cueva' | 'madre' | 'otro';

export type TabId = 'hoy' | 'contactos' | 'ejercicios' | 'diario' | 'cuaderno';

export type TipoNota = 'idea-de-foto' | 'pensamiento' | 'referencia';

export interface Ejercicio {
  id: string;
  nombre: string;
  origen: string;
  resumen: string;
  detalle: string;
}

export interface Rollo {
  id: string;
  numero: number;
  fechaInicio: string;
  fechaCierre?: string;
}

export interface Entrada {
  fecha: string;
  rolloId: string;
  ejercicioId: string;
  nota: string;
  proyecto?: Proyecto;
  creadoEn: string;
}

export interface Config {
  rolloActivoId: string;
  recordatorioHora?: string;
}

export interface NotaCuaderno {
  id: string;
  creadaEn: string;
  texto: string;
  proyecto?: Proyecto;
  tipo?: TipoNota;
}

export interface Respaldo {
  version: 2;
  exportadoEn: string;
  rollos: Rollo[];
  entradas: Entrada[];
  notasCuaderno: NotaCuaderno[];
  config: Config;
}
