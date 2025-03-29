import React, { useEffect, useState } from 'react';
import { FormInstance } from 'antd';
import { MyFormItem } from '@/components/basic/form-item';
import SelectBasicCustom from '@/components/business/select/SelectBasicCustom';
import './InputAdjustRate.less';
import MyCheckBox from '@/components/business/checkbox/MyCheckBox';
import InputValueString from '@/components/business/input/inputValueString';
import { handleBeforeInputFloat } from '@/utils/formatInput';

interface IProps {
  disabled?: boolean;
  name: string;
  label?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
  required?: boolean;
  status?: 'error' | 'warning' | '';
  form?: FormInstance;
  index?: number;
  record?: {
    id?: string | number;
    is_increase?: boolean;
    value?: string | number;
    is_percent?: boolean;
  };
  fieldName?: string;
  isViewMode?: boolean;
  isShowLabel?: boolean;
  className?: string;
  isHideErrorMessage?: boolean;
}

const InputAdjustRate = (props: IProps) => {
  const {
    disabled = false,
    name,
    label = 'Adjust Rate',
    onChange,
    loading = false,
    required = false,
    status = '',
    form,
    index = 0,
    record,
    fieldName = 'occupancy',
    isViewMode = false,
    isShowLabel = true,
    className = 'adjust-rate',
    isHideErrorMessage = true,
  } = props;
  const [isPercent, setIsPercent] = useState<boolean>(
    !!record?.is_percent || false
  );
  const [isIncrease, setIsIncrease] = useState<boolean>(
    record?.is_increase ?? true
  );
  const [value, setValue] = useState<string>(record?.value?.toString() || '');
  const isDisabled = disabled || isViewMode;
  useEffect(() => {
    updateParentValue();
  }, [isIncrease, value, isPercent]);

  const updateParentValue = () => {
    // console.log('type', isIncrease);
    // console.log('val', value);
    // console.log('percentage', isPercent);

    if (onChange) {
      onChange(
        JSON.stringify({
          type: isIncrease,
          value: value,
          isPercentage: isPercent,
        })
      );
    }
  };
  return (
    <MyFormItem
      name={name}
      label={label}
      disabled={isDisabled}
      isFormatDolla
      fieldFormat="adjust_rate"
      required={required}
      isShowLabel={isShowLabel}
      isHideErrorMessage={isHideErrorMessage}
      form={form}
      rules={
        !isShowLabel
          ? [
              {
                required: required,
                message: 'Adjust Rate is required when it is checked',
              },
            ]
          : []
      }
    >
      <div className={`adjust-wrapper ${isDisabled ? 'disabled' : ''}`}>
        <div className="select-fluctuation">
          <SelectBasicCustom
            isShowLabel={false}
            defaultValue={record?.is_increase}
            noInitValue
            // required={required}
            name={`${fieldName}_${index}_is_increase`}
            disabled={isDisabled}
            className={`${className} ${isDisabled ? 'disabled' : ''}`}
            placeholder=" "
            form={form}
            options={[
              { value: true, label: '+' },
              { value: false, label: '-' },
            ]}
            onChange={val => {
              const newIsIncrease = val;
              setIsIncrease(pre => newIsIncrease);
              updateParentValue();
            }}
          />
        </div>

        <div className="input-wrapper">
          <InputValueString
            handleBeforeInput={handleBeforeInputFloat}
            isPercent={isPercent}
            isHideErrorMessage={true}
            label="to"
            disabled={isDisabled}
            name={`adjust_rate`}
            placeholder=" "
            form={form}
            onChange={e => {
              if (e === '' && form) {
                form.setFieldsValue({ [name]: '' });
              }
              if (e) {
                const newValue = e;
                setValue(newValue);
                updateParentValue();
              }
            }}
          />
        </div>

        <div className={`percent-label ${isDisabled ? 'disabled' : ''}`}>
          <MyCheckBox
            form={form}
            disabled={isDisabled}
            name="is_percent"
            onChange={e => {
              const newIsPercent = e.target.checked;
              setIsPercent(newIsPercent);
              updateParentValue();
            }}
            label="%"
          />
        </div>
      </div>
    </MyFormItem>
  );
};

export default InputAdjustRate;
