import { getTypeID } from '@/api/features/typeID';
import { MyFormItem } from '@/components/basic/form-item';
import { SelectCompact } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { FormInstance } from 'antd';
import { useEffect, useState } from 'react';

// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  disabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  required?: boolean;
  options?: ISource[];
  form?: FormInstance;
  isShowLabel?: boolean;
  noInitValue?: boolean;
  messageError?: string | undefined;
  defaultValue?: any;
  loading?: boolean;
  isHideErrorMessage?: boolean;
  rules?: any;
}

const SelectBasic = ({
  required = false,
  onChange,
  isDefault,
  defaultValue,
  messageError = undefined,
  disabled = false,
  noInitValue = false,
  placeholder,
  label,
  isHideErrorMessage,
  options = [],
  name,
  isShowLabel = true,
  form,
  loading = false,
  ...props
}: IProps) => {
  const [initialValue, setInitialValue] = useState<string[]>([]);

  useEffect(() => {
    if (options && !noInitValue) {
      const allValues = options.map(item => item.value);
      setInitialValue(allValues);
      form && form.setFieldsValue({ [name || 'select']: allValues });
    } else {
      setInitialValue([]);
      form && form.setFieldsValue({ [name || 'select']: [] });
    }
  }, [options, noInitValue]);
  return (
    <MyFormItem
      messageError={messageError}
      name={name || 'select'}
      isShowLabel={isShowLabel}
      isHideErrorMessage={isHideErrorMessage}
      label={isShowLabel ? label || 'Select' : ''}
      {...props}
      initialValue={defaultValue}
      required={required}
      disabled={disabled}
    >
      <SelectCompact
        loading={loading}
        onChange={onChange}
        options={options}
        placeholder="Select"
      />
    </MyFormItem>
  );
};

export default SelectBasic;
