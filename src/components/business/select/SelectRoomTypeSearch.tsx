import { getRoomTypeByHotelId } from '@/api/features/roomType';
import { MultiSelectWithSearch } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { useEffect, useState } from 'react';

// Định nghĩa interface cho props
interface SelectHotelsProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  options?: ISource[]; // Các tùy chọn select (nếu muốn truyền vào từ ngoài)
}

const SelectRoomTypeSearch = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  options,
  ...props
}: SelectHotelsProps) => {

  return (
    <Form.Item name={name || 'roomTypeId'} initialValue={''} {...props}>
      <MultiSelectWithSearch
        prefix="Room Type: "
        // maxTagCount={3}
        options={options || []}
        onChange={onChange}
        style={{ minWidth: '110px' }}
      />
    </Form.Item>
  );
};

export default SelectRoomTypeSearch;
