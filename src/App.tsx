import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { BottomTabBar } from './components/layout/BottomTabBar';
import { UpdatePrompt } from './components/layout/UpdatePrompt';
import { HoyPage } from './pages/HoyPage';
import { ContactosPage } from './pages/ContactosPage';
import { EjerciciosPage } from './pages/EjerciciosPage';
import { DiarioPage } from './pages/DiarioPage';
import { useRolloActivo } from './hooks/useRolloActivo';
import { useTodasEntradas } from './hooks/useTodasEntradas';
import { useConfig } from './hooks/useConfig';
import { useRegisterSW } from './hooks/useRegisterSW';
import { listarRollos } from './lib/rollos';
import { hoyISO } from './lib/fechas';
import { getDB, escribirConfig } from './lib/db';
import { parsearRespaldo } from './lib/export';
import type { Rollo, TabId } from './types';

export const App = () => {
  const { rollo, cargando: cargandoRollo, archivarYAvanzar, refrescar: refrescarRollo } = useRolloActivo();
  const { entradas, refrescar: refrescarEntradas } = useTodasEntradas();
  const { config, actualizar: actualizarConfig } = useConfig();
  const { necesitaActualizar, actualizar } = useRegisterSW();

  const [tab, setTab] = useState<TabId>('hoy');
  const [rollos, setRollos] = useState<Rollo[]>([]);

  useEffect(() => {
    listarRollos().then(setRollos);
  }, [rollo?.id]);

  const entradasActivas = useMemo(
    () => (rollo ? entradas.filter((e) => e.rolloId === rollo.id) : []),
    [entradas, rollo],
  );

  const hoyMarcado = useMemo(() => {
    const hoy = hoyISO();
    return entradasActivas.some((e) => e.fecha === hoy);
  }, [entradasActivas]);

  const cambio = useCallback(async () => {
    await refrescarEntradas();
  }, [refrescarEntradas]);

  const importar = useCallback(async (json: string) => {
    const respaldo = parsearRespaldo(json);
    const db = await getDB();
    const tx = db.transaction(['entradas', 'rollos', 'config'], 'readwrite');
    await tx.objectStore('entradas').clear();
    await tx.objectStore('rollos').clear();
    for (const r of respaldo.rollos) await tx.objectStore('rollos').put(r);
    for (const e of respaldo.entradas) await tx.objectStore('entradas').put(e);
    await tx.done;
    await escribirConfig(respaldo.config);
    await refrescarRollo();
    await refrescarEntradas();
  }, [refrescarRollo, refrescarEntradas]);

  const empezarSiguiente = useCallback(async () => {
    await archivarYAvanzar();
    await refrescarEntradas();
  }, [archivarYAvanzar, refrescarEntradas]);

  const cambiarHora = useCallback(
    async (hora: string | undefined) => {
      await actualizarConfig({ recordatorioHora: hora });
    },
    [actualizarConfig],
  );

  if (cargandoRollo || !rollo || !config) {
    return (
      <div className="contenedor">
        <p className="etiqueta">Revelando…</p>
      </div>
    );
  }

  return (
    <AppShell rollo={rollo}>
      {tab === 'hoy' && <HoyPage rollo={rollo} onCambio={cambio} />}
      {tab === 'contactos' && (
        <ContactosPage
          rollo={rollo}
          entradasActivas={entradasActivas}
          onEmpezarSiguiente={empezarSiguiente}
        />
      )}
      {tab === 'ejercicios' && <EjerciciosPage />}
      {tab === 'diario' && (
        <DiarioPage
          entradas={entradas}
          rollos={rollos}
          config={config}
          onImportar={importar}
          onCambiarHora={cambiarHora}
        />
      )}
      <BottomTabBar activo={tab} onCambiar={setTab} hoyMarcado={hoyMarcado} />
      <UpdatePrompt visible={necesitaActualizar} onActualizar={actualizar} />
    </AppShell>
  );
};
