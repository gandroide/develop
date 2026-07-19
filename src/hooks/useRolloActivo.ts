import { useCallback, useEffect, useState } from 'react';
import type { Rollo } from '../types';
import { rolloActivo, archivarRolloYCrearSiguiente } from '../lib/rollos';

export const useRolloActivo = (): {
  rollo: Rollo | undefined;
  cargando: boolean;
  archivarYAvanzar: () => Promise<void>;
  refrescar: () => Promise<void>;
} => {
  const [rollo, setRollo] = useState<Rollo | undefined>();
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    const r = await rolloActivo();
    setRollo(r);
    setCargando(false);
  }, []);

  useEffect(() => {
    void refrescar();
  }, [refrescar]);

  const archivarYAvanzar = useCallback(async () => {
    await archivarRolloYCrearSiguiente();
    await refrescar();
  }, [refrescar]);

  return { rollo, cargando, archivarYAvanzar, refrescar };
};
