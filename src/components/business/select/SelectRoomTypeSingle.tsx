import { getRoomTypeByHotelId } from '@/api/features/roomType';
import { MyFormItem } from '@/components/basic/form-item';
import { SelectCompact } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib';
import { useCallback, useEffect, useRef, useState } from 'react';

// Định nghĩa interface cho props
interface SelectRoomTypeProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  disabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  options?: ISource[]; // Các tùy chọn select (nếu muốn truyền vào từ ngoài)
  hotelId: string[] | string | null;
  required?: boolean;
  form?: FormInstance;
  selectedSource?: string | null;
}

const SelectRoomTypeSingle = ({
  onChange,
  isDefault,
  disabled,
  hotelId,
  placeholder = 'Select',
  label,
  name,
  options,
  required = false,
  form,
  selectedSource,
  ...props
}: SelectRoomTypeProps) => {
  const initialValue =
    options && options?.length > 0 ? options?.map(item => item.value) : [];
  const [roomTypeOptions, setRoomTypeOptions] =
    useState<ISource[]>(initialValue);
  const fetchData = async () => {
    if (!options) {
      const res = await getRoomTypeByHotelId(hotelId);
      setRoomTypeOptions(
        res.data.map((item: any) => ({
          label: item.name,
          value: item.name,
          code: item.code,
        }))
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [hotelId]);
  return (
    <MyFormItem
      name={name || 'roomType'}
      initialValue={initialValue}
      label="Room type"
      required={required}
      disabled={disabled}
      form={form}
      {...props}>
      <SelectCompact options={roomTypeOptions} onChange={onChange} />
    </MyFormItem>
  );
};

export default SelectRoomTypeSingle;
