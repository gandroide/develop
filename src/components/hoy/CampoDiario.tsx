import styles from './CampoDiario.module.css';

interface Props {
  valor: string;
  onCambiar: (v: string) => void;
  id?: string;
}

const PLACEHOLDER =
  'Qué salí a buscar · qué encontré que no esperaba · qué imagen me incomodó y por qué';

export const CampoDiario = ({ valor, onCambiar, id = 'diario' }: Props) => {
  return (
    <div className={styles.grupo}>
      <label htmlFor={id} className={styles.etiqueta}>
        Cinco líneas del diario
      </label>
      <textarea
        id={id}
        className={styles.textarea}
        placeholder={PLACEHOLDER}
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
      />
    </div>
  );
};
