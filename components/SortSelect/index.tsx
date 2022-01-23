import { useState } from 'react';
import { CaretUpOutline, CaretDownOutline } from 'react-ionicons';
import styles from './SortSelect.module.scss'

export default function SortSelect(props) {
  const { options, style, onSelect } = props;

  const [ showDropdown, setShowDropdown ] = useState<boolean>(false);
  const [ selectedOption, setSelectedOption ] = useState<any>(options[0]);

  const handleOptionSelect = option => {
    if (option.value === undefined) {
      setSelectedOption(options[0]);
    } else {
      setSelectedOption(option);
    }

    if (onSelect) {
      onSelect(option);
    }

    setShowDropdown(false);
  }
  
  return (
    <div className={showDropdown ? `${styles.select} ${styles.selectOpen}` : styles.select} style={style}>
      <div className={styles.input} onClick={() => setShowDropdown(!showDropdown)}>
        Sort: {selectedOption.label}
        {selectedOption.dir === 'asc' ? (
          <CaretUpOutline cssClasses={styles.icon} width="18px" height="18px" color="#316760" />
        ) : (
          <CaretDownOutline cssClasses={styles.icon} width="18px" height="18px" color="#316760" />
        )}
      </div>
      {showDropdown && (
        <ul className={styles.list}>
          {options.map((option, i) => (
            <li key={i} onClick={() => handleOptionSelect(option)}>{option.label}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
