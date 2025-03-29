import { FC, useEffect, useState } from 'react';
import { Input, Skeleton } from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import './style.less';

interface MyTextAreaProps extends TextAreaProps {
  value?: string;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  onKeyDown?: (e: any) => void;
}

const MyTextArea: FC<MyTextAreaProps> = ({
  value,
  onChange,
  placeholder = 'Enter',
  loading = false,
  className,
  onBlur,
  onKeyDown,
}) => {
  const [showSkeleton, setShowSkeleton] = useState(loading);
  const handleBlur = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const trimmedValue = e.target.value.trim();
    if (onBlur) {
      onBlur(e);
    }
    if (onChange) {
      onChange({ ...e, target: { ...e.target, value: trimmedValue } });
    }
  };
  useEffect(() => {
    if (loading) {
      setShowSkeleton(true);
    } else {
      const timeout = setTimeout(() => setShowSkeleton(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [loading]);
  return (
    <div>
      <Skeleton.Input
        active
        className="my-skeleton-textarea"
        style={{
          opacity: showSkeleton ? 1 : 0,
          height: '200px',
        }}
      />
      <Input.TextArea
        className={`my-textarea ${className}`}
        allowClear
        value={value}
        autoSize={false}
        rows={4}
        onChange={onChange}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        maxLength={500}
        placeholder={placeholder}
        style={{
          opacity: showSkeleton ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          width: '100%',
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default MyTextArea;
