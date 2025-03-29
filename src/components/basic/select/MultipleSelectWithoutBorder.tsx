import { FC } from 'react';
import './style.less';
import { MultiSelectWithSearch } from '.';
import { ISource } from '@/utils/formatSelectSource';

interface SelectCompactProps {
  name?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  options: { label: string; value: string }[];
  prefix?: string;
  placeholder?: string;
  disabled?: boolean;
  maxWidth?: string;
}

const MultipleSelectWithoutBorder: FC<SelectCompactProps> = ({
  name,
  value,
  onChange,
  options,
  prefix,
  disabled = false,
  placeholder,
  maxWidth,
  ...rest
}) => {
  return (
    <MultiSelectWithSearch
      options={options}
      prefix={prefix}
      className="multiple-select-without-border"
      onChange={onChange}
      value={value}
      style={{ background: '#F5F5F4' }}
      placeholder=""
      maxWidth={maxWidth}
      showCheckbox={false}
      disabled={disabled}
      {...rest}
    />
  );
};

export default MultipleSelectWithoutBorder;
