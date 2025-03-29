import { MyFormItem } from '@/components/basic/form-item';
import { MyInput } from '@/components/basic/input';
import MyInputNumber from '@/components/basic/input/InputNumber';
import { FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';
interface IProps {
  disabled?: boolean;
  name: string;
  label?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
  required?: boolean;
  status?: 'error' | 'warning' | '';
  form?: FormInstance;
  hidden?: boolean;
  placeholder?: string;
  defaultValue?: string;
  isHideErrorMessage?: boolean;
  value?: number | string;
  setErrorState?: (e: any) => void;
  formatter?: any;
}
const InputNumberValue = (props: IProps) => {
  const {
    disabled = false,
    name,
    label,
    onChange,
    hidden = false,
    value = undefined,
    setErrorState,
    loading = false,
    required = false,
    placeholder,
    isHideErrorMessage = false,
    defaultValue,
    status = '',
    form,
    formatter,
  } = props;
  useEffect(() => {
    if (form && defaultValue !== undefined) {
      form.setFieldsValue({ [name]: defaultValue });
    }
  }, [defaultValue, form]);
  useEffect(() => {
    if (form && value !== undefined) {
      form.setFieldsValue({ [name]: value });
    }
  }, [value]);
  return (
    <MyFormItem
      name={name}
      label={label}
      setErrorState={setErrorState}
      disabled={disabled}
      isHideErrorMessage={isHideErrorMessage}
      required={required}
      help={null}
      isShowLabel={false}
      hidden={hidden}
      form={form}>
      <MyInputNumber
        placeholder={placeholder ? placeholder : 'value'}
        onChange={(e: any) => onChange && onChange(e.target.value)}
        loading={loading}
        status={status}
        formatter={formatter}
        {...(value !== undefined ? { value } : {})}
        // defaultValue={defaultValue}
        type="number"
      />
    </MyFormItem>
  );
};

export default InputNumberValue;
