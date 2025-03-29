import { MultipleSelectWithoutBorder } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form, FormInstance } from 'antd';
import { useEffect } from 'react';

interface IProps {
  onChange?: (value: any) => void; // Hàm callback khi chọn giá trị
  placeholder?: string; // Placeholder
  label?: string; // Label của form item
  name?: string; // Tên trường form
  options?: ISource[]; // Danh sách các trạng thái
  form?: FormInstance; // Instance của form (nếu có)
}

const MultiSelectStatus = ({
  onChange,
  placeholder = 'Select',
  label = 'Status',
  name = 'status',
  options = [
    { label: 'Waiting', value: '1' },
    { label: 'Rejected', value: '2' },
    { label: 'Confirmed', value: '3' },
    { label: 'Checked In', value: '4' },
    { label: 'Checked out', value: '5' },
    { label: 'Cancelled', value: '6' },
    { label: 'Closed', value: '7' },
  ],
  form,
  ...rest
}: IProps) => {
  return (
    <Form.Item name={name} label={label} {...rest}>
      <MultipleSelectWithoutBorder
        options={options}
        onChange={onChange}
        placeholder={placeholder}
      />
    </Form.Item>
  );
};

export default MultiSelectStatus;
