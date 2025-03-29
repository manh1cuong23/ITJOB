import { FC } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select'; // Import SelectProps
import './style.less';

interface SelectCompactProps extends SelectProps {
  name?: string;
  value?: string; // Thêm value vào props
  onChange?: (value: string) => void; // Thêm onChange vào props
  options: { label: string; value: string }[];
}

const SelectCompactWithoutBorder: FC<SelectCompactProps> = ({
  name,
  value,
  onChange, 
  options,
  ...rest
}) => {
  return (
    <Select
      {...rest}
      value={value}
      onChange={onChange} 
      className="my-select-without-border"
    >
      {options?.map(
        (
          option
        ) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        )
      )}
    </Select>
  );
};

export default SelectCompactWithoutBorder;
