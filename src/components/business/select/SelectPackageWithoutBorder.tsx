import {
  MultipleSelectWithoutBorder,
} from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { FormInstance } from 'antd/lib';

// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  options: ISource[];
  disabled?: boolean;
  hotelId?: string | null;
  form?: FormInstance;
  maxWidth?: string;
}

const SelectPackageWithoutBorder = ({
  onChange,
  isDefault,
  disabled,
  placeholder='Select',
  label,
  name,
  options,
  hotelId,
  form,
  maxWidth,
  ...props
}: IProps) => {
  useEffect(() => {
    if (hotelId) {
      form?.setFieldsValue({ [name || 'packageCode']: undefined });
    }
  }, [hotelId]);

  return (
    <Form.Item name={name || 'packageCode'} >
        <MultipleSelectWithoutBorder
          options={options}
          prefix={label || 'Package:'}
          disabled={disabled}
          maxWidth={maxWidth}
          placeholder={placeholder}
          onChange={onChange}
        />
      </Form.Item>
  );
};

export default SelectPackageWithoutBorder;
