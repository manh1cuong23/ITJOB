import { MyFormItem } from '@/components/basic/form-item';
import { MultiSelectWithSearch } from '@/components/basic/select';
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
  options?: ISource[];
  isReset?: boolean;
}

const SelectRoomNo = ({
  required = false,
  onChange,
  isDefault,
  disabled = false,
  placeholder,
  label,
  name,
  isReset,
  options = [
    {
      label: 'All',
      value: 'All',
    },
  ],
  ...props
}: IProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleBlur = () => {
    console.log('options');
    if (!options || options.length < 1) {
      setError('Please add room to process');
    } else {
      setError(null);
    }
  };

  useEffect(() => {
    isReset && setError(null);
  }, [isReset]);

  return (
    <MyFormItem
      name={name || 'room-no'}
      label={label || 'Room No'}
      {...props}
      required={required}
      disabled={disabled}
      initialValue={disabled ? options : ''}>
      {disabled ? (
        <MultiSelectWithSearch
          maxTagCount={3}
          options={options}
          // nameSort={props?.nameSort}
          onChange={onChange}
        />
      ) : (
        <>
          <MultiSelectWithSearch
            maxTagCount={3}
            options={options}
            // nameSort={props?.nameSort}
            onChange={onChange}
            onBlur={handleBlur}
          />
          {error && <div className="ant-form-item-explain-error">{error}</div>}
        </>
      )}
    </MyFormItem>
  );
};

export default SelectRoomNo;
