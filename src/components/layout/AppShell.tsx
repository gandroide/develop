import type { ReactNode } from 'react';
import styles from './AppShell.module.css';
import { EtiquetaRollo } from './EtiquetaRollo';
import type { Rollo } from '../../types';

interface Props {
  rollo: Rollo | undefined;
  children: ReactNode;
}

export const AppShell = ({ rollo, children }: Props) => {
  return (
    <div className={styles.shell}>
      <header className={styles.encabezado}>
        <div className={styles.encabezadoInterno}>
          <h1 className={styles.titulo}>Revelado</h1>
          {rollo && <EtiquetaRollo rollo={rollo} />}
        </div>
      </header>
      <main className={styles.principal}>{children}</main>
    </div>
  );
};
