import styles from './ZRadio.module.scss';
import clsx from 'clsx';
import { useCallback } from 'react';

interface ZRadioProps {
  value: boolean;
  children?: React.ReactNode;
  className?: string;
  onChange?: (newValue: boolean) => void;
}

function ZRadio({ value, children, className, onChange }: ZRadioProps) {
  const handleChange = useCallback(() => {
    !value && onChange && onChange(true);
  }, [onChange, value]);

  return (
    <label className={clsx(styles.label, className)}>
      <input
        className={styles.input}
        type='radio'
        checked={value}
        onChange={handleChange}
      />
      {children}
    </label>
  );
}

export default ZRadio;
