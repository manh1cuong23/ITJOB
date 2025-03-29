import { FC } from 'react';
import { Checkbox, Form, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { CheckboxChangeEvent, CheckboxProps } from 'antd/es/checkbox';

interface MyCheckboxProps extends CheckboxProps {
  hintText?: string; // Text hiển thị khi hover
  isOptional?: boolean; // Đánh dấu trường không bắt buộc
  isRequired?: boolean; // Đánh dấu trường bắt buộc
  helpText?: string; // Text hỗ trợ bên cạnh label
  label?: string;
  value?: boolean; // Giá trị của checkbox
  onChange?: (e: CheckboxChangeEvent) => void; // Hàm xử lý khi thay đổi
}

const MyCheckbox: FC<MyCheckboxProps> = ({
  hintText,
  isOptional,
  isRequired,
  helpText,
  label,
  value, // Giá trị của checkbox
  onChange, // Hàm xử lý thay đổi
  ...rest
}) => {
  return (
    <Checkbox checked={value} onChange={onChange} {...rest}>
      {label}
    </Checkbox>
  );
};

export default MyCheckbox;
