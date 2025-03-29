import { FC, useEffect, useRef, useState } from 'react';
import { Form, Radio, Skeleton, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './style.less';

interface MyRadioProps {
  options: { label: string; value: string }[];
  value?: string; // Giá trị đã chọn
  onChange?: (e: any) => void; // Hàm xử lý sự kiện khi thay đổi
  className?: string;
  loading: boolean;
  disabled?: boolean;
}

const BorderRadio: FC<MyRadioProps> = ({
  options,
  value,
  onChange,
  loading,
  className,
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
  return (
    <Radio.Group
      value={value}
      onChange={onChange}
      {...rest}
      style={{ display: 'flex', gap: '8px' }}>
      {options.map(option => (
        <Radio
          disabled={disabled}
          key={option.value}
          value={option.value}
          className={`border-radio ${
            value === option.value ? 'checked' : ''
          } ${className} ${disabled ? 'disable' : ''}`}>
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default BorderRadio;
