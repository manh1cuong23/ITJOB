import React, { useEffect, useState } from 'react';
import { Col, Form, message, Row } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import './style.less';

import './customRangpicker.less';
import { MyDatePicker } from '@/components/basic/datepicker';
import { MyFormItem } from '../form-item';

interface CustomDateRangePickerProps {
  /**
   * Value should be in the format 'YYYY-MM-DD'.
   * Example: ['2024-10-16',2024-10-19']
   */
  value?: [string, string] | null;
  /**
   * onChange will return the date in the format 'YYYY-MM-DD'.
   */
  onChange?: (dates: string[] | null) => void;
  labelFromDate?: string;
  labelToDate?: string;
  disabledDate?: (currentDate: Dayjs) => boolean;
  maxDays?: number | null;
  defaultStartDate?: string | null;
  defaultEndDate?: string | null;
  allowFuture?: boolean;
  allowedRange?: [string, string] | null;
  required?: boolean;
  placeholder?: string;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  value,
  onChange,
  placeholder,
  labelFromDate = 'From Date',
  labelToDate = 'To Date',
  maxDays = 90, // Giá trị mặc định là 90 ngày
  defaultStartDate = null,
  defaultEndDate = null,
  allowedRange = null,
  required = false,
}) => {
  const [startDate, setStartDate] = useState<string | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<string | null>(defaultEndDate);

  useEffect(() => {
    if (value) {
      setStartDate(
        value[0] ? dayjs(value[0]).format('YYYY-MM-DD') : defaultStartDate
      );
      setEndDate(
        value[1] ? dayjs(value[1]).format('YYYY-MM-DD') : defaultEndDate
      );
    }
  }, [value, defaultStartDate, defaultEndDate]);
  const handleStartDateChange = (date: string) => {
    const parsedDate = date ? dayjs(date) : null;
    const parsedEndDate = endDate ? dayjs(endDate) : null;

    if (parsedDate && parsedEndDate && parsedDate.isAfter(parsedEndDate)) {
      message.error('The start date cannot be later than the end date!');
    } else if (
      maxDays &&
      parsedDate &&
      parsedEndDate &&
      parsedDate.add(maxDays, 'day').isBefore(parsedEndDate)
    ) {
      message.error(`The duration must not exceed ${maxDays} days!`);
    } else {
      setStartDate(date);
      if (onChange) {
        onChange([date, endDate || '']);
      }
    }
  };

  const handleEndDateChange = (date: string) => {
    const parsedDate = date ? dayjs(date) : null;
    const parsedStartDate = startDate ? dayjs(startDate) : null;

    if (parsedDate && parsedStartDate && parsedDate.isBefore(parsedStartDate)) {
      message.error('The end date cannot be earlier than the start date!');
    } else if (
      maxDays &&
      parsedDate &&
      parsedStartDate &&
      parsedStartDate.add(maxDays, 'day').isBefore(parsedDate)
    ) {
      message.error(`The duration must not exceed ${maxDays} days!`);
    } else {
      setEndDate(date);
      if (onChange) {
        onChange([startDate || '', date]);
      }
    }
  };

  const disabledEndDate = (current: Dayjs) => {
    const parsedStartDate = startDate ? dayjs(startDate, 'YYYY-MM-DD') : null;

    if (!parsedStartDate) {
      return (
        allowedRange &&
        (current.isBefore(dayjs(allowedRange[0])) ||
          current.isAfter(dayjs(allowedRange[1])))
      );
    }

    const maxDaysValid = maxDays !== null;

    return (
      // current.isSame(parsedStartDate, 'day') ||
      current.isBefore(parsedStartDate, 'day') ||
      (maxDaysValid && parsedStartDate.add(maxDays, 'day').isBefore(current)) ||
      (allowedRange &&
        (current.isBefore(dayjs(allowedRange[0])) ||
          current.isAfter(dayjs(allowedRange[1]))))
    );
  };

  const disabledStartDate = (current: Dayjs) => {
    const parsedEndDate = endDate ? dayjs(endDate, 'YYYY-MM-DD') : null;

    if (!parsedEndDate) {
      return (
        allowedRange &&
        (current.isBefore(dayjs(allowedRange[0])) ||
          current.isAfter(dayjs(allowedRange[1])))
      );
    }

    const maxDaysValid = maxDays !== null;
    return (
      // current.isSame(parsedEndDate, 'day') ||
      current.isAfter(parsedEndDate, 'day') ||
      (maxDaysValid &&
        current.isBefore(parsedEndDate.subtract(maxDays, 'day'))) ||
      (allowedRange &&
        (current.isBefore(dayjs(allowedRange[0])) ||
          current.isAfter(dayjs(allowedRange[1]))))
    );
  };

  return (
    <Row gutter={24}>
      <Col xs={12} className="from-date">
        <p className="label-item">
          {labelFromDate}{' '}
          {required && <span className="required-field">*</span>}
        </p>
        <MyDatePicker
          allowClear={!required}
          value={startDate}
          onChange={handleStartDateChange}
          defaultDate={defaultStartDate || ''}
          placeholder={placeholder || labelFromDate}
          disabledDate={current => disabledStartDate(current) ?? false}
        />
      </Col>
      <Col xs={12} className="to-date">
        <p className="label-item">
          {labelToDate} {required && <span className="required-field">*</span>}
        </p>
        <MyDatePicker
          allowClear={!required}
          value={endDate}
          defaultDate={defaultEndDate || ''}
          onChange={handleEndDateChange}
          placeholder={placeholder || labelToDate}
          disabledDate={current => disabledEndDate(current) ?? false}
        />
      </Col>
    </Row>
  );
};

export default CustomDateRangePicker;
