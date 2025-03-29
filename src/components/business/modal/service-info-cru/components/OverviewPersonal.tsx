import React, { useCallback, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { Col, Form, Row } from 'antd';
import DatepickerBasic from '@/components/business/date-picker/DatepickerBasic';
import { SelectCreatedBy } from '@/components/business/select';
import { BOOKING_STATUS } from '@/constants/booking';
import { MyFormItem } from '@/components/basic/form-item';
import { MyRadio } from '@/components/basic/radio';
import SelectBasic from '@/components/business/select/SelectBasic';

const OverviewPersonal: React.FC<{
  isViewMode?: boolean;
  options?: any;
  disabled?: boolean;
  selectedValue?: any;
  handleChangeRadio: (e: any) => void;
  loading?: boolean;
  form?: any;
  showStatus?: boolean;
}> = ({
  isViewMode,
  options,
  handleChangeRadio,
  loading,
  selectedValue,
  disabled,
  form,
  showStatus = true,
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
          disabled={true}
          label="Created At"
          loading={false}
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
          options={BOOKING_STATUS}
          name="username_created"
          label="Created By"
          disabled={true}
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
          loading={false}
          disabled={true}
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
          options={BOOKING_STATUS}
          disabled={true}
          name="username_modified"
          label="Modified By"
          noInitValue
        />
      </Col>
      {showStatus && (
        <Row
          gutter={16}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
          }}
        >
          <Col span={24}>
            <span style={{ color: '#1C1917', fontWeight: 500 }}>Status</span>
          </Col>
          <Col style={{ paddingRight: 0 }}>
            <MyFormItem name={'status'} disabled={disabled} isShowLabel={false}>
              <MyRadio
                options={options}
                value={selectedValue}
                onChange={handleChangeRadio}
                loading={loading}
              />
            </MyFormItem>
          </Col>
        </Row>
      )}
    </Row>
  );
};

export default OverviewPersonal;
