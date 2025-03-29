import { getAllRoomType } from '@/api/features/roomType';
import { MyFormItem } from '@/components/basic/form-item';
import { SelectCompact } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { useEffect, useState } from 'react';

// Định nghĩa interface cho props
interface SelectRoomTypeProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  options?: ISource[]; // Các tùy chọn select (nếu muốn truyền vào từ ngoài)
}

const SelectRoomTypeSingle = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  options,
  ...props
}: SelectRoomTypeProps) => {
  const initialValue =
    options && options?.length > 0 ? options?.map(item => item.value) : [];
  const [roomTypeOptions, setRoomTypeOptions] =
    useState<ISource[]>(initialValue);
  const fetchData = async () => {
    if (!options) {
      const res = await getAllRoomType();
      setRoomTypeOptions(
        res.data.map((item: any) => ({
          label: item.roomTypeName,
          value: item.id,
          code: item.roomTypeCode,
        }))
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <MyFormItem
      name={name || 'roomType'}
      initialValue={initialValue}
      label="Room type"
      {...props}>
      <SelectCompact options={roomTypeOptions} />
    </MyFormItem>
  );
};

export default SelectRoomTypeSingle;
