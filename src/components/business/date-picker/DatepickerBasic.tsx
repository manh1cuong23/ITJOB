import { MyDatePicker } from '@/components/basic/datepicker';
import { MyFormItem } from '@/components/basic/form-item';
import { FormInstance } from 'antd';
import dayjs from 'dayjs';

// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void;
  placeholder?: string;
  label: string;
  name: string;
  disabled?: boolean;
  disabledDate?: (currentDate: dayjs.Dayjs) => boolean;
  loading?: boolean;
  required?: boolean;
  form?: FormInstance;
  isSpan?: boolean;
  showTime?: any;
}

const DatepickerBasic = ({
  onChange,
  placeholder,
  label,
  name,
  disabled = false,
  disabledDate,
  loading,
  isSpan,
  required = false,
  form,
  ...props
}: IProps) => {
  const _onChange = (_dates: string | null) => {
    onChange && onChange(_dates);
  };
  return (
    <MyFormItem
      name={name}
      {...props}
      label={label}
      disabled={disabled}
      required={required}
      form={form}
      {...(isSpan ? { labelCol: { span: 24 }, wrapperCol: { span: 24 } } : {})}>
      <MyDatePicker
        onChange={_onChange}
        disabledDate={disabledDate}
        loading={loading}
      />
    </MyFormItem>
  );
};

export default DatepickerBasic;
