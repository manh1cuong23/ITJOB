import { MultiSelectWithSearch } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { useState } from 'react';

// Định nghĩa interface cho props
interface SelectBookingStatusProps {
  onChange?: (value: any) => void;  // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean;              // Biến để xác định có phải giá trị mặc định không
  isDisabled?: boolean;             // Biến để xác định có disable select hay không
  placeholder?: string;             // Placeholder cho select
  label?: string;                   // Label của form item
  name?: string;                    // Tên của form item
  options: ISource[];              // Các tùy chọn select (nếu muốn truyền vào từ ngoài)
	maxTagCount?: number;
	maxWidth?: string;
}

const SelectBookingStatus = ({
  onChange,
  isDefault,
  isDisabled,
  placeholder,
  label,
  name,
  options,
	maxTagCount = 3,
	maxWidth,
  ...props
}: SelectBookingStatusProps) => {
  return (
    <Form.Item
      name={name || "bookingStatus"}
      label={"Booking Status"}
      initialValue={[1, 3]}
      {...props}
    >
      <MultiSelectWithSearch
				maxWidth={maxWidth}
        maxTagCount={maxTagCount}
        options={options}
        onChange={onChange}
        />
    </Form.Item>
  );
};

export default SelectBookingStatus;
