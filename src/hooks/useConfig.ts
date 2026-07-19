import { useCallback, useEffect, useState } from 'react';
import type { Config } from '../types';
import { leerConfig, escribirConfig } from '../lib/db';

export const useConfig = (): {
  config: Config | undefined;
  cargando: boolean;
  actualizar: (parche: Partial<Config>) => Promise<void>;
} => {
  const [config, setConfig] = useState<Config | undefined>();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vivo = true;
    leerConfig().then((c) => {
      if (vivo) {
        setConfig(c);
        setCargando(false);
      }
    });
    return () => {
      vivo = false;
    };
  }, []);

  const actualizar = useCallback(
    async (parche: Partial<Config>) => {
      const base = config ?? { rolloActivoId: '' };
      const nuevo: Config = { ...base, ...parche };
      await escribirConfig(nuevo);
      setConfig(nuevo);
    },
    [config],
  );

  return { config, cargando, actualizar };
};
