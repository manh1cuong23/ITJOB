import { MyDateRangePickerSingle } from '@/components/basic/range-picker';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { ReactComponent as MoonSvg } from '@/assets/icons/ic_moon_star.svg';
import dayjs, { Dayjs } from 'dayjs';
import { css } from '@emotion/react';
import { MyFormItem } from '@/components/basic/form-item';
import { Form } from 'antd';

interface IProps {
  onDateChange?: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  value?: [string, string] | null;
  dateDisabled?: Array<[string, string]> | null;
  label?: string;
  showInfo?: boolean;
  infoTooltip?: string;
  disabled?: boolean;
  showValue?: boolean;
  name?: string;
  disabledCurrent?: boolean;
  required?: boolean;
  placeholder?: undefined | [string, string];
  arrDeptDate?: [string, string] | null;
}

const DatePickerSingle: React.FC<IProps> = ({
  onDateChange,
  value,
  dateDisabled,
  label = 'From Date - To Date',
  showInfo = false,
  infoTooltip = '',
  disabled = false,
  showValue = true,
  name = 'from_to_date',
  disabledCurrent,
  required = false,
  placeholder = ['', ''],
  arrDeptDate,
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
      : showValue
      ? [defaultStartDate, defaultEndDate]
      : null
  );

  const handleDateChange = (dates: string[] | null) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dayjs(dates[0]);
      const endDate = dayjs(dates[1]);
      const convertedDates: [Dayjs | null, Dayjs | null] = [startDate, endDate];

      if (onDateChange) {
        onDateChange(convertedDates);
      }
    } else {
      if (onDateChange) {
        onDateChange(null);
      }
    }
  };

  useEffect(() => {
    if (value) {
      const startDate = dayjs(value[0]);
      const endDate = dayjs(value[1]);
      setInitialDateRange([startDate, endDate]);
      form && form.setFieldsValue({ from_to_data: [startDate, endDate] });
    }
  }, [value]);

  const containerStyle = css`
    position: relative;
  `;

  const rangePickerStyle = css`
    width: 100%;
    display: flex;

    .ant-picker-suffix {
      order: -1 !important;
    }
  `;

  return (
    <div className="range-wrapper" css={containerStyle}>
      <MyFormItem
        initialValue={initialDateRange}
        name={name}
        label={label}
        required={required}
        showInfo={showInfo}
        disabled={disabled}
        infoTooltip={infoTooltip}
      >
        <MyDateRangePickerSingle
          placeholder={placeholder}
          css={rangePickerStyle}
          onChange={handleDateChange}
          dateDisabled={dateDisabled}
          arrDeptDate={arrDeptDate}
          disabledCurrent={disabledCurrent}
          maxDay={9}
        />
      </MyFormItem>
    </div>
  );
};

export default DatePickerSingle;
