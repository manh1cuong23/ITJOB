import React, { useState, useEffect } from 'react';
import './style.less';
import { Col, Form, Row } from 'antd';
import { MyCard } from '@/components/basic/card';
import { MyCardContent } from '@/components/basic/card-content';
import SelectBasic from '../select/SelectBasic';
import { InputBasic } from '../input';
import { DatePickerArrDeptCount } from '../date-picker';
import CheckBoxGroupBasic from '../checkbox/CheckBoxGroupBasic';
import RadioCutOff from '@/components/basic/radio/RadioCutOff';

interface GeneralInfoProps {}

const GeneralInfo: React.FC<GeneralInfoProps> = ({}) => {
  return (
    <>
      <Form layout="vertical">
        <MyCard title="GENERAL INFORMATION">
          <MyCardContent>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                <SelectBasic
                  options={[]}
                  required
                  name="hotelId"
                  label="Hotel"
                />
              </Col>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                <SelectBasic
                  options={[]}
                  required
                  name="market_segment"
                  label="Market Segment"
                />
              </Col>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                <SelectBasic
                  options={[]}
                  required
                  name="sub_segment"
                  label="Sub Segment"
                />
              </Col>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                <SelectBasic
                  options={[]}
                  required
                  name="account"
                  label="Account"
                />
              </Col>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                <SelectBasic
                  options={[]}
                  required
                  name="package_plan"
                  label="Package Plan"
                />
              </Col>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                <SelectBasic options={[]} required name="email" label="Email" />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <InputBasic name="remark" label="Remark" />
              </Col>
            </Row>
          </MyCardContent>
          <div style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <MyCardContent>
                  <Row>
                    <Col md={24}>
                      <DatePickerArrDeptCount
                        label="Start Date - End Date"
                        // onDateChange={handleChange}
                        // value={dateRange}
                        // form={form}
                        // dateDisabled={arrivalDate}
                      />
                    </Col>
                    <Col md={24}>
                      <CheckBoxGroupBasic
                        name="check"
                        label="Selectable days"
                        required
                        options={[
                          'Mon',
                          'Tue',
                          'Wed',
                          'Thu',
                          'Fri',
                          'Sat',
                          'Sun',
                        ]}
                      />
                    </Col>
                  </Row>
                </MyCardContent>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <MyCardContent>
                  <RadioCutOff
                    options={[
                      { label: '1', value: '1' },
                      { label: '2', value: '2' },
                    ]}
                  />
                </MyCardContent>
              </Col>
            </Row>
          </div>
        </MyCard>
      </Form>
    </>
  );
};

export default GeneralInfo;
