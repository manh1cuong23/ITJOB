import {
  MultipleSelectWithoutBorder,
  MultiSelectWithSearch,
  SelectCompact,
  SelectCompactWithoutBorder,
} from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib';
import { useEffect, useState } from 'react';

// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  disabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  options: ISource[];
  hotelId?: string | null;
  form?: FormInstance;
  maxWidth?: string;
}

const SelectRoomTypeWithoutBorder = ({
  onChange,
  isDefault,
  disabled,
  placeholder = "Select",
  label,
  name,
  options,
  hotelId,
  maxWidth,
  form,
  ...rest
}: IProps) => {
  useEffect(() => {
    if (hotelId) {
      form?.setFieldsValue({ [name || 'roomTypeCode']: undefined });
    }
  }, [hotelId]);

  return (
    <Form.Item name={name || 'roomTypeCode'}>
      <MultipleSelectWithoutBorder
        options={options}
        maxWidth={maxWidth}
        prefix="Room Type: "
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
      />
    </Form.Item>
  );
};


export default SelectRoomTypeWithoutBorder;