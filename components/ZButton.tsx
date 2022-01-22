import styles from './ZButton.module.scss';
import clsx from 'clsx';
import { useCallback } from 'react';

interface ZButtonProps {
  type?: 'primary' | 'transparent' | 'success' | 'danger';
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  suppressHydrationWarning?: boolean;
}

function ZButton({
  children,
  type = 'transparent',
  href,
  icon,
  disabled,
  className,
  onClick,
  suppressHydrationWarning,
}: ZButtonProps) {
  const ButtonTag = href ? 'a' : 'button';

  // 若添加了链接，则点击事件无效
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      return onClick && onClick(e as React.MouseEvent<HTMLButtonElement>);
    },
    [onClick]
  );

  const buttonProps = {
    disabled: !href && disabled,
    onClick: href ? undefined : handleClick,
    href,
    target: '_blank',
    rel: 'noopener',
  };

  return (
    <ButtonTag
      className={clsx(
        styles.btn,
        {
          [styles.primaryColor]: type === 'primary',
          [styles.transparentColor]: type === 'transparent',
          [styles.successColor]: type === 'success',
          [styles.dangerColor]: type === 'danger',
          [styles.disabled]: disabled,
          [styles.withIcon]: children && icon,
          [styles.onlyIcon]: !children && icon,
        },
        className
      )}
      {...buttonProps}
      suppressHydrationWarning={suppressHydrationWarning}
    >
      {icon}
      {children}
    </ButtonTag>
  );
}

export default ZButton;
