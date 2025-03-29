import { MultiSelectWithSearch, SelectCompact } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';

// Định nghĩa interface cho props
interface SelectRoomTypeProps {
  onChange?: (value: any) => void;  // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean;              // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean;             // Biến để xác định có disable select hay không
  placeholder?: string;             // Placeholder cho select
  label?: string;                   // Label của form item
  name?: string;                    // Tên của form item
  options: ISource[];              // Các tùy chọn select (nếu muốn truyền vào từ ngoài)
}

const SelectPackage = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  options,
  ...props
}: SelectRoomTypeProps) => {
  return (
    <Form.Item
      label={label || 'Package'}
      name={name || 'packageCode'}
      initialValue={''}
      {...props}
    >
      <MultiSelectWithSearch
        // maxTagCount={3}
        options={options}
        />
    </Form.Item>
  );
};

export default SelectPackage;
