import { MyFormItem } from '@/components/basic/form-item';
import { MyInput } from '@/components/basic/input';
import { FormInstance } from 'antd';

interface IProps {
  form: FormInstance;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
  status?: 'error' | 'warning' | '';
  loading?: boolean;
  placeholder?: string;
  tabIndex?: number;
}
const InputPhone = (props: IProps) => {
  const {
    form,
    disabled,
    required = true,
    onChange,
    status = '',
    loading = false,
    placeholder = 'Enter',
    tabIndex,
  } = props;

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = event.which || event.keyCode;
    const char = event.key;

    // Bỏ qua sự kiện nếu phím là Tab
    if (event.key === 'Tab') {
      return;
    }
    if (
      charCode === 8 ||
      charCode === 46 ||
      (charCode >= 37 && charCode <= 40) ||
      (event.ctrlKey &&
        (event.key === 'a' ||
          event.key === 'c' ||
          event.key === 'v' ||
          event.key === 'z'))
    ) {
      return;
    }

    if (
      char === '+' &&
      event.currentTarget.value.indexOf('+') === -1 &&
      event.currentTarget.selectionStart === 0
    ) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <MyFormItem
      form={form}
      name="phone"
      label="Phone"
      required={required}
      disabled={disabled}
      rules={[
        {
          pattern: /^\+?\d{8,12}$/,
          message: 'Invalid Phone',
        },
      ]}>
      <MyInput
        placeholder={placeholder}
        onKeyDown={handleKeyPress}
        maxLength={12}
        minLength={8}
        onChange={e => onChange && onChange(e.target.value)}
        status={status}
        loading={loading}
        // tabIndex={tabIndex}
      />
    </MyFormItem>
  );
};

export default InputPhone;
