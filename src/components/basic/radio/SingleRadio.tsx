import { FC, useEffect, useState } from 'react';
import { Radio, Skeleton } from 'antd';
import './style.less';

interface MyRadioProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: any) => void;
  loading?: boolean;
  disabled?: boolean;
}

const SingleRadio: FC<MyRadioProps> = ({
  options,
  value,
  onChange,
  loading = false,
  disabled = false,
  ...rest
}) => {
  const [showSkeleton, setShowSkeleton] = useState(loading);

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true);
    } else {
      const timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const handleClick = () => {
    // Toggle value between the option value and undefined
    const newValue = value === options[0].value ? undefined : options[0].value;
    onChange?.(newValue);
  };

  return (
    <div className="my-radio-container">
      <Skeleton.Input
        active
        size="small"
        className="my-skeleton-input"
        style={{
          opacity: showSkeleton ? 1 : 0,
        }}
      />
      <Radio
        checked={value === options[0].value}
        onClick={handleClick}
        disabled={disabled}
        style={{
          opacity: showSkeleton ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {options[0].label}
      </Radio>
    </div>
  );
};

export default SingleRadio;