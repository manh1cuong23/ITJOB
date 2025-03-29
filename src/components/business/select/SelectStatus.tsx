import { getProvince } from '@/api/features/masterData';
import {
  MultipleSelectWithoutBorder,
  SelectCompact,
  SelectCompactWithoutBorder,
} from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { useEffect, useState } from 'react';

// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  countryCode?: string;
  options?: ISource[];
}

const SelectStatus = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  countryCode,
  options =[
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
      value: 'draft',
    },
  ],
  ...props
}: IProps) => {
  return (
    <Form.Item name={name || 'status'} label={label || 'Status'} {...props}>
      <SelectCompact
        options={options}
        onChange={onChange}
        placeholder="Select"
        allowClear
      />
    </Form.Item>
  );
};

export default SelectStatus;
