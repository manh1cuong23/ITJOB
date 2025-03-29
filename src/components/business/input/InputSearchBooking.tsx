import { FC } from 'react';
import { SearchProps } from 'antd/lib/input';
import MySearchInput from '../../basic/input/InputSearch';
import { MyFormItem } from '../../basic/form-item';

interface InputSearchBookingProps extends SearchProps {
  label?: string;
  placeholder?: string; 
}

const InputSearchBooking: FC<InputSearchBookingProps> = ({
  placeholder="Search by Booking No, Hotel, Guest Name"
}) => {
  return (
    <MyFormItem name={'keyword'}>
      <MySearchInput
        style={{ width: '190px' }}
        placeholder={placeholder}
      />
    </MyFormItem>
  );
};

export default InputSearchBooking;
