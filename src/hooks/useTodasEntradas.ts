import { useCallback, useEffect, useState } from 'react';
import type { Entrada } from '../types';
import { todasLasEntradas } from '../lib/entradas';

export const useTodasEntradas = (): {
  entradas: Entrada[];
  cargando: boolean;
  refrescar: () => Promise<void>;
} => {
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    const es = await todasLasEntradas();
    setEntradas(es);
    setCargando(false);
  }, []);

  useEffect(() => {
    void refrescar();
  }, [refrescar]);

  return { entradas, cargando, refrescar };
};
