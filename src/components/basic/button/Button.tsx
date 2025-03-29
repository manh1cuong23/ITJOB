import React, { forwardRef } from 'react';
import { Button, ButtonProps } from 'antd';
import './style.less';

/** Các kiểu button */
export type ButtonType = 'primary' | 'secondary' | 'outline';
export type ButtonState = 'default' | 'hover' | 'selected' | 'disabled';

interface MyButtonProps extends ButtonProps {
  buttonType?: ButtonType;
  buttonState?: ButtonState;
  className?: string;
}

const MyButton = forwardRef<HTMLButtonElement, MyButtonProps>((props, ref) => {
  const {
    buttonType = 'primary',
    buttonState = 'default',
    disabled,
    className,
    ...rest
  } = props;

  /** Tạo class name dựa trên các thuộc tính */
  const getClassNames = () => {
    const baseClass = 'my-button';
    const typeClass = `${buttonType}-button`;
    const stateClass = buttonState !== 'default' ? `${buttonState}` : '';

    return `${baseClass} ${typeClass} ${stateClass} ${className || ''}`.trim();
  };

  return (
    <Button
      ref={ref}
      className={getClassNames()}
      disabled={disabled}
      {...rest}
    />
  );
});

/** Đặt tên displayName để thuận tiện cho việc debug */
MyButton.displayName = 'MyButton';

export default MyButton;
