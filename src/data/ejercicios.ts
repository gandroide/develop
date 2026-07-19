import type { Ejercicio } from '../types';

// Los ids son estables — se guardan en cada entrada del diario. No renombrar.
export const EJERCICIOS: Ejercicio[] = [
  {
    id: 'lista-de-tomas',
    nombre: 'La lista de tomas',
    origen: 'Método Alec Soth',
    resumen: 'Escribe 15 fotos que imaginas que tu proyecto necesita. Empieza por la más fácil.',
    detalle:
      'Antes de fotografiar, escribe una lista de 15 tomas que imaginas que el proyecto necesita: "sus manos haciendo X", "la silla vacía", "la luz del cuarto a las 4pm". No importa si luego no haces ninguna: la lista mata la parálisis de no saber qué fotografiar y te da permiso de empezar por la más fácil.',
  },
  {
    id: 'objeto-30-formas',
    nombre: 'Un objeto, 30 formas',
    origen: 'Ejercicio clásico de escuela',
    resumen: 'Un objeto cargado emocionalmente, 30 fotos distintas en una semana.',
    detalle:
      'Elige UN objeto de tu casa cargado emocionalmente y hazle 30 fotos distintas en una semana: distancia, luz, hora, contexto, fuera de foco, reflejado. Entrena la variación sobre el motivo — Fukase en la práctica — sin salir de casa.',
  },
  {
    id: 'extrano-en-tu-casa',
    nombre: 'El extraño en tu casa',
    origen: 'Mirada forense',
    resumen: 'Fotografía tu casa como si dedujeras quién vive ahí y qué siente. Sin personas.',
    detalle:
      'Fotografía tu propia casa como un forense que llegó después de que algo pasó: solo huellas, rastros, ausencias. Prohibido fotografiar personas. Entrenamiento directo para una estética de la insinuación.',
  },
  {
    id: 'peor-foto',
    nombre: 'Peor foto a propósito',
    origen: 'Anti-curador',
    resumen: 'Sal con la misión explícita de hacer fotos malas. El juez interno se queda sin trabajo.',
    detalle:
      'Un día a la semana, sal (aunque sea al patio) a hacer fotos deliberadamente malas: aburridas, torcidas, banales. Cuando el objetivo es fallar, el crítico interno no tiene nada que juzgar — y entre las fotos "malas" aparecen las más libres que has hecho en meses.',
  },
  {
    id: 'cueva-por-capas',
    nombre: 'La cueva por capas',
    origen: 'Misiones separadas',
    resumen: 'Tres visitas, tres misiones: solo luz, solo texturas, solo escala.',
    detalle:
      'Tres visitas a la cueva, cada una con una sola misión. Visita 1: solo luz (de dónde entra, qué toca). Visita 2: solo texturas y superficies. Visita 3: solo escala (lo diminuto, lo enorme, el cuerpo como medida). Dividir la mirada impide el "no sé qué hacer aquí" y te obliga a agotar el lugar en vez de repetir la primera impresión.',
  },
  {
    id: 'diez-sin-ver',
    nombre: 'Diez fotos sin ver',
    origen: 'Confiar en el proceso',
    resumen: '10 fotos por intuición. No las mires hasta el domingo.',
    detalle:
      'Configura la cámara, haz 10 fotos siguiendo solo intuición, y no las revises hasta el día del editor. Separa físicamente al fotógrafo del crítico: cada uno trabaja en su propio día.',
  },
  {
    id: 'palabras-primero',
    nombre: 'Fotografiar con palabras primero',
    origen: 'Escritura → disparo',
    resumen: 'Escribe media página sobre la escena. Luego fotografía lo que escribiste.',
    detalle:
      'Antes de una sesión (con tu madre, por ejemplo), escribe media página: cómo es la luz donde ella está, qué hace con las manos, qué sonido hay. Luego fotografía lo que escribiste. La sesión se vuelve traducción en vez de invención desde cero.',
  },
];

export const ejercicioPorId = (id: string): Ejercicio | undefined =>
  EJERCICIOS.find((e) => e.id === id);
