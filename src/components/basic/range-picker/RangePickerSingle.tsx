import { CSSProperties, FC, useEffect, useState, forwardRef } from 'react';
import { ReactComponent as DatePickerSvg } from '@/assets/icons/ic_date.svg';
import { ReactComponent as ArrowSvg } from '@/assets/icons/ic_arrow.svg';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, message } from 'antd';
import './styleSingle.less';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { DatePickerProps } from 'antd/lib';

const { RangePicker } = DatePicker;

interface MyDateRangePickerProps {
  disabledDate?: (current: Dayjs) => boolean;
  onChange?: (dates: string[] | null) => void;
  value?: [string, string] | null;
  placeholder?: undefined | [string, string];
  style?: CSSProperties | undefined;
  className?: string;
  dateDisabled?: Array<[string, string]> | null;
  arrDeptDate?: [string, string] | null;
  disabledCurrent?: boolean;
  maxDay?: number;
}

// Sử dụng forwardRef
const MyDateRangePickerSingle = forwardRef<any, MyDateRangePickerProps>(
  (
    {
      onChange,
      value,
      placeholder = ['Select', 'Select'],
      style,
      className,
      disabledDate,
      dateDisabled,
      disabledCurrent = false,
      arrDeptDate,
      ...rest
    },
    ref
  ) => {
    // Thiết lập ngày mặc định là ngày hiện tại + 1 ngày
    const today = dayjs();
    const defaultStartDate = today;
    const defaultEndDate = today.add(1, 'day');
    dayjs.extend(isSameOrBefore);

    // Chuyển đổi giá trị từ string sang Dayjs
    const initialDates: [Dayjs | null, Dayjs | null] | null = value
      ? [dayjs(value[0]), dayjs(value[1])]
      : [defaultStartDate, defaultEndDate];

    const [dateRange, setDateRange] = useState<
      [Dayjs | null, Dayjs | null] | null
    >(initialDates);

    const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
      setDateRange(dates);
      if (dates && dates[0] && dates[1]) {
        const formattedDates = [
          dates[0].format('YYYY-MM-DD'),
          dates[1].format('YYYY-MM-DD'),
        ];
        setDateRange(dates);
        onChange && onChange(formattedDates);
      } else {
        onChange && onChange(null);
      }
    };

    const isValidDateFormat = (date: string | undefined): boolean => {
      return !!date && dayjs(date, 'YYYY-MM-DD', true).isValid();
    };

    useEffect(() => {
      if (value) {
        setDateRange([dayjs(value[0]), dayjs(value[1])]);
      } else {
        setDateRange(null);
      }
    }, [value]);

    const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();

    const disabled: DatePickerProps['disabledDate'] = (
      current,
      { from, type }
    ) => {
      if (from && dateDisabled !== null && dateDisabled) {
        const minDate = from;
        const maxDate =
          dateDisabled
            .map(range =>
              Array.isArray(range) && range[0]
                ? dayjs(range[0], 'YYYY-MM-DD')
                : null
            )
            .filter(
              (disabledStart): disabledStart is Dayjs =>
                disabledStart !== null && disabledStart.isAfter(minDate, 'day')
            )
            .sort((a, b) => (a && b ? a.diff(b, 'day') : 0))[0] || null;

        if (current.isBefore(minDate, 'day')) {
          return true;
        }

        switch (type) {
          case 'year':
            return (
              current.year() < minDate.year() || current.year() > maxDate.year()
            );

          case 'month':
            return getYearMonth(current) < getYearMonth(minDate);

          default:
            return (
              maxDate !== null &&
              current.diff(from, 'days') >= maxDate.diff(minDate, 'days')
            );
        }
      }
      const today = dayjs().startOf('day');
      if (disabledCurrent && current.isAfter(today)) {
        return true;
      }

      if (!dateDisabled) {
        if (arrDeptDate && arrDeptDate[0] && arrDeptDate[1]) {
          const start = dayjs(arrDeptDate?.[0]).startOf('day');
          const end = dayjs(arrDeptDate?.[1]).endOf('day');
          if (current.isBefore(start) || current.isAfter(end)) {
            return true;
          }
        } else {
          if (current.isBefore(today) && !disabledCurrent) {
            return true;
          }
        }
      }

      if (Array.isArray(dateDisabled) && dateDisabled.length > 0) {
        return dateDisabled.some(disabledRange => {
          if (disabledRange.length === 2) {
            const start = dayjs(disabledRange[0]).startOf('day');
            const end = dayjs(disabledRange[1]).endOf('day');
            return current.isSameOrAfter(start) && current.isSameOrBefore(end);
          }
          return false;
        });
      }

      return false;
    };

    return (
      <RangePicker
        className={`my-date-range-picker ${className}`}
        style={style}
        value={dateRange}
        onChange={handleChange}
        disabledDate={disabled}
        suffixIcon={<DatePickerSvg />}
        separator={<ArrowSvg />}
        format="DD/MM/YYYY"
        placeholder={placeholder}
        {...rest}
      />
    );
  }
);

export default MyDateRangePickerSingle;
