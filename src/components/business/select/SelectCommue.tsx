import { getProvince, getWards } from '@/api/features/masterData';
import { MyFormItem } from '@/components/basic/form-item';
import {
  MultipleSelectWithoutBorder,
  SelectAntdSearch,
  SelectCompact,
  SelectCompactWithoutBorder,
} from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import unorm from 'unorm';

// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  disabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  options: ISource[]
  loading?: boolean;
}

const SelectCommune = ({
  onChange,
  disabled,
  placeholder,
  label,
  name,
  options,
  loading = false,
  ...props
}: IProps) => {
  return (
    <MyFormItem name={name || 'wardCode'} label={label || 'Commune/Ward'} disabled ={disabled} {...props}>
      <SelectAntdSearch
        placeholder={placeholder || 'Select'}
        onChange={onChange}
        disabled={disabled}
        options={options}
        loading = {loading}
      />
    </MyFormItem>
  );
};

export default SelectCommune;
