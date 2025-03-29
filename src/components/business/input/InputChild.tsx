import { MyFormItem } from '@/components/basic/form-item';
import { MyInput } from '@/components/basic/input';
import React from 'react';
import { ReactComponent as ChildSvg } from '@/assets/icons/ic_bl_child.svg';
import MyInputNumber from '@/components/basic/input/InputNumber';
import { InputNumberProps } from 'antd';
interface IProps {
  onChange?: (value: string | number | null) => void;
  name?: string;
  label?: string;
  initialValue?: number;
  min?: number;
  max?: number;
  loading?: boolean;
  tabIndex?: number;
}
const InputChild = (props: IProps) => {
  const {
    onChange,
    name,
    label,
    initialValue,
    min = 0,
    max = 1000,
    loading = false,
    // tabIndex
  } = props;

  return (
    <MyFormItem
      name={name || 'childNum'}
      label={label || 'Child(s)'}
      initialValue={initialValue || 0}>
      <MyInputNumber
        placeholder="Enter"
        prefix={<ChildSvg width={16} height={16} />}
        onChange={onChange}
        min={min}
        max={max}
        loading={loading}
        // tabIndex ={tabIndex}
      />
    </MyFormItem>
  );
};

export default InputChild;
