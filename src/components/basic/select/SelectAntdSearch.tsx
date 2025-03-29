import { SelectCompact } from '@/components/basic/select';
import { ISource } from '@/utils/formatSelectSource';
import { useEffect, useState } from 'react';
import unorm from 'unorm';

// Define interface for props
interface IProps {
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  name?: string;
  options: ISource[];
  loading?: boolean;
  value?: string;
}

const SelectAntdSearch = ({
  onChange,
  disabled = false,
  placeholder,
  options,
  loading = false,
  value
}: IProps) => {
  const [filteredOptions, setFilteredOptions] = useState<ISource[]>(options);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const handleSearch = (value: string) => {
    const normalizedValue = unorm.nfkd(value).toLowerCase();
    const filtered = options.filter(option => 
      typeof option.label === 'string' &&
      unorm.nfkd(option.label).toLowerCase().includes(normalizedValue) // Chuẩn hóa và tìm kiếm
    );
    setFilteredOptions(filtered);
  };

  return (
    <SelectCompact
      onSearch={handleSearch}
      options={filteredOptions}
      placeholder={placeholder || 'Select'}
      onChange={onChange}
      showSearch
      filterOption={false}
      disabled={disabled}
      loading = {loading}
      value={value}
    />
  );
};

export default SelectAntdSearch;
