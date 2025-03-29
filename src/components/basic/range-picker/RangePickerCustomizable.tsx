import React, { useState, useEffect, useRef } from 'react';
import { DatePicker, Space, Tooltip } from 'antd';
import { ReactComponent as CalendarSvg } from '@/assets/icons/ic_calendar.svg';
import dayjs, { Dayjs } from 'dayjs';
import './style.less';
import { DatePickerProps } from 'antd/lib';

const { RangePicker } = DatePicker;

interface IProps {
  onChange?: (dates: [string, string] | null) => void;
  value?: [string, string] | null;
  disabled?: boolean;
  valueColor?: string;
  arrDeptDate?: [string, string] | null;
  className?: string;
  maxDay?: number;
  date?: [string, string] | null;
  showValue?: boolean;
  blockPastDates?: boolean;
}

const RangePickerCustomizable: React.FC<IProps> = ({
  onChange,
  value,
  disabled = false,
  valueColor,
  arrDeptDate,
  className,
  maxDay,
  date,
  showValue = true,
  blockPastDates = false,
}) => {
  const today = dayjs();
  const defaultStartDate = today.startOf('day');
  const defaultEndDate = today.add(1, 'day').startOf('day');
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(
    value
      ? [dayjs(value[0]), dayjs(value[1])]
      : showValue
      ? [defaultStartDate, defaultEndDate]
      : null
  );
  const [open, setOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value) {
      setDateRange([dayjs(value[0]), dayjs(value[1])]);
    } else {
      setDateRange(null);
    }
  }, [value]);

  useEffect(() => {
    if (date) {
      setDateRange([dayjs(date[0]), dayjs(date[1])]);
    } else {
      setDateRange(null);
    }
  }, [date]);

  const formatDisplay = (value: [Dayjs | null, Dayjs | null] | null) => {
    if (!value || !value[0] || !value[1]) return '-';

    const startDate = value[0].format('DD');
    const endDate = value[1].format('DD');
    const startMonth = value[0].format('MM');
    const endMonth = value[1].format('MM');
    const startYear = value[0].format('YYYY');
    const endYear = value[1].format('YYYY');

    return `${startDate}/${startMonth}/${startYear} - ${endDate}/${endMonth}/${endYear}`;
  };

  const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    // Kiểm tra nếu người dùng đã chọn cả ngày "from" và "to"
    if (dates && dates[0] && dates[1]) {
      // Format lại ngày tháng trước khi gửi qua onChange
      const formattedDates: [string, string] = [
        dates[0].format('YYYY-MM-DD'),
        dates[1].format('YYYY-MM-DD'),
      ];
      onChange && onChange(formattedDates); // Thực hiện onChange khi có đủ cả hai ngày
      setOpen(false); // Đóng RangePicker sau khi chọn xong
    } else {
      onChange && onChange(null); // Không thực hiện action nếu chưa chọn đủ
    }

    // Cập nhật lại state dateRange
    setDateRange(dates);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target as Node) &&
      open
    ) {
      const target = event.target as HTMLElement;

      if (
        target.closest('.ant-picker') ||
        target.closest('.ant-picker-header') ||
        target.closest('.ant-picker-body')
      ) {
        return;
      }
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();

  const disabledDate: DatePickerProps['disabledDate'] = (
    current,
    { from, type }
  ) => {
    if (arrDeptDate && arrDeptDate[0] && arrDeptDate[1]) {
      const start = dayjs(arrDeptDate?.[0]).startOf('day');
      const end = dayjs(arrDeptDate?.[1]).endOf('day');
      if (current.isBefore(start) || current.isAfter(end)) {
        return true;
      }
    }

    if (blockPastDates) {
      const today = dayjs().startOf('day');
      if (current.isBefore(today)) {
        return true;
      }
    }

    if (from && maxDay) {
      const minDate = from;
      const maxDate = from.add(maxDay, 'days');

      if (current.isBefore(minDate, 'day')) {
        return true;
      }

      switch (type) {
        case 'year':
          return (
            current.year() < minDate.year() || current.year() > maxDate.year()
          );

        case 'month':
          return (
            getYearMonth(current) < getYearMonth(minDate) ||
            getYearMonth(current) > getYearMonth(maxDate)
          );

        default:
          return Math.abs(current.diff(from, 'days')) >= maxDay;
      }
    }

    return false;
  };

  return (
    <div ref={datePickerRef}>
      <div
        onClick={() => setOpen(true)}
        className={`date-range-picker ${className ? className : ''} ${
          disabled ? 'disabled' : ''
        }}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '4px',
          padding: '8px 3px',
          cursor: 'pointer',
          justifyContent: 'space-between',
          zIndex: 1,
          width: '100%',
          color: 'black',
          fontWeight: 500,
          minWidth: '250px',
        }}
      >
        <span style={{ color: '#57534E', fontWeight: 500 }}>From-To:</span>
        <span
          className="date-value"
          style={{
            margin: '0 5px',
            wordBreak: 'break-word',
            color: valueColor ? valueColor : '#1C1917',
            fontWeight: 500,
          }}
        >
          {formatDisplay(dateRange)}
        </span>
        <CalendarSvg />
      </div>
      <RangePicker
        value={dateRange as [Dayjs, Dayjs]}
        onChange={handleChange}
        open={open}
        onClick={e => e.stopPropagation()}
        disabledDate={disabledDate}
        style={{ position: 'absolute', zIndex: -1, opacity: 0 }}
        disabled={disabled}
      />
    </div>
  );
};

export default RangePickerCustomizable;
