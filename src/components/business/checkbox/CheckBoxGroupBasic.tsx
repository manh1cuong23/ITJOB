import MyCheckBoxGroup from './MyCheckBoxGroup';
import { MyFormItem } from '@/components/basic/form-item';

interface IProps {
  disabled?: boolean;
  name?: string;
  label?: string;
  loading?: boolean;
  required?: boolean;
  defaultValue?: string[];
  options: string[];
}

const CheckBoxGroupBasic = (props: IProps) => {
  const {
    disabled = false,
    name,
    label,
    loading = false,
    required = false,
    options,
  } = props;

  return (
    <MyFormItem
      name={name}
      label={label}
      required={required}
      disabled={disabled}
    >
      <MyCheckBoxGroup options={options} loading={loading} />
    </MyFormItem>
  );
};

export default CheckBoxGroupBasic;
