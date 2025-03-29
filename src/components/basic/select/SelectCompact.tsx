import { FC, useEffect, useState } from 'react';
import { Select, Skeleton } from 'antd';
import { SelectProps } from 'antd/lib/select';
import './style.less';
import { ReactComponent as DropdownSvg } from '@/assets/icons/ic_dropdown.svg';

interface SelectCompactProps extends SelectProps {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  blur?: () => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

const SelectCompact: FC<SelectCompactProps> = ({
  name,
  value,
  onChange,
  blur,
  loading = false,
  placeholder = 'Select',
  className,
  ...rest
}) => {
  const [showSkeleton, setShowSkeleton] = useState(loading);

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true);
    } else {
      const timeout = setTimeout(() => setShowSkeleton(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  return (
    <div className="my-select-container" style={{ position: 'relative' }}>
      <Skeleton.Input
        active
        className="my-skeleton-input "
        style={{
          opacity: showSkeleton ? 1 : 0,
        }}
      />
      <Select
        {...rest}
        value={value}
        onChange={onChange}
        onBlur={blur}
        className={`my-select ${className}`}
        suffixIcon={<DropdownSvg width={14} height={14} />}
        allowClear
        placeholder={placeholder}
        loading={loading}
        style={{
          opacity: showSkeleton ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          zIndex: 1,
        }}>
        {rest.options?.length
          ? rest.options.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))
          : null}
      </Select>
    </div>
  );
};

export default SelectCompact;
