import React, { useEffect, useState } from 'react';
import { DatePicker, Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import './style.less';
import moment from 'moment';
import { ReactComponent as DatePickerSvg } from '@/assets/icons/ic_datepicker.svg';

const { RangePicker } = DatePicker;

// Định nghĩa kiểu cho props
interface MyRangePickerProps {
  onChange: (dates: string[] | null, key: string) => any;
  value?: [string, string] | null;
  disabledDate?: any;
}

const MyRangePickerSearch: React.FC<MyRangePickerProps> = ({
  onChange,
  value,
  disabledDate = undefined,
}) => {
  const initialDates: [Dayjs | null, Dayjs | null] | null = value
    ? [dayjs(value[0], 'YYYY-MM-DD'), dayjs(value[1], 'YYYY-MM-DD')]
    : null;
  const [isHover, setIsHover] = useState(false);
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(initialDates);
  useEffect(() => {
    setDateRange(initialDates);
  }, [value]);
  const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      const formattedDates = [
        dates[0].format('YYYY-MM-DD'),
        dates[1].format('YYYY-MM-DD'),
      ];
      onChange && onChange(formattedDates, 'date');
    } else {
      onChange && onChange(null, 'date');
    }
  };

  const customDisabledDate = (current: Dayjs) => {
    if (value && value[0] && value[1]) {
      const start = dayjs(value?.[0]).startOf('day');
      const end = dayjs(value?.[1]).endOf('day');
      if (current.isBefore(start) || current.isAfter(end)) {
        return true;
      }
    }
    return false;
  };
  return (
    <div
      style={{
        // height: 36,
        alignItems: 'center',
        display: 'flex',
        width: '200px',
        gap: 4,
      }}>
      <RangePicker
        style={{
          width: '100%',
          display: 'flex',
        }}
        separator="-"
        suffixIcon={<DatePickerSvg />}
        allowClear={false}
        className="custom-range-picker-search"
        value={dateRange}
        onChange={handleChange}
        disabledDate={customDisabledDate}
        format="DD/MM/YYYY"
      />
    </div>
  );
};

export default MyRangePickerSearch;
