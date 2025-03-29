import { getSalutation } from '@/api/features/salutation';
import { MyFormItem } from '@/components/basic/form-item';
import {
  MultipleSelectWithoutBorder,
  SelectCompact,
  SelectCompactWithoutBorder,
} from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { useEffect, useState } from 'react';

// Định nghĩa interface cho props
interface IProps {
  onChange?: (value: any) => void; // Hàm onChange khi người dùng chọn giá trị
  isDefault?: boolean; // Biến để xác định có phải giá trị mặc định không
  disabled?: boolean; // Biến để xác định có disable select hay không
  placeholder?: string; // Placeholder cho select
  label?: string; // Label của form item
  name?: string; // Tên của form item
  loading?: boolean;
}

const SelectSalutation = ({
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

  const fetchData = async () => {
    const response = await getSalutation();
    setOptions(
      response.data.map((item: any) => ({ value: item.code, label: item.name }))
    );
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <MyFormItem
      name={name || 'salutation'}
      label={label || 'Salutation'}
      disabled = {disabled}
      {...props}>
      <SelectCompact options={options} placeholder="Select" loading ={loading}/>
    </MyFormItem>
  );
};

export default SelectSalutation;
