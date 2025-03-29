import { SingleSelectWithoutBorder } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';

// Định nghĩa interface cho props
interface SelectRoomTypeProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  options: ISource[];
  maxWidth?: string;
}

const SelectHotelWithoutBorder = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  options,
  maxWidth,
  ...props
}: SelectRoomTypeProps) => {
  const extendOptions = [
    {
      label: 'N/A',
      value: 'N/A',
    },
    ...options,
  ];
  return (
    <Form.Item name={name || 'hotelId'} initialValue={'N/A'} {...props}>
      <SingleSelectWithoutBorder
        options={extendOptions}
        prefix="Hotel: "
        onChange={onChange}
        maxWidth={maxWidth}
        disabled={isDisabled}
      />
    </Form.Item>
  );
};

export default SelectHotelWithoutBorder;
