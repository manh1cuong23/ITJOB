import { MyFormItem } from '@/components/basic/form-item';
import { MyTextArea } from '@/components/basic/input';
interface IProps {
  disabled?: boolean;
  name: string;
  label?: string;
  onChange?: (value: string) => void;
  loading: boolean;
  required?: boolean;
  status?: 'error' | 'warning' | '';
  isShowLabel?: boolean;
}
const InputRemark = (props: IProps) => {
  const {
    disabled = false,
    name,
    label,
    onChange,
    loading = false,
    required = false,
    isShowLabel = false,
    status = '',
  } = props;
  return (
    <MyFormItem
      name={name}
      label={label}
      disabled={disabled}
      required={required}
      isShowLabel={isShowLabel}
      >
      <MyTextArea
        placeholder="Enter"
        onChange={e => onChange && onChange(e.target.value)}
        loading={loading}
        status={status}
      />
    </MyFormItem>
  );
};

export default InputRemark;
