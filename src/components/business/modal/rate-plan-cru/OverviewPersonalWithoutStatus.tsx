import React from 'react';
import { Col, Row } from 'antd';
import DatepickerBasic from '@/components/business/date-picker/DatepickerBasic';
import { BOOKING_STATUS } from '@/constants/booking';
import SelectBasic from '@/components/business/select/SelectBasic';

const OverviewPersonalWithoutStatus: React.FC<{
  isViewMode?: boolean;
  options?: any;
  disabled?: boolean;
  selectedValue?: any;
  handleChangeRadio: (e: any) => void;
  loading?: boolean;
  form?: any;
}> = ({
  isViewMode,
  options,
  handleChangeRadio,
  loading,
  selectedValue,
  disabled,
  form,
}) => {
  return (
    <Row gutter={16}>
      <Col
        xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
        sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
        md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
        lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
        xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
      >
        <DatepickerBasic
          name="createdAt"
          disabled={disabled}
          label="Created At"
          loading={loading}
        />
      </Col>

      <Col
        xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
        sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
        md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
        lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
        xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
      >
        <SelectBasic
          options={[]}
          name="createdBy"
          label="Created By"
          disabled={disabled}
          loading={loading}
          noInitValue
        />
      </Col>
      <Col
        xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
        sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
        md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
        lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
        xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
      >
        <DatepickerBasic
          name="modifiedAt"
          label="Modified At"
          loading={loading}
          disabled={disabled}
        />
      </Col>
      <Col
        xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
        sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
        md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
        lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
        xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
      >
        <SelectBasic
          options={[]}
          disabled={disabled}
          name="modifiedBy"
          label="Modified By"
          loading={loading}
          noInitValue
        />
      </Col>
    </Row>
  );
};

export default OverviewPersonalWithoutStatus;
