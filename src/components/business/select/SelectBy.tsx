import {
  MultiSelectWithSearch,
  SingleSelectSearchCustom,
} from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { useState } from 'react';

// Định nghĩa interface cho props
interface SelectHotelsProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  options: ISource[]; // Các tùy chọn select (nếu muốn truyền vào từ ngoài)
}

const SelectBy = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  options,
  ...props
}: SelectHotelsProps) => {
  return (
    <Form.Item
      name={name || 'orderBy'}
      initialValue={options?.[0]?.value}
      {...props}
    >
      <SingleSelectSearchCustom
        prefix="By: "
        // maxTagCount={3}
        defaultOption={options?.[0]?.value}
        options={options}
        onChange={onChange}
        style={{ minWidth: '110px' }}
      />
    </Form.Item>
  );
};

export default SelectBy;
