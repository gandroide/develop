import type { TabId } from '../../types';
import styles from './BottomTabBar.module.css';

interface Props {
  activo: TabId;
  onCambiar: (id: TabId) => void;
  hoyMarcado: boolean;
}

const TABS: { id: TabId; etiqueta: string; numero: string }[] = [
  { id: 'hoy', etiqueta: 'Hoy', numero: '01' },
  { id: 'contactos', etiqueta: 'Contactos', numero: '02' },
  { id: 'ejercicios', etiqueta: 'Ejercicios', numero: '03' },
  { id: 'diario', etiqueta: 'Diario', numero: '04' },
];

export const BottomTabBar = ({ activo, onCambiar, hoyMarcado }: Props) => {
  return (
    <nav className={styles.barra} aria-label="Navegación principal">
      <ul className={styles.lista} role="tablist">
        {TABS.map((t) => {
          const esActivo = t.id === activo;
          return (
            <li key={t.id} role="none">
              <button
                type="button"
                role="tab"
                aria-selected={esActivo}
                className={`${styles.tab} ${esActivo ? styles.tabActivo : ''}`}
                onClick={() => onCambiar(t.id)}
              >
                <span className={styles.numero} aria-hidden="true">{t.numero}</span>
                <span>{t.etiqueta}</span>
                {t.id === 'hoy' && hoyMarcado && <span className={styles.punto} aria-hidden="true" />}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
