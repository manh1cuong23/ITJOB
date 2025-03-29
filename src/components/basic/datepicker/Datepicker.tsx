import { FC, useEffect, useState } from 'react';
import { DatePicker, DatePickerProps, Skeleton } from 'antd';
import { ReactComponent as DatePickerSvg } from '@/assets/icons/ic_calendar.svg';
import moment from 'moment';
import './style.less';
import dayjs from 'dayjs';

interface MyDatePickerProps {
  allowClear?: boolean;
  /**
   * Value should be in the format 'YYYY-MM-DD'.
   * Example: '2024-10-16'
   */
  value?: string | null;
  /**
   * onChange will return the date in the format 'YYYY-MM-DD'.
   */
  onChange?: (date: string) => void;
  placeholder?: string;
  disabledDate?: (currentDate: dayjs.Dayjs) => boolean;
  loading?: boolean;
  defaultDate?: string;
  disabled?: boolean;
}

const MyDatePicker: FC<MyDatePickerProps> = ({
  allowClear = true,
  value,
  onChange,
  placeholder,
  disabledDate,
  defaultDate,
  loading = false,
  disabled = false,
  ...rest
}) => {
  const [parsedDate, setParsedDate] = useState<dayjs.Dayjs | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(loading);
  // Hàm xử lý sự kiện onChange từ DatePicker của Ant Design
  const handleDateChange = (
    _date: dayjs.Dayjs,
    dateString: string | string[]
  ) => {
    if (onChange && typeof dateString === 'string' && _date) {
      onChange(_date.format('YYYY-MM-DD'));
    } else {
      onChange && onChange('');
    }
  };
  useEffect(() => {
    const parsedDate = value ? dayjs(value, 'YYYY-MM-DD') : null;
    setParsedDate(parsedDate);
  }, [value]);

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true);
    } else {
      const timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 300); // Thời gian ẩn hiện
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  return (
    <div className="my-datepicker-container" style={{ position: 'relative' }}>
      <Skeleton.Input
        active
        className="my-skeleton-input "
        style={{
          opacity: showSkeleton ? 1 : 0,
        }}
      />
      <DatePicker
        className={`my-date-picker my-input ${
          parsedDate && allowClear ? 'can-hide-icon' : ''
        }`}
        disabled={disabled}
        allowClear={allowClear}
        format={'DD/MM/YYYY'}
        value={parsedDate}
        suffixIcon={<DatePickerSvg style={{ marginRight: '-6px' }} />}
        onChange={handleDateChange}
        placeholder={placeholder || 'Select'}
        disabledDate={disabledDate}
        defaultPickerValue={
          defaultDate ? dayjs(defaultDate, 'YYYY-MM-DD') : dayjs()
        }
        style={{
          width: '100%',
          opacity: showSkeleton ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
        {...rest}
      />
    </div>
  );
};

export default MyDatePicker;
