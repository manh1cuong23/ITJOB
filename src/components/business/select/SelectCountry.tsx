import { getCountry } from '@/api/features/masterData';
import { MyFormItem } from '@/components/basic/form-item';
import { SelectAntdSearch, SelectCompact } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import unorm from 'unorm';

// Define interface for props
interface IProps {
  onChange?: (value: string) => void; // Specific type for onChange
  isDefault?: boolean;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  name?: string;
  options: ISource[];
  loading?: boolean;
}

const SelectCountry = ({
  onChange,
  isDefault,
  disabled = false,
  placeholder,
  label,
  name,
  options,
  loading = false,
  ...props
}: IProps) => {
  return (
    <MyFormItem
      name={name || 'country'}
      label={label || 'Country'}
      {...props}
      disabled={disabled}>
      <SelectAntdSearch
        placeholder={placeholder || 'Select'}
        onChange={onChange}
        disabled={disabled}
        options={options}
        loading={loading}
      />
    </MyFormItem>
  );
};

export default SelectCountry;
