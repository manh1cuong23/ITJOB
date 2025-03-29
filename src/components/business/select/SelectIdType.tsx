import { getTypeID } from '@/api/features/typeID';
import { MyFormItem } from '@/components/basic/form-item';
import {
  SelectCompact,
} from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
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
  loading: boolean;
}

const SelectIdType = ({
  required = false,
  onChange,
  isDefault,
  disabled = false,
  placeholder,
  label,
  name,
  loading = false,
  ...props
}: IProps) => {
  const [options, setOptions] = useState<ISource[]>([]);

  const fetchTypeID = async () => {
    const response = await getTypeID();
    setOptions(
      response.data.map((item: any) => ({ value: item.code, label: item.name }))
    );
  };

  useEffect(() => {
    fetchTypeID();
  }, []);

  return (
    <MyFormItem
      name={name || 'idType'}
      label={label || 'ID Type'}
      {...props}
      required={required}
      disabled ={disabled}
      >
      <SelectCompact options={options} placeholder="Select" loading ={loading}/>
    </MyFormItem>
  );
};

export default SelectIdType;
