import { MyFormItem } from '@/components/basic/form-item';
import { MultiSelectWithSearch } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib';
import { useState } from 'react';

// Định nghĩa interface cho props
interface SelectBookingStatusProps {
  required?: boolean;
  form?: FormInstance;
  maxTagCount?: number;
  maxWidth?: string;
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  options: ISource[]; // Các tùy chọn select (nếu muốn truyền vào từ ngoài)
}

const MultiSelectBasic = ({
  onChange,
  maxTagCount = 3,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  options,
  form,
  required = false,
  maxWidth,
  ...props
}: SelectBookingStatusProps) => {
  return (
    <MyFormItem
      name={name || 'multi_select'}
      label={label || 'Select'}
      initialValue={''}
      required={required}
      form={form}
      {...props}
    >
      <MultiSelectWithSearch
        maxTagCount={maxTagCount}
        options={options}
        onChange={onChange}
        maxWidth={maxWidth}
      />
    </MyFormItem>
  );
};

export default MultiSelectBasic;
