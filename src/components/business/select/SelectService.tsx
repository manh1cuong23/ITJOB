import { getTypeID } from '@/api/features/typeID';
import { MyFormItem } from '@/components/basic/form-item';
import {
  MultiSelectWithSearch,
  SelectCompact,
} from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { useEffect, useState } from 'react';

interface IProps {
  onChange?: (value: any) => void;
  isDefault?: boolean;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  name?: string;
  required?: boolean;
  options?: ISource[];
}

const SelectService = ({
  required = false,
  onChange,
  isDefault,
  disabled = false,
  placeholder,
  label,
  name,
  options = [],
  ...props
}: IProps) => {
  return (
    <MyFormItem
      name={name || 'service'}
      label={label || 'Service'}
      {...props}
      required={required}
      disabled={disabled}>
      <MultiSelectWithSearch
        maxTagCount={3}
        options={options}
        onChange={onChange}
        maxWidth="350px"
      />
    </MyFormItem>
  );
};

export default SelectService;
