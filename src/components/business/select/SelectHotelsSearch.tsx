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
  className?: string;
  defaultOption?: any[];
  maxTagCount?: number;
}

const SelectHotelsSearch = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  maxTagCount,
  options,
  className,
  defaultOption,
  ...props
}: SelectHotelsProps) => {
  const mockOptions = [
    {
      label: 'Option 1',
      value: 'option1',
    },
    {
      label: 'Option 2',
      value: 'option2',
    },
    {
      label: 'Option 3',
      value: 'option3',
    },
    {
      label: 'Option 4',
      value: 'option4',
    },
    {
      label: 'Option 5',
      value: 'option5',
    },
    {
      label: 'Option 6',
      value: 'option6',
    },
  ];
  return (
    <Form.Item
      name={name || 'hotelId'}
      // initialValue={options?.[0]?.value}
      className={className}
      {...props}>
      <MultiSelectWithSearch
        prefix={label || 'Hotel:'}
        // maxTagCount={3}
        defaultOption={defaultOption}
        maxTagCount={maxTagCount}
        options={options}
        onChange={onChange}
        style={{ minWidth: '110px' }}
      />
    </Form.Item>
  );
};

export default SelectHotelsSearch;
