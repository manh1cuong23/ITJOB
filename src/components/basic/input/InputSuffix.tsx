import React, { useState } from 'react';
import { MyInput } from '@/components/basic/input';
import { ReactComponent as PenSvg } from '@/assets/icons/ic_pen.svg';

interface InputWithSuffixProps{
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  blur?: () => void;
}

const MyInputWithSuffix = ({
  placeholder,
  onChange,
  blur,
  value,
  ...rest
}: InputWithSuffixProps) => {
  // Hàm xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setValue(newValue);
    if (onChange) {
      onChange(e); // Gọi onChange với giá trị mới
    }
  };

  // Hàm xử lý khi nhấn nút clear
  const handleClear = () => {
    // setValue(''); // Đặt giá trị về rỗng
    if (onChange) {
      onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>); // Gọi onChange với giá trị rỗng
    }
  };

  return (
    <MyInput
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      suffix={!value ? <PenSvg /> : null}
      allowClear
      onClear={handleClear}
      maxLength={255}
      {...rest}
    />
  );
};

export default MyInputWithSuffix;
