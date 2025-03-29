import { MyFormItem } from '@/components/basic/form-item';
import { RangePickerCustomizable } from '@/components/basic/range-picker';
import { Dayjs } from 'dayjs';
import { useEffect } from 'react';

interface IProps {
  onChange?: (dates: [string, string] | null) => void;
  name?: string;
  disabled?: boolean;
  initialValue?: [string, string] | null;
  arrDeptDate?: [string, string] | null;
  valueColor?: string;
  className?: string;
  maxDay?: number;
  disabledDate?: (current: Dayjs) => boolean;
  showValue?: boolean;
  blockPastDates?: boolean;
}

const DatepickerFromToWithoutborder = (props: IProps) => {
  const {
    onChange,
    name,
    disabled,
    initialValue,
    arrDeptDate,
    valueColor,
    className,
    maxDay,
    showValue = true,
    disabledDate,
    blockPastDates,
  } = props;
  return (
    <MyFormItem
      name={name || 'from-to'}
      label="From-to:"
      labelCol={{ span: 0 }}
      disabled={disabled}
      initialValue={initialValue}
    >
      <RangePickerCustomizable
        valueColor={valueColor}
        onChange={onChange}
        disabled={disabled}
        value={initialValue}
        date={initialValue}
        showValue={showValue}
        arrDeptDate={arrDeptDate}
        className={className}
        blockPastDates={blockPastDates}
        maxDay={maxDay}
      />
    </MyFormItem>
  );
};

export default DatepickerFromToWithoutborder;
