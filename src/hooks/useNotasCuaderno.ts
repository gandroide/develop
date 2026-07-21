import { useCallback, useEffect, useState } from 'react';
import type { NotaCuaderno } from '../types';
import { todasLasNotas } from '../lib/cuaderno';

export const useNotasCuaderno = (): {
  notas: NotaCuaderno[];
  cargando: boolean;
  refrescar: () => Promise<void>;
} => {
  const [notas, setNotas] = useState<NotaCuaderno[]>([]);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    const ns = await todasLasNotas();
    setNotas(ns);
    setCargando(false);
  }, []);

  useEffect(() => {
    void refrescar();
  }, [refrescar]);

  return { notas, cargando, refrescar };
};
