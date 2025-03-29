import { MyFormItem } from '@/components/basic/form-item';
import { Checkbox, FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';

interface IProps {
  disabled?: boolean;
  name?: string;
  label?: string;
  labelField?: string;
  onChange?: (e: any) => void;
  loading?: boolean;
  required?: boolean;
  status?: 'error' | 'warning' | '';
  form?: FormInstance;
  hidden?: boolean;
  placeholder?: string;
  defaultValue?: boolean;
  checked?: boolean;
}

const MyCheckBox = (props: IProps) => {
  const {
    disabled = false,
    name,
    label,
    checked,
    labelField,
    onChange,
    hidden = false,
    loading = false,
    required = false,
    placeholder,
    defaultValue = undefined,
    status = '',
    form,
  } = props;
  const [check, setCheck] = useState<boolean | undefined>(
    defaultValue !== undefined
      ? defaultValue
      : form?.getFieldValue(name) || false
  );
  useEffect(() => {
    if (name) {
      form?.setFieldsValue({ [name]: defaultValue });
    }
  }, [defaultValue]);
  useEffect(() => {
    setCheck(form?.getFieldValue(name));
  }, [form?.getFieldValue(name)]);
  const handleCheckboxChange = (e: any) => {
    const checked = e.target.checked;
    // Cập nhật giá trị của checkbox vào form
    if (form && name) {
      form.setFieldsValue({ [name]: checked });
      console.log('Check checked', checked);
      setCheck(checked);
    }
    // Nếu có onChange từ props, gọi hàm onChange đó
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <MyFormItem
      name={name}
      label={labelField}
      disabled={disabled}
      required={required}
      isShowLabel={labelField ? true : false}
      initialValue={defaultValue}
      hidden={hidden}
      form={form}
      status={status}
    >
      <Checkbox
        defaultChecked={defaultValue}
        checked={defaultValue !== undefined ? check : form?.getFieldValue(name)}
        disabled={disabled}
        onChange={handleCheckboxChange}
      >
        {label}
      </Checkbox>
    </MyFormItem>
  );
};

export default MyCheckBox;
