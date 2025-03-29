import { MyFormItem } from '@/components/basic/form-item';
import { MyRadio } from '@/components/basic/radio';
import BorderRadio from '@/components/basic/radio/BorderRadio';
import { ISource } from '@/utils/formatSelectSource';
import { classNames } from '@react-pdf-viewer/core';
import React from 'react';

interface IProps {
  disabled?: boolean;
  options?: ISource[];
  required?: boolean;
  label?: string;
  name?: string;
  className?: string;
  loading: boolean;
}
const RadiosGuestType = (props: IProps) => {
  const {
    disabled = false,
    options,
    loading = false,
    required = false,
    label,
    name,
    className,
  } = props;
  const optionsValue = [
    {
      label: 'Active',
      value: 'published',
    },
    {
      label: 'InActive',
      value: 'unpublished',
    },
  ];
  return (
    <MyFormItem
      name={name || 'typeGuest'}
      label={label || 'Guest'}
      required={required}
      disabled={disabled}>
      <BorderRadio
        options={options || optionsValue}
        className={className}
        loading={loading}
        disabled={disabled}
      />
    </MyFormItem>
  );
};

export default RadiosGuestType;
