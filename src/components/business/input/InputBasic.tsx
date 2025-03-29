import { MyFormItem } from '@/components/basic/form-item';
import { MyInput } from '@/components/basic/input';
import { FormInstance } from 'antd';
import React, { useState } from 'react';
interface IProps {
  disabled?: boolean;
  name: string;
  label: string;
  onChange?: (value: string) => void;
  loading?: boolean;
  required?: boolean;
  status?: 'error' | 'warning' | '';
  form?: FormInstance;
  errorState?: boolean; // Thêm thuộc tính kiểm tra lỗi
  errorMessage?: string; // Thông báo lỗi
  rules?: any;
  isCode?: boolean;
  isName?: boolean;
  isTime?: boolean;
  regex?: RegExp;
  placeholder?: string;
}
const InputBasic = (props: IProps) => {
  const {
    disabled = false,
    name,
    label,
    onChange,
    rules,
    loading = false,
    required = false,
    status = '',
    errorState,
    isCode = false,
    isName = false,
    isTime = false,
    errorMessage,
    regex,
    form,
    placeholder = 'Enter',
  } = props;
  const handleKeyDownCode = (
    isCode: boolean,
    isName: boolean,
    isTime: boolean,
    regex?: RegExp
  ) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && ['c', 'v', 'a', 'x', 'z'].includes(e.key.toLowerCase())) {
      return;
    }

    if (
      [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Backspace',
        'Delete',
        'Tab',
        'Enter',
        'Escape',
      ].includes(e.key)
    ) {
      return;
    }

    if (regex) {
      if (regex.test(e.key)) {
        e.preventDefault();
      }
    }

    if (isCode) {
      const regexCode = /^[a-zA-Z0-9_-]+$/; // Chỉ cho phép chữ, số, "_" và "-"
      if (!regexCode.test(e.key)) {
        e.preventDefault();
      }
    }

    if (isName) {
      const regexName = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/; // Chỉ cho phép chữ và số
      if (regexName.test(e.key)) {
        e.preventDefault();
      }
    }
    if (isTime) {
      const input = e.currentTarget;
      const value = input.value;
      const isNumber = /^[0-9]$/.test(e.key);
      const isColon = e.key === ':';
      let [hours, minutes] = value.split(':');

      // Trường hợp nhập giờ (H hoặc HH)
      if (value.length < 2) {
        if (!isNumber) e.preventDefault();
      }
      // Chỉ được nhập dấu `:` ở vị trí thứ 2
      else if (value.length === 2) {
        if (!isColon) e.preventDefault();
      }
      // Trường hợp nhập phút (MM)
      else if (value.length > 2 && value.length < 5) {
        if (!isNumber) e.preventDefault();
      }
      // Không cho phép nhập quá 5 ký tự
      else {
        e.preventDefault();
      }

      // Kiểm tra giới hạn giờ (HH không vượt quá 24)
      if (hours !== undefined && hours.length > 0) {
        const hoursValue = parseInt(hours, 10);
        if (hoursValue > 24) {
          e.preventDefault();
        }
      }

      // Kiểm tra giới hạn phút (MM không vượt quá 59)
      if (minutes !== undefined && minutes.length > 0) {
        const minutesValue = parseInt(minutes, 10);
        if (minutesValue > 59) {
          e.preventDefault();
        }
      }

      // Không cho phép nhập `24:01` trở đi
      if (
        hours === '24' &&
        minutes !== undefined &&
        parseInt(minutes, 10) > 0
      ) {
        e.preventDefault();
      }
    }
  };
  const handlePaste = (isName: boolean) => (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    if (!isName) return; // Nếu không phải là isName, không kiểm tra

    const regexSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/g; // Regex ký tự đặc biệt
    const pasteText = e.clipboardData.getData('text'); // Lấy nội dung được dán

    if (regexSpecialChars.test(pasteText)) {
      e.preventDefault(); // Ngăn dán nếu có ký tự đặc biệt
    }
  };

  return (
    <MyFormItem
      name={name}
      label={label}
      disabled={disabled}
      required={required}
      rules={rules}
      validateStatus={errorState ? 'error' : undefined} // Hiển thị trạng thái lỗi nếu errorState là true
      help={errorState ? errorMessage : undefined} // Hiển thị thông báo lỗi nếu errorState là true
      form={form}
    >
      <MyInput
        onKeyDown={handleKeyDownCode(isCode, isName, isTime, regex)}
        onPaste={handlePaste(isName)}
        placeholder={placeholder}
        onChange={e => onChange && onChange(e.target.value)}
        loading={loading}
        status={status}
      />
    </MyFormItem>
  );
};

export default InputBasic;
