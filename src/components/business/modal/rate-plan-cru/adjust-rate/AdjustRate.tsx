import React, { CSSProperties, useEffect, useState } from 'react';
import { Row, Col, Form, CollapseProps, message } from 'antd';
import './AdjustRate.less';
import { MyModal } from '@/components/basic/modal';
import { MyButton } from '@/components/basic/button';
import { MyCardContent } from '@/components/basic/card-content';
import DatePickerSingle from '@/components/business/date-picker/DatePickerSingle';
import { MultiSelectBasic, SelectRoomType } from '@/components/business/select';
import { SingleRadio } from '@/components/basic/radio';
import InputBasicWithIcon from '@/components/business/input/InputBasicNumberWithIcon';
import { MyCollapse } from '@/components/basic/collapse';
import RateAdjustment from './RateAdjustment';
import InputAdjustRate from '@/components/basic/adjust-rate/InputAdjustRate';
import { ISource } from '@/utils/formatSelectSource';
import { getRateCodeByID } from '@/api/features/rateCode';
import { Dayjs } from 'dayjs';

interface AdjustRateModalProps {
  open: boolean;
  onClose: () => void;
  fromToDate: [string, string] | null;
  selectedRateCode?: string;
  packageList?: ISource[];
  dataRateAdjustTable?: any;
  setDataTableRoomRate?: React.Dispatch<React.SetStateAction<any>>;
}

interface AdjustedRate {
  type: 'increase' | 'decrease';
  value: number;
  isPercentage?: boolean;
}

