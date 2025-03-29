import { MyDatePicker } from '@/components/basic/datepicker';
import { MyFormItem } from '@/components/basic/form-item';
import { current } from '@reduxjs/toolkit';
import { Form } from 'antd';
import dayjs from 'dayjs';

// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  disabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder
  label?: string; // Label của form item
  name?: string; // Tên của form item
}

const DatepickerModifiedAt = ({
  onChange,
  disabled = false,
  placeholder,
  label,
  name,
  ...props
}: IProps) => {
  const _onChange = (_dates: string | null) => {
    onChange && onChange(_dates);
  };
  return (
    <MyFormItem name={name || 'modifiedDate'} {...props} label={label || 'Modified At'} disabled = {disabled}>
      <MyDatePicker
        onChange={_onChange}
        disabledDate ={(currentDate: dayjs.Dayjs) => {
          return currentDate.isAfter(dayjs());
        }}
      />
    </MyFormItem>
  );
};

export default DatepickerModifiedAt;
