import { MyFormItem } from '@/components/basic/form-item';
import { MultiSelectWithSearch } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib';

// Định nghĩa interface cho props
interface SelectRoomTypeProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  options: ISource[];
  required?: boolean;
  loading?: boolean;
  maxWidth?: string;
  maxTagCount?: number;
  form?: FormInstance;
}

const SelectRoomType = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  options,
  maxWidth,
  required = false,
  maxTagCount = 2,
  form,
  ...props
}: SelectRoomTypeProps) => {
  return (
    <MyFormItem
      name={name || 'bookingItems.roomTypeId'}
      initialValue={''}
      label={label || 'Room Type'}
      required={required}
      disabled={isDisabled}
      form={form}
      {...props}
    >
      <MultiSelectWithSearch
        maxTagCount={maxTagCount}
        options={options}
        maxWidth={maxWidth ? maxWidth : '350px'}
        onChange={onChange}
      />
    </MyFormItem>
  );
};

export default SelectRoomType;
