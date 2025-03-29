import { forwardRef, useEffect, useState } from 'react';
import { InputNumber, InputNumberProps, Skeleton } from 'antd';
import './style.less';

interface MyInputProps extends InputNumberProps {
  className?: string;
  blur?: () => void;
  placeholder?: string;
  loading?: boolean;
  onChange?: any;
  formatter?: any;
}

const MyInputNumber = forwardRef<HTMLInputElement, MyInputProps>(
  (
    {
      value,
      onChange,
      className = '',
      placeholder = 'Enter',
      blur,
      formatter,
      loading = false,
      ...rest
    },
    ref
  ) => {
    const [showSkeleton, setShowSkeleton] = useState(loading);
    useEffect(() => {
      if (loading) {
        setShowSkeleton(true);
      } else {
        const timeout = setTimeout(() => {
          setShowSkeleton(false);
        }, 100);
        return () => clearTimeout(timeout);
      }
    }, [loading]);
    return (
      <div className={`my-input-container`}>
        <Skeleton.Input
          active
          size="small"
          className={`my-skeleton-input ${className}`}
          style={{
            opacity: showSkeleton ? 1 : 0,
          }}
        />
        <InputNumber
          ref={ref}
          value={value}
          onChange={onChange}
          formatter={formatter}
          className={`my-input ${className}`}
          placeholder={placeholder}
          style={{
            width: '100%',
            opacity: showSkeleton ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
          {...rest}
        />
      </div>
    );
  }
);

export default MyInputNumber;
