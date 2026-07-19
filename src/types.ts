export type Proyecto = 'cueva' | 'madre' | 'otro';

export type TabId = 'hoy' | 'contactos' | 'ejercicios' | 'diario';

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

export interface Respaldo {
  version: 1;
  exportadoEn: string;
  rollos: Rollo[];
  entradas: Entrada[];
  config: Config;
}
