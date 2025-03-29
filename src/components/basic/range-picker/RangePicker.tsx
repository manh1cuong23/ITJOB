import React, { useState } from 'react';
import { DatePicker, Form } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import './style.less';

const { RangePicker } = DatePicker;

// Định nghĩa kiểu cho props
interface MyRangePickerProps {
    onChange?: (dates: string[] | null) => void;
    value?: [string, string] | null;
    labelFromDate?: string | JSX.Element;
    labelToDate?: string | JSX.Element;
    disabledDate?: any
}

const MyRangePicker: React.FC<MyRangePickerProps> = (
    { onChange,
        value,
        labelFromDate,
        labelToDate,
        disabledDate = undefined
    }) => {
    // Thiết lập ngày mặc định là ngày hiện tại + 30 ngày
    const today = dayjs();
    const defaultStartDate = today;
    const defaultEndDate = today.add(30, 'day');
    // Chuyển đổi giá trị từ string sang Dayjs
    const initialDates: [Dayjs | null, Dayjs | null] | null = value
        ? [dayjs(value[0]), dayjs(value[1])]
        : null;

    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(initialDates);

    const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        setDateRange(dates);
        if (dates && dates[0] && dates[1]) {
            // Chuyển đổi giá trị sang định dạng string YYYY-MM-DD
            const formattedDates = [
                dates[0].format('YYYY-MM-DD'),
                dates[1].format('YYYY-MM-DD'),
            ];
            onChange && onChange(formattedDates); // Gọi callback onChange
        } else {
            onChange && onChange(null); // Gọi callback với giá trị null nếu không có ngày
        }
    };

    const customDisabledDate = (current: Dayjs) => {
        if (dateRange && dateRange[0]) {
            return current.isBefore(dateRange[0]) || current.isAfter(dateRange[0].add(90, 'day'));
        }
        return disabledDate ? disabledDate(current) : false;
    };

    return (
        <div className="custom-range-picker-wrapper">
            <RangePicker
                style={{
                    width: '100%',
                    display: 'flex',
                }}
                suffixIcon={null}
                className="custom-range-picker"
                value={dateRange}
                onChange={handleChange}
                disabledDate={customDisabledDate}
                format="DD/MM/YYYY"
            />
            <div className="custom-input-icons">
                <CalendarOutlined className="icon icon1" />
                <CalendarOutlined className="icon icon2" />
            </div>
            <div className="custom-input-label">
                <p className='label label-from'>{labelFromDate || 'From date'}</p>
                <p className='label label-to'>{labelToDate || 'To date'}</p>
            </div>
        </div>
    );
};

export default MyRangePicker;