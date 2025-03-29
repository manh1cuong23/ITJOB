import React, { useEffect, useState } from 'react';
import { Radio } from 'antd';
import { MyFormItem } from '../form-item';
interface Props {
  groupId: any;
  value: any;
  selectedValue: any;
  onChange: any;
  label: any;
  hidden?: boolean;
  disabled?: boolean;
  required?: boolean;
  form?: any;
  defaultValue?: any;
  name?: any;
  rules?: any;
  disabledEdit?: any;
}
const RadioButtonSimple = ({
  groupId,
  value,
  selectedValue,
  onChange,
  label,
  hidden,
  disabled,
  disabledEdit,
  required,
  form,
  rules,
  defaultValue,
  name,
}: Props) => {
  useEffect(() => {
    if (form && name) {
      form.setFieldsValue({ [name]: selectedValue });
    }
  }, [selectedValue, form, name]);
  return (
    <MyFormItem
      name={name}
      disabled={disabled}
      required={required}
      isShowLabel={false}
      rules={rules}
      initialValue={defaultValue}
      hidden={hidden}
      form={form}>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ marginRight: '8px' }}>{label}</span>
        <Radio
          disabled={disabled || disabledEdit}
          checked={disabled ? false : selectedValue === value} // Kiểm tra radio có được chọn
          onChange={() => onChange(groupId, value)} // Cập nhật trạng thái
        />
      </div>
    </MyFormItem>
  );
};
export default RadioButtonSimple;
