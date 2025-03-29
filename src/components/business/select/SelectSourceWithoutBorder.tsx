import {
  MultipleSelectWithoutBorder,
  SelectCompact,
  SelectCompactWithoutBorder,
} from '@/components/basic/select';
import { Form } from 'antd';
import { FormInstance, useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';

// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  hotelId?: string | null; 
  form?: FormInstance;
  maxWidth?: string;
}

const SelectSourceWithoutBorder = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder = "Select",
  label,
  name,
  hotelId,
  maxWidth,
  form,
  ...props
}: IProps) => {
  const options = [
    {
      label: 'Allotment',
      value: 'A',
    },
    {
      label: 'Other',
      value: 'O',
    },
  ];
  useEffect(() => {
    if (hotelId) {
      form?.setFieldsValue({ [name || 'sourceId']: undefined });
    }
  }, [hotelId]);

  return (
    <Form.Item
        name={name || 'sourceId'}
        {...props}>
        <MultipleSelectWithoutBorder 
          options={options}
          maxWidth={maxWidth}
          prefix="Source: " 
          placeholder={placeholder}
          onChange={onChange}
        />
      </Form.Item>
  );
};

export default SelectSourceWithoutBorder;
