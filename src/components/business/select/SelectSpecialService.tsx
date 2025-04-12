import { MyFormItem } from '@/components/basic/form-item';
import {
  MultiSelectWithSearch,
  SelectCompact,
} from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { useEffect, useState } from 'react';

// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  disabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  required?: boolean;
  options?: ISource[];
}

const SelectSpecialService = ({
  required = false,
  onChange,
  isDefault,
  disabled = false,
  placeholder,
  label,
  name,
  options = [
    {
      label: 'All',
      value: '',
    },
    {
      label: 'Active',
      value: 'published',
    },
    {
      label: 'InActive',
      value: 'unpublished',
    },
  ],
  ...props
}: IProps) => {
  return (
    <MyFormItem
      name={name || 'special-service'}
      label={label || 'Special Service'}
      {...props}
      required={required}
      disabled={disabled}>
      <MultiSelectWithSearch
        maxTagCount={1}
        options={options}
        // nameSort={props?.nameSort}
        onChange={onChange}
      />
    </MyFormItem>
  );
};

export default SelectSpecialService;
