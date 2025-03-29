import { MyFormItem } from '@/components/basic/form-item';
import { MyInput } from '@/components/basic/input';
import { FormInstance } from 'antd';
import React, { KeyboardEventHandler, useEffect, useState } from 'react';
interface IProps {
  disabled?: boolean;
  name: string;
  label?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
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
  isFormatDolla?: boolean;
  formatter?: any;
  className?: string;
  rules?: any;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement> | undefined;
}
const InputValue = (props: IProps) => {
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
    rules,
    isFormatDolla,
    form,
    formatter,
    className,
    onKeyDown,
    onBlur
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
      isFormatDolla={isFormatDolla}
      name={name}
      label={label}
      initialValue={value}
      setErrorState={setErrorState}
      disabled={disabled}
      isHideErrorMessage={isHideErrorMessage}
      required={required}
      help={null}
      isShowLabel={false}
      hidden={hidden}
      rules={rules}
      form={form}
    >
      <MyInput
        blur={onBlur}
        onKeyDown={onKeyDown}
        className={className}
        placeholder={placeholder ? placeholder : 'value'}
        onChange={e => onChange && onChange(e.target.value)}
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

export default InputValue;
