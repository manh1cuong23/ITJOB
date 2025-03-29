import { FC } from 'react';
import { SearchProps } from 'antd/lib/input';
import MySearchInput from '../../basic/input/InputSearch';
import { MyFormItem } from '../../basic/form-item';

interface InputSearchBookingProps extends SearchProps {
  label?: string;
  placeholder?: string;
  isQuickSearch?: boolean;
}

const InputSearchService: FC<InputSearchBookingProps> = ({
  placeholder,
  isQuickSearch = false,
}) => {
  return (
    <MyFormItem name={'keyword'}>
      <MySearchInput
        isQuickSearch={isQuickSearch}
        // onChange={}
        // style={{ width: '400px' }}
        // width={500}
        placeholder={placeholder ? placeholder : 'Search by Code, Hotel, Name'}
      />
    </MyFormItem>
  );
};

export default InputSearchService;
