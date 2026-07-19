import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export const useRegisterSW = (): {
  necesitaActualizar: boolean;
  actualizar: () => void;
} => {
  const [necesitaActualizar, setNecesitaActualizar] = useState(false);
  const [actualizar, setActualizar] = useState<() => void>(() => () => {});

  useEffect(() => {
    const update = registerSW({
      onNeedRefresh() {
        setNecesitaActualizar(true);
      },
      onOfflineReady() {
        // primera carga cacheada — no requiere UI.
      },
    });
    setActualizar(() => () => {
      void update(true);
      setNecesitaActualizar(false);
    });
  }, []);

  return { necesitaActualizar, actualizar };
};
