import styles from './Checkbox.module.scss';

type Checkbox = {
  name: string;
  label: string;
  className: string;
  onChange?: (e) => void;
}

const Checkbox: React.FC<Checkbox> = (props) => {
  const { name, label, className, onChange } = props;

  return (
    <div className={className ? `${styles.checkbox} ${className}` : styles.checkbox}>
      <input id={name} type="checkbox" className={styles.input} onChange={onChange} />
      <label htmlFor={name} className={styles.label}>{label}</label>
    </div>
  )
}

export default Checkbox;