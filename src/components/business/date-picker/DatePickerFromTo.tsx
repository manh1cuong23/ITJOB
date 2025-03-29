import { MyFormItem } from '@/components/basic/form-item';
import { MyCustomDateRangePicker } from '@/components/basic/range-picker';
import { formatDateTable } from '@/utils/formatDate';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';

// Định nghĩa interface cho props
interface DatePickerFromToProps {
  onChange?: (dates: string[] | null) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder
  label?: string; // Label của form item
  name?: string; // Tên của form item
  defaultValue?: [string, string] | null;
  value?: [string, string] | null;
  required?: boolean;
  labelFromDate?: string;
  labelToDate?: string;
  notInitValue?: boolean;
}

const DatePickerFromTo = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  defaultValue,
  labelFromDate,
  labelToDate,
  value,
  notInitValue = false,
  required = false,
  ...props
}: DatePickerFromToProps) => {
  const today = dayjs();
  const defaultStartDate = today;
  const defaultEndDate = today.add(30, 'day');

  const _onChange = (_dates: string[] | null) => {
    onChange && onChange(_dates);
  };

  const initialValue = defaultValue
    ? [formatDateTable(defaultValue[0]), formatDateTable(defaultValue[1])]
    : [
        defaultStartDate.format('YYYY-MM-DD'),
        defaultEndDate.format('YYYY-MM-DD'),
      ];
  console.log('defaultDate', defaultValue);
  return (
    <MyFormItem
      name={name || 'from_to'}
      initialValue={!notInitValue ? initialValue : null}
      {...props}
      isShowLabel={false}>
      <MyCustomDateRangePicker
        onChange={_onChange}
        maxDays={90}
        allowedRange={value}
        labelFromDate={labelFromDate}
        labelToDate={labelToDate}
        required={required}
        placeholder={placeholder}
        defaultStartDate={defaultValue ? defaultValue[0] : null}
        defaultEndDate={defaultValue ? defaultValue[1] : null}
        value={null}
      />
    </MyFormItem>
  );
};

export default DatePickerFromTo;
