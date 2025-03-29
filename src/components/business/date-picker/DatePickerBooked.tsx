import { MyFormItem } from '@/components/basic/form-item';
import CustomDateRangePicker from '@/components/basic/range-picker/CustomRangePicker';
import { Form } from 'antd';

// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder
  label?: string; // Label của form item
  name?: string; // Tên của form item
}

const DatePickerBooked = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  ...props
}: IProps) => {
  const _onChange = (_dates: string[] | null) => {
    onChange && onChange(_dates);
  }
  return (
    <MyFormItem
      name={name || 'createdDate'}
      isShowLabel = {false}
      {...props}>
      <CustomDateRangePicker
        onChange={_onChange}
        labelFromDate="Booked At From"
        labelToDate="Booked At To"
        maxDays={null}
        defaultStartDate={null}
        defaultEndDate={null}
      />
    </MyFormItem>
  );
};

export default DatePickerBooked;
