import { MyFormItem } from '@/components/basic/form-item';
import MyInputIconNumber from '@/components/basic/input/inputIcon';
import { DollarOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd';
import React, { KeyboardEventHandler, useEffect, useState } from 'react';

type ValueType = string | number;

interface IProps {
  disabled?: boolean;
  name: string;
  label?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
  required?: boolean;
  status?: 'error' | 'warning' | '';
  form?: FormInstance;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement> | undefined;
  Icon?: any;
  isNumber?: boolean;
  type?: string;
  isShowLabel?: boolean;
}

const InputBasicWithIcon = (props: IProps) => {
  const {
    disabled = false,
    name,
    label,
    onChange,
    loading = false,
    onKeyDown,
    type,
    required = false,
    status = '',
    isNumber = false,
    form,
    Icon = <DollarOutlined />,
    isShowLabel,
  } = props;

  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    const formValue = form?.getFieldValue(name) ?? '';
    const numericValue =
      typeof formValue === 'number' ? formValue : parseFloat(formValue);

    if (!isNaN(numericValue)) {
      setDisplayValue(
        numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      );
    } else {
      setDisplayValue('');
    }
  }, [form, name, form?.getFieldValue(name)]);

  const handleChange = (value: ValueType | null) => {
    if (value === null) {
      form?.setFieldsValue({ [name]: undefined });
      onChange?.('');
      setDisplayValue('');
      return;
    }

    const rawValue = value.toString();

    const cleanedValue = rawValue.replace(/[^\d.]/g, '');

    if (cleanedValue === '' || cleanedValue === '.') {
      form?.setFieldsValue({ [name]: undefined });
      onChange?.('');
      setDisplayValue('');
      return;
    }

    const numericValue = parseFloat(cleanedValue);

    if (!isNaN(numericValue)) {
      form?.setFieldsValue({ [name]: numericValue });
      onChange?.(numericValue.toString());

      setDisplayValue(
        numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      );
    }
  };

  return (
    <MyFormItem
      name={name}
      label={label}
      isShowLabel={isShowLabel}
      disabled={disabled}
      required={required}
      isHideErrorMessage
      rules={[
        {
          required: required,
          message: 'Rate Override is required when it is checked',
        },
      ]}
      form={form}
    >
      <MyInputIconNumber
        placeholder="Enter"
        onChange={handleChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        value={displayValue}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
        parser={value => value?.replace(/\$\s?|(\.*)/g, '') || ''}
        loading={loading}
        status={status}
        Icon={Icon}
      />
    </MyFormItem>
  );
};

export default InputBasicWithIcon;
