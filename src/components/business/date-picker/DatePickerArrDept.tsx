import { MyFormItem } from '@/components/basic/form-item';
import { MyCustomDateRangePicker } from '@/components/basic/range-picker';
import { Form } from 'antd';

// Định nghĩa interface cho props
interface DatePickerArrDeptProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder
  label?: string; // Label của form item
  name?: string; // Tên của form item
}

const DatePickerArrDept = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  ...props
}: DatePickerArrDeptProps) => {
  const _onChange = (_dates: string[] | null) => {
    onChange && onChange(_dates);
  };
  return (
    <MyFormItem name={name || 'arr_dept'} isShowLabel = {false} {...props}>
      <MyCustomDateRangePicker
        onChange={_onChange}
        labelFromDate="Arrival date"
        labelToDate="Departure date"
        maxDays={null}
        defaultStartDate={null}
        defaultEndDate={null}
      />
    </MyFormItem>
  );
};

export default DatePickerArrDept;
