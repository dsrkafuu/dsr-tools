import styles from './ZButton.module.scss';
import clsx from 'clsx';
import { useCallback } from 'react';

interface ZButtonProps {
  type?: 'primary' | 'transparent' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  [key: string]: unknown;
}

function ZButton({
  children,
  type = 'transparent',
  size = 'medium',
  href,
  icon,
  disabled,
  className,
  onClick,
  ...props
}: ZButtonProps) {
  const ButtonTag = href ? 'a' : 'button';

  // 若添加了链接，则点击事件无效
  const handleClick = useCallback<
    (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  >(
    (e) => {
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
          [styles.smallSize]: size === 'small',
          [styles.mediumSize]: size === 'medium',
          [styles.largeSize]: size === 'large',
          [styles.disabled]: disabled,
          [styles.withIcon]: children && icon,
          [styles.onlyIcon]: !children && icon,
        },
        className
      )}
      {...buttonProps}
      {...props}
    >
      {icon}
      {children}
    </ButtonTag>
  );
}

export default ZButton;