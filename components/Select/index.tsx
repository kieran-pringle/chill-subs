import { useState } from 'react';
import styles from './Select.module.css'

export default function Select(props) {
  const { options, placeholder, style, onSelect } = props;

  const [ showDropdown, setShowDropdown ] = useState<boolean>(false);
  const [ selectedOption, setSelectedOption ] = useState<any>(placeholder);

  const handleOptionSelect = option => {
    if (option.value === undefined) {
      setSelectedOption(placeholder);
    } else {
      setSelectedOption(option.title);
    }

    if (onSelect) {
      onSelect(option);
    }

    setShowDropdown(false);
  }
  

  return (
    <div className={showDropdown ? `${styles.select} ${styles.selectOpen}` : styles.select} style={style}>
      <div className={styles.input} onClick={() => setShowDropdown(!showDropdown)}>{selectedOption}</div>
      {showDropdown && (
        <ul className={styles.list}>
          {options.map((option, i) => (
            <li key={i} onClick={() => handleOptionSelect(option)}>{option.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
