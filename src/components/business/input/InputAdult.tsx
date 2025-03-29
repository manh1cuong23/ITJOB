import React from 'react';
import { MyFormItem } from '@/components/basic/form-item';
import { FormInstance } from 'antd';
import { ReactComponent as UserSvg } from '@/assets/icons/ic_user.svg';
import MyInputNumber from '@/components/basic/input/InputNumber';
interface IProps {
  onChange?: (value: string | number | null) => void;
  name?: string;
  label?: string;
  initialValue?: number;
  min?: number;
  max?: number;
  loading?: boolean;
  tabIndex?: number;
  form?: FormInstance;
}
const InputAdult = (props: IProps) => {
  const {
    onChange,
    name = 'adultNum',
    label,
    initialValue,
    min = 1,
    max = 1000,
    loading = false,
    tabIndex,
    form,
  } = props;
  return (
    <MyFormItem
      name={name}
      required
      label={label || 'Adult(s)'}
      initialValue={initialValue || 1}
      form={form}>
      <MyInputNumber
        placeholder="Enter"
        prefix={<UserSvg width={14} height={14} />}
        onChange={onChange}
        min={min}
        max={max}
        loading={loading}
        // tabIndex ={tabIndex}
      />
    </MyFormItem>
  );
};

export default InputAdult;
