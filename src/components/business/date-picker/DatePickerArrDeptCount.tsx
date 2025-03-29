import { MyDateRangePickerSingle } from '@/components/basic/range-picker';
import React, { useEffect, useState } from 'react';
import { ReactComponent as MoonSvg } from '@/assets/icons/ic_moon_star.svg';
import dayjs, { Dayjs } from 'dayjs';
import { css } from '@emotion/react';
import { MyFormItem } from '@/components/basic/form-item';
import { Form } from 'antd';

interface DatePickerArrDeptCountProps {
  onDateChange?: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  value?: [string, string] | null;
  disabled?: boolean;
  isReset?: boolean;
  arrDeptDate?: [string, string] | null;
  className?: string;
  label?: string;
}

const DatePickerArrDeptCount: React.FC<DatePickerArrDeptCountProps> = ({
  onDateChange,
  value,
  disabled = false,
  isReset = false,
  arrDeptDate,
  label = 'Arrival Date - Departure Date',
  className = 'arr-dept-count',
}) => {
  const form = Form.useFormInstance();
  const today = dayjs();
  const defaultStartDate = today;
  const defaultEndDate = today.add(1, 'day');
  const [initialDateRange, setInitialDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(
    value
      ? [dayjs(value[0]), dayjs(value[1])]
      : [defaultStartDate, defaultEndDate]
  );
  const [nights, setNights] = useState<number>(1);

  const handleDateChange = (dates: string[] | null) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dayjs(dates[0]);
      const endDate = dayjs(dates[1]);
      const diffNights = endDate.diff(startDate, 'day'); // Tính số ngày giữa 2 ngày
      const convertedDates: [Dayjs | null, Dayjs | null] = [startDate, endDate];
      setNights(diffNights);

      if (onDateChange) {
        onDateChange(convertedDates);
      }
    } else {
      setNights(0); // Đặt lại nếu không có ngày hợp lệ
      if (onDateChange) {
        onDateChange(null);
      }
    }
  };

  useEffect(() => {
    if (isReset) {
      setNights(1);
      setInitialDateRange([defaultStartDate, defaultEndDate]);
    }
  }, [isReset]);

  useEffect(() => {
    console.log(value);
    if (value) {
      const startDate = dayjs(value[0]);
      const endDate = dayjs(value[1]);
      setInitialDateRange([startDate, endDate]);
      setNights(endDate.diff(startDate, 'day'));
      form && form.setFieldsValue({ arr_dept: [startDate, endDate] });
    }
  }, [value]);

  // Styles định nghĩa bằng Emotion
  const containerStyle = css`
    position: relative;
  `;

  const rangePickerStyle = css`
    padding-right: 120px;
    width: 100%;
    display: flex;
    // border: 1px solid #e0e0e0;
  `;

  const countNightStyle = css`
    padding: 2px 8px;
    border-radius: 8px;
    display: flex;
    gap: 5px;
    background-color: #bbf7d0;
    color: #166534;
    position: absolute;
    top: 40px;
    right: 12px;
    align-items: center;
    font-size: 13px;
  `;

  const disabledDate = (current: Dayjs) => {
    if (!current) return false;

    const today = dayjs().startOf('day');
    if (current < today) return true;

    if (arrDeptDate) {
      const [minDate, maxDate] = arrDeptDate.map(date =>
        dayjs(date).startOf('day')
      );
      return current < minDate || current > maxDate;
    }

    return false;
  };

  return (
    <div className="range-wrapper" css={containerStyle}>
      <MyFormItem
        initialValue={initialDateRange}
        name="arr_dept"
        label={label}
        disabled={disabled}
        required
      >
        <MyDateRangePickerSingle
          // placeholder={['', '']}
          css={rangePickerStyle}
          onChange={handleDateChange}
          disabledDate={disabledDate}
          className={className}
        />
      </MyFormItem>
      <div className="count-night" css={countNightStyle}>
        <MoonSvg />
        <span>{nights}</span>
        <span>Night{nights !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
};

export default DatePickerArrDeptCount;
