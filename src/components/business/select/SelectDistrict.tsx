import { MyFormItem } from '@/components/basic/form-item';
import { SelectAntdSearch, SelectCompact } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { useEffect, useState } from 'react';
import unorm from 'unorm';

// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  disabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  options: ISource[];
  loading?: boolean;
}

const SelectDistrict = ({
  onChange,
  isDefault,
  disabled,
  placeholder,
  label,
  name,
  options,
  loading,
  ...props
}: IProps) => {
  return (
    <MyFormItem
      name={name || 'districtCode'}
      label={label || 'District'}
      disabled={disabled}
      {...props}>
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

export default SelectDistrict;
