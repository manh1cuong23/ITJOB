import { FC } from 'react';
import './style.less';
import { SingleSelectSearchCustom } from '.';

interface SelectCompactProps {
  name?: string;
  value?: string;
  onChange?: (value: any) => void;
  options: { label: string; value: string }[];
  prefix?: string;
  disabled?: boolean;
  maxWidth?: string;
}

const SingleSelectWithoutBorder: FC<SelectCompactProps> = ({
  name,
  value,
  onChange,
  options,
  prefix,
  disabled = false,
  maxWidth,
  ...rest
}) => {
  return (
    <SingleSelectSearchCustom
      options={options}
      prefix={prefix}
      className="multiple-select-without-border"
      onChange={onChange}
      defaultOption="N/A"
      value={value}
      maxWidth={maxWidth}
      style={{ background: '#F5F5F4' }}
      disabled={disabled}
      {...rest}
    />
  );
};

export default SingleSelectWithoutBorder;
