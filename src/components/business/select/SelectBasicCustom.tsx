import { getTypeID } from '@/api/features/typeID';
import { MyFormItem } from '@/components/basic/form-item';
import { SelectCompact } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { FormInstance } from 'antd';
import { useEffect, useState } from 'react';
export interface ISourceHtmlLabel {
  label: any;
  value: any;
  disabled?: boolean;
  id?: number;
  packages?: any;
  marketSegmentId?: number;
  status?: any;
}
// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  disabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  required?: boolean;
  options?: ISourceHtmlLabel[];
  form?: FormInstance;
  isShowLabel?: boolean;
  noInitValue?: boolean;
  defaultValue?: any;
  loading?: boolean;
  rules?: any;
  isHideErrorMessage?: boolean;
  className?: string;
  value?: any;
}

const SelectBasicCustom = ({
  required = false,
  isHideErrorMessage = false,
  onChange,
  isDefault,
  defaultValue,
  disabled = false,
  noInitValue = false,
  placeholder,
  label,
  rules,
  value,
  options = [],
  name,
  isShowLabel = true,
  form,
  loading = false,
  className,
  ...props
}: IProps) => {
  const [initialValue, setInitialValue] = useState<any>(defaultValue || []);

  // useEffect(() => {
  //   console.log('vo dayyy');
  //   if (defaultValue !== undefined) {
  //     // Ưu tiên sử dụng defaultValue nếu được truyền vào
  //     setInitialValue(defaultValue);
  //     form && form.setFieldsValue({ [name || 'select']: defaultValue });
  //   } else if (options && !noInitValue) {
  //     // Nếu không có defaultValue, sử dụng toàn bộ giá trị từ options
  //     const allValues = options.map(item => item.value);
  //     setInitialValue(allValues);
  //     form && form.setFieldsValue({ [name || 'select']: allValues });
  //   } else {
  //     // Nếu không có giá trị nào, đặt rỗng
  //     setInitialValue([]);
  //     form && form.setFieldsValue({ [name || 'select']: [] });
  //   }
  // }, [options, noInitValue]);

  return (
    <MyFormItem
      name={name || 'select'}
      rules={rules}
      isShowLabel={isShowLabel}
      label={isShowLabel ? label || 'Select' : ''}
      {...props}
      initialValue={initialValue}
      isHideErrorMessage={isHideErrorMessage}
      required={required}
      disabled={disabled}>
      <SelectCompact
        loading={loading}
        onChange={onChange}
        className={className}
        options={options}
        placeholder={placeholder || 'Select'}
      />
    </MyFormItem>
  );
};

export default SelectBasicCustom;
