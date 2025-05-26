import { FC, useEffect, useRef, useState } from 'react';
import { Radio, Skeleton, Tooltip } from 'antd';
import './style.less';

interface MyRadioProps {
  options: { label: string; value: string }[];
  value?: string; // Giá trị đã chọn
  onChange?: (e: any) => void; // Hàm xử lý sự kiện khi thay đổi
  loading?: boolean; // Hiển thị skeleton khi đang tải
}

const MyRadio: FC<MyRadioProps> = ({
  options,
  value,
  onChange,
  loading = false,
  ...rest
}) => {
  const [showSkeleton, setShowSkeleton] = useState(loading);
  const [internalValue, setInternalValue] = useState<string | undefined>(value);

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

  const handleRadioChange = (e: any) => {
    const newValue = e.target.value;

    if (newValue === internalValue) {
      setInternalValue(undefined);
      onChange?.({ target: { value: undefined } });
    } else {
      setInternalValue(newValue);
      onChange?.(e);
    }
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
      <Radio.Group
        value={value}
        onChange={handleRadioChange}
        options={options}
        style={{
          opacity: showSkeleton ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
        {...rest}
      />
    </div>
  );
};

export default MyRadio;
