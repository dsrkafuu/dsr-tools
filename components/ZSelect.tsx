import styles from './ZSelect.module.scss';
import clsx from 'clsx';

interface ZSelectProps {
  value: string;
  options: string[];
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function ZSelect({ value, options, className, onChange }: ZSelectProps) {
  return (
    <div className={clsx(styles.select, className)}>
      <select className={styles.selectInner} value={value} onChange={onChange}>
        {options.map((option) => (
          <option className={styles.option} key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ZSelect;
