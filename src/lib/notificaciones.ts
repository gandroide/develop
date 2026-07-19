export const notificacionesSoportadas = (): boolean =>
  typeof window !== 'undefined' && 'Notification' in window;

export const iosPWA = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua);
};

export const pedirPermiso = async (): Promise<NotificationPermission> => {
  if (!notificacionesSoportadas()) return 'denied';
  if (Notification.permission !== 'default') return Notification.permission;
  return Notification.requestPermission();
};

let timerId: number | undefined;

const msHastaProximoDisparo = (horaHHMM: string, ahora: Date = new Date()): number => {
  const [h, m] = horaHHMM.split(':').map(Number);
  const objetivo = new Date(ahora);
  objetivo.setHours(h ?? 0, m ?? 0, 0, 0);
  if (objetivo.getTime() <= ahora.getTime()) {
    objetivo.setDate(objetivo.getDate() + 1);
  }
  return objetivo.getTime() - ahora.getTime();
};

export const programarRecordatorio = (horaHHMM: string): void => {
  cancelarRecordatorio();
  if (!notificacionesSoportadas() || Notification.permission !== 'granted') return;
  const ms = msHastaProximoDisparo(horaHHMM);
  timerId = window.setTimeout(() => {
    disparar();
    programarRecordatorio(horaHHMM);
  }, ms);
};

export const cancelarRecordatorio = (): void => {
  if (timerId !== undefined) {
    clearTimeout(timerId);
    timerId = undefined;
  }
};

const disparar = (): void => {
  try {
    new Notification('Revelado', {
      body: 'Un cuadro más en la hoja de contactos.',
      icon: '/icons/icon-192.svg',
      tag: 'recordatorio-diario',
    });
  } catch {
    // iOS antiguo o Safari: silenciar.
  }
};