const AdjustRateModal: React.FC<AdjustRateModalProps> = ({
  open,
  onClose,
  fromToDate,
  selectedRateCode,
  packageList,
  dataRateAdjustTable,
  setDataTableRoomRate,
}) => {
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );
  const [selectedRateOverride, setSelectedRateOverride] = useState<
    string | undefined
  >(undefined);
  const [selectedAdjustRate, setSelectedAdjustRate] = useState<
    string | undefined
  >(undefined);
  const [roomTypeOptions, setRoomTypeOptions] = useState<ISource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [adjustmentData, setAdjustmentData] = useState<any[]>([]);
  const [adjustRateValue, setAdjustRateValue] = useState<AdjustedRate>();

  useEffect(() => {
    if (open && fromToDate) {
      setDateRange(fromToDate);
    }
  }, [open, fromToDate]);

  useEffect(() => {
    if (dataRateAdjustTable && dataRateAdjustTable.length > 0) {
      setAdjustmentData(dataRateAdjustTable);
    }
  }, [dataRateAdjustTable]);

  const fetchRoomTypeByRateCodeId = async () => {
    if (!selectedRateCode) return;

    try {
      const roomTypeList = await getRateCodeByID(selectedRateCode);
      if (roomTypeList && roomTypeList.data.length > 0) {
        const data: ISource[] = roomTypeList.data.flatMap((item: any) =>
          item.room_Type.map((room: any) => ({
            value: room.room_type_id.code,
            label: room.room_type_id.name,
          }))
        );
        setRoomTypeOptions(data);
      }
    } catch (error) {
      console.error('Error fetching hotel list:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRoomTypeByRateCodeId();
      form.setFieldsValue({ occupancy_0_is_increase: true });
    } else {
      resetFields();
    }
  }, [open]);

  const resetFields = () => {
    form.resetFields();
    setSelectedRateOverride(undefined);
    setSelectedAdjustRate(undefined);
  };

  const calculateRate = (
    configuredRate: string,
    rateOverride: string | null,
    adjustedRate: AdjustedRate | null
  ) => {
    const baseRate = parseFloat(configuredRate);

    if (rateOverride && rateOverride !== '-') {
      return rateOverride;
    } else if (adjustedRate && adjustedRate.value) {
      const adjustValue = parseFloat(String(adjustedRate.value));

      if (adjustedRate.isPercentage) {
        const multiplier = adjustedRate.type
          ? 1 + adjustValue / 100
          : 1 - adjustValue / 100;
        return String(Math.round(baseRate * multiplier));
      } else {
        return String(
          adjustedRate.type ? baseRate + adjustValue : baseRate - adjustValue
        );
      }
    }
    return configuredRate;
  };

  const handleApply = async () => {
    try {
      const formValues = await form.validateFields();
      const {
        from_to_date,
        roomType,
        packagePlan,
        rateOverride,
        adjustRate,
      } = formValues;

      if (!from_to_date || from_to_date.length !== 2) {
        return;
      }

      const roomTypes = Array.isArray(roomType)
        ? roomType
        : roomType
        ? [roomType]
        : [];
      const packagePlans = Array.isArray(packagePlan)
        ? packagePlan
        : packagePlan
        ? [packagePlan]
        : [];

      const [startDate, endDate] = from_to_date;
      const currentDate = new Date(startDate);
      const updatedData = [...adjustmentData];

      let parsedAdjustRate: AdjustedRate | null = null;
      if (selectedAdjustRate && adjustRate) {
        try {
          parsedAdjustRate = JSON.parse(adjustRate);
        } catch (e) {
          console.error('Error parsing adjustRate:', e);
        }
      }

      while (currentDate <= new Date(endDate)) {
        const formattedDate = `${currentDate.getFullYear()}-${(
          currentDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${currentDate
          .getDate()
          .toString()
          .padStart(2, '0')}`;

        roomTypes.forEach(rt => {
          packagePlans.forEach(pp => {
            const itemIndex = updatedData.findIndex(
              item =>
                item.date === formattedDate &&
                item.roomTypeCode === rt &&
                item.packagePlanCode === pp
            );

            if (itemIndex !== -1) {
              const item = { ...updatedData[itemIndex] };

              if (selectedRateOverride && rateOverride) {
                item.rateOverride = rateOverride.toString();
                item.adjustedRate = {
                  type: true,
                  value: 0,
                  isPercentage: false,
                };
              } else if (selectedAdjustRate && parsedAdjustRate) {
                item.adjustedRate = parsedAdjustRate;
                item.rateOverride = '-';
              }

              item.adjustedRate = {
                ...adjustRateValue,
              };

              item.rate = calculateRate(
                item.configuredRate,
                item.rateOverride,
                item.adjustedRate
              );

              updatedData[itemIndex] = item;
            }
          });
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
      console.log(updatedData);

      setAdjustmentData(updatedData);
      message.success('Rate adjustment applied successfully!');
      form.resetFields([
        'roomType',
        'from_to_date',
        'packagePlan',
        'rateOverride',
        'adjustRate',
      ]);
      setSelectedRateOverride(undefined);
      setSelectedAdjustRate(undefined);
    } catch (error) {
      console.error(error);
      message.error('Failed to apply rate adjustment');
    }
  };

  const handleOk = () => {
    const formateData = adjustmentData.map(item => ({
      ...item,
      adjustedRate: item.adjustedRate?.value,
      adjust_rate_is_increase: item.adjustedRate?.type,
      adjust_rate_is_percent: item.adjustedRate?.isPercentage,
    }));
    setDataTableRoomRate?.(formateData);
    message.success('Adjust rate successfully');
    form.resetFields();
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleChange = (e: any) => {
    setSelectedValue(e.target.value);
  };

  const getItems: (
    panelStyle: CSSProperties
  ) => CollapseProps['items'] = panelStyle => [
    {
      key: '1',
      label: 'RATE ADJUSTMENT',
      children: (
        <RateAdjustment
          fromToDate={fromToDate}
          roomTypeOptions={roomTypeOptions}
          packageList={packageList}
          dataTable={adjustmentData}
          form={form}
          onDataUpdate={setAdjustmentData}
        />
      ),
      style: panelStyle,
    },
  ];

  const handleRateOverride = (value: any) => {
    setSelectedAdjustRate('');
    setSelectedRateOverride(value);
    form.setFields([
      { name: 'rateOverride', errors: [] },
      { name: 'adjustRate', errors: [] },
    ]);
    form.resetFields(['adjustRate']);
  };

  const handleAdjustRate = (value: any) => {
    setSelectedRateOverride('');
    setSelectedAdjustRate(value);
    form.setFields([
      { name: 'rateOverride', errors: [], value: '' },
      { name: 'adjustRate', errors: [] },
    ]);
  };

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      setDateRange([startDate, endDate]);
    } else {
      setDateRange(null);
    }
  };

  // useEffect(() => {
  //   console.log('Giá trị adjust rate mới:', adjustRateValue);
  // }, [adjustRateValue]);

  const handleAdjustRateChange = (valueString: any) => {
    try {
      const value = JSON.parse(valueString);
      setAdjustRateValue(value);
    } catch (error) {
      console.error('Không thể phân tích giá trị adjust rate:', error);
    }
  };
  return (
    <MyModal
      width={880}
      title="Adjust Rate"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <>
          <MyButton onClick={handleCancel} buttonType="outline">
            Close
          </MyButton>
          <MyButton onClick={handleOk}>Save</MyButton>
        </>
      }
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <MyCardContent className="add-rate-plan">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <DatePickerSingle
                    arrDeptDate={fromToDate}
                    showValue={false}
                    onDateChange={handleDateChange}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <SelectRoomType
                    required
                    options={roomTypeOptions}
                    name="roomType"
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <MultiSelectBasic
                    required
                    label="Package Plan"
                    name="packagePlan"
                    options={packageList || []}
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <SingleRadio
                    options={[
                      { label: 'Rate Override', value: 'Rate Override' },
                    ]}
                    value={selectedRateOverride}
                    onChange={handleRateOverride}
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <SingleRadio
                    options={[{ label: 'Adjust Rate', value: 'Adjust Rate' }]}
                    value={selectedAdjustRate}
                    onChange={handleAdjustRate}
                  />
                </Col>
              </Row>
              <Row gutter={16} className="row-start">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <InputBasicWithIcon
                    type="number"
                    name="rateOverride"
                    loading={loading}
                    required={selectedRateOverride === 'Rate Override'}
                    form={form}
                    isShowLabel={false}
                    disabled={!selectedRateOverride}
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <InputAdjustRate
                    onChange={handleAdjustRateChange}
                    name="adjustRate"
                    isShowLabel={false}
                    required={selectedAdjustRate === 'Adjust Rate'}
                    form={form}
                    disabled={!selectedAdjustRate}
                  />
                </Col>
              </Row>
              <Row
                gutter={[16, 16]}
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  marginRight: 0,
                }}
              >
                <MyButton onClick={handleApply}>Apply</MyButton>
              </Row>
            </MyCardContent>
          </Col>
          <Col span={24} style={{ marginTop: '12px' }}>
            <MyCollapse
              getItems={getItems}
              accordion={false}
              activeKey={['1']}
            />
          </Col>
        </Row>
      </Form>
    </MyModal>
  );
};

export default AdjustRateModal;
