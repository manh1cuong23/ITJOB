import { MyFormItem } from '@/components/basic/form-item';
import { Checkbox, FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';

interface IProps {
  disabled?: boolean;
  name: string;
  label?: string;
  onChange?: (e: any) => void;
  loading?: boolean;
  check?: boolean;
  required?: boolean;
  status?: 'error' | 'warning' | '';
  form?: FormInstance;
  hidden?: boolean;
  placeholder?: string;
  defaultValue?: boolean;
}

const MyCheckBoxWithState = (props: IProps) => {
  const {
    disabled = false,
    name,
    label,
    onChange,
    hidden = false,
    loading = false,
    required = false,
    placeholder,
    defaultValue,
    status = '',
    check,
    form,
  } = props;
  useEffect(() => {
    if (form) {
      form.setFieldsValue({
        [name]: check,
      });
    }
  }, [check]);
  return (
    <MyFormItem
      name={name}
      disabled={disabled}
      required={required}
      isShowLabel={false}
      hidden={hidden}
      form={form}
      initialValue={check}
      status={status}>
      <Checkbox checked={check} disabled={disabled} onChange={onChange}>
        {label}
      </Checkbox>
    </MyFormItem>
  );
};

export default MyCheckBoxWithState;
