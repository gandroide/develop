import { useCallback, useEffect, useState } from 'react';
import type { Entrada } from '../types';
import { entradasPorRollo } from '../lib/entradas';

export const useEntradasRollo = (rolloId: string | undefined): {
  entradas: Entrada[];
  cargando: boolean;
  refrescar: () => Promise<void>;
} => {
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    if (!rolloId) {
      setEntradas([]);
      setCargando(false);
      return;
    }
    const es = await entradasPorRollo(rolloId);
    setEntradas(es);
    setCargando(false);
  }, [rolloId]);

  useEffect(() => {
    void refrescar();
  }, [refrescar]);

  return { entradas, cargando, refrescar };
};
