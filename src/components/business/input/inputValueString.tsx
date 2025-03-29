import { MyFormItem } from '@/components/basic/form-item';
import { MyInput } from '@/components/basic/input';
import { FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';
interface IProps {
  disabled?: boolean;
  name: string;
  label?: string;
  onChange?: (value: any, index?: any, field?: any) => void;
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
  rules?: any;
  handleBeforeInput?: any;
  isFormatDolla?: boolean;
  isPercent?: any;
  isDolla?: boolean;
  isShowLabel?: boolean;
}
const InputValueString = (props: IProps) => {
  const {
    disabled = false,
    name,
    label,
    onChange,
    hidden = false,
    value = undefined,
    setErrorState,
    loading = false,
    isFormatDolla,
    required = false,
    isPercent = true,
    isDolla = false,
    placeholder,
    isHideErrorMessage = false,
    defaultValue,
    status = '',
    handleBeforeInput,
    rules,
    form,
    formatter,
    isShowLabel = false,
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
  }, [value, name]);
  const handleFormattedChange = (inputValue: string) => {
    const formattedValue = inputValue.replace(',', '.'); // Thay dấu ',' bằng '.'
    onChange && onChange(formattedValue); // Gọi hàm onChange với giá trị đã format
  };
  useEffect(() => {
    if (form && isPercent !== undefined) {
      // Nếu isPercent thay đổi, reset giá trị trường input về rỗng
      form.setFieldsValue({ [name]: '' });
    }
  }, [isPercent]);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/^[0-9]$/.test(e.key) && // Chỉ cho phép nhập số (0-9)
      e.key !== 'Backspace' && // Cho phép xóa
      e.key !== 'Tab' && // Cho phép Tab
      e.key !== 'ArrowLeft' && // Cho phép di chuyển trái
      e.key !== 'ArrowRight' && // Cho phép di chuyển phải
      !(isPercent && e.key === '.') &&
      e.ctrlKey === false
    ) {
      e.preventDefault(); // Chặn ký tự không hợp lệ
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pasteData)) {
      e.preventDefault(); // Chặn dán dữ liệu không phải số nguyên dương
    }
  };
  return (
    <MyFormItem
      name={name}
      label={label}
      isFormatDolla={isFormatDolla}
      initialValue={value}
      setErrorState={setErrorState}
      disabled={disabled}
      isHideErrorMessage={isHideErrorMessage}
      required={required}
      help={null}
      isShowLabel={isShowLabel}
      hidden={hidden}
      rules={rules}
      form={form}
    >
      <MyInput
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={placeholder ? placeholder : 'value'}
        isDolla={isDolla}
        onChange={e => handleFormattedChange(e.target.value)}
        loading={loading}
        status={status}
        formatter={formatter}
        {...(isPercent === true ? { onBeforeInput: handleBeforeInput } : {})}
        // {...(value !== undefined ? { value } : {})}
        // defaultValue={defaultValue}
      />
    </MyFormItem>
  );
};

export default InputValueString;
