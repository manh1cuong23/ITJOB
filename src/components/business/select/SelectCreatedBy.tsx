import { MultiSelectWithSearch } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { useState } from 'react';

// Định nghĩa interface cho props
interface SelectCreatedByProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  options: ISource[]; // Các tùy chọn select (nếu muốn truyền vào từ ngoài)
  maxTagCount?: number;
  maxWidth?: string;
}

const SelectCreatedBy = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  maxTagCount = 3,
  label,
  maxWidth,
  name,
  options,
  ...props
}: SelectCreatedByProps) => {
  return (
    <Form.Item
      name={name || 'createdBy'}
      initialValue={''}
      label={label || 'Booked By'}
      {...props}>
      <MultiSelectWithSearch
        maxWidth={maxWidth}
        maxTagCount={maxTagCount}
        options={options}
        onChange={onChange}
      />
    </Form.Item>
  );
};

export default SelectCreatedBy;
