import styles from './ZTextArea.module.scss';
import clsx from 'clsx';

interface ZTextAreaProps {
  value: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function ZTextArea({ value, className, onChange }: ZTextAreaProps) {
  return (
    <textarea
      className={clsx(styles.textarea, className)}
      value={value}
      onChange={onChange}
    ></textarea>
  );
}

export default ZTextArea;
