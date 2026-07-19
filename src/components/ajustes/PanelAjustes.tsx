import { useEffect, useId, useState } from 'react';
import styles from './PanelAjustes.module.css';
import {
  cancelarRecordatorio,
  iosPWA,
  notificacionesSoportadas,
  pedirPermiso,
  programarRecordatorio,
} from '../../lib/notificaciones';

interface Props {
  horaGuardada: string | undefined;
  onCambiarHora: (hora: string | undefined) => Promise<void>;
}

export const PanelAjustes = ({ horaGuardada, onCambiarHora }: Props) => {
  const idToggle = useId();
  const idHora = useId();
  const [activo, setActivo] = useState<boolean>(Boolean(horaGuardada));
  const [hora, setHora] = useState<string>(horaGuardada ?? '19:00');
  const [aviso, setAviso] = useState<string>('');

  useEffect(() => {
    if (activo && notificacionesSoportadas() && Notification.permission === 'granted') {
      programarRecordatorio(hora);
    }
    return cancelarRecordatorio;
  }, [activo, hora]);

  const alCambiarToggle = async (checked: boolean) => {
    if (checked) {
      const permiso = await pedirPermiso();
      if (permiso !== 'granted') {
        setAviso('Permiso denegado. Los recordatorios quedan desactivados.');
        setActivo(false);
        await onCambiarHora(undefined);
        return;
      }
      setActivo(true);
      setAviso('');
      await onCambiarHora(hora);
    } else {
      setActivo(false);
      cancelarRecordatorio();
      await onCambiarHora(undefined);
    }
  };

  const alCambiarHora = async (h: string) => {
    setHora(h);
    if (activo) await onCambiarHora(h);
  };

  return (
    <section className={styles.panel} aria-label="Ajustes">
      <span className={styles.titulo}>Recordatorio diario</span>
      <div className={styles.fila}>
        <label htmlFor={idToggle} className={styles.etiqueta}>
          Activar aviso
        </label>
        <input
          id={idToggle}
          type="checkbox"
          className={styles.toggle}
          checked={activo}
          onChange={(e) => alCambiarToggle(e.target.checked)}
        />
      </div>
      <div className={styles.fila}>
        <label htmlFor={idHora} className={styles.etiqueta}>
          Hora
        </label>
        <input
          id={idHora}
          type="time"
          className={styles.hora}
          value={hora}
          onChange={(e) => alCambiarHora(e.target.value)}
          disabled={!activo}
        />
      </div>
      {iosPWA() && (
        <p className={styles.aviso}>
          En iOS los avisos locales solo suenan si la app está abierta. Instálala en la pantalla
          de inicio y ábrela al menos una vez al día.
        </p>
      )}
      {!notificacionesSoportadas() && (
        <p className={styles.aviso}>Este navegador no soporta notificaciones locales.</p>
      )}
      {aviso && <p className={styles.aviso}>{aviso}</p>}
    </section>
  );
};
