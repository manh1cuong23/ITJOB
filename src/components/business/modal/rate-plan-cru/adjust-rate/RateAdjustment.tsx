import React, { useEffect, useMemo, useState } from 'react';
import { TableBasic } from '@/components/basic/table';
import { Divider } from 'antd';
import { MyFormItem } from '@/components/basic/form-item';
import { MultipleSelectWithoutBorder } from '@/components/basic/select';
import { DatepickerFromToWithoutborder } from '@/components/business/date-picker';
import InputValue from '@/components/business/input/inputValue';
import SelectBasicCustom from '@/components/business/select/SelectBasicCustom';
import { Dayjs } from 'dayjs';
import { ISource } from '@/utils/formatSelectSource';
import MyCheckBox from '@/components/business/checkbox/MyCheckBox';
import { FormInstance } from 'antd/lib';
import { formatDateTable } from '@/utils/formatDate';
import './AdjustRate.less';

interface AdjustedRate {
  type: 'increase' | 'decrease';
  value: number;
  isPercentage?: boolean;
}

interface TableItem {
  date: string;
  roomType: string;
  packagePlan: string;
  configuredRate: string;
  rateOverride: string;
  adjustedRate: AdjustedRate;
  rate: string;
  roomTypeCode: string;
  packagePlanCode: string;
  [key: string]: any;
}
interface Iprops {
  fromToDate?: [string, string] | null;
  roomTypeOptions?: ISource[];
  packageList?: ISource[];
  dataTable: any[];
  form: FormInstance;
  onDataUpdate?: (data: TableItem[]) => void;
}

const formatNumberWithDots = (value: string | number): string => {
  if (!value && value !== 0) return '';
  const num = Math.round(Number(value));
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
const parseFormattedNumber = (value: string): number => {
  if (!value) return 0;
  return parseInt(value.replace(/\./g, ''), 10);
};
const RateAdjustment: React.FC<Iprops> = ({
  fromToDate,
  roomTypeOptions,
  packageList,
  dataTable = [],
  form,
  onDataUpdate,
}) => {
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [filteredData, setFilteredData] = useState(dataTable);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedPackagePlans, setSelectedPackagePlans] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (fromToDate && fromToDate.length === 2) {
      setDateRange(fromToDate);
    }
  }, [fromToDate]);

  useEffect(() => {
    setFilteredData(dataTable);
  }, [dataTable]);

  useEffect(() => {
    const formattedData = filteredData.map((item: any, index: number) => ({
      [`rateOverride_${index}`]:
        item.rateOverride == 0 || item.rateOverride == '-'
          ? null
          : item.rateOverride,
      [`adjustedRate${index}`]: item.adjustedRate?.value,
      [`select${index}`]: item.adjustedRate?.type || true,
      [`checkbox${index}`]: item.adjustedRate?.isPercentage,
    }));

    form.setFields(
      formattedData.flatMap((field: any) =>
        Object.entries(field).map(([name, value]) => ({ name, value }))
      )
    );
  }, [form, filteredData, dataTable]);

  const filteredRoomRates = useMemo(() => {
    if (!filteredData || !Array.isArray(filteredData)) return [];

    return filteredData.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = dateRange?.[0] ? new Date(dateRange[0]) : null;
      const endDate = dateRange?.[1] ? new Date(dateRange[1]) : null;

      const isDateValid =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);

      const isRoomTypeValid =
        !selectedRoomTypes?.length ||
        selectedRoomTypes.includes(item.roomTypeCode);

      const isPackagePlanValid =
        !selectedPackagePlans?.length ||
        selectedPackagePlans.includes(item.packagePlanCode);

      return isDateValid && isRoomTypeValid && isPackagePlanValid;
    });
  }, [filteredData, dateRange, selectedRoomTypes, selectedPackagePlans]);

  const calculateRate = (
    record: TableItem,
    rateOverride: string,
    adjustedType: string | boolean,
    adjustedValue: string,
    isPercentage: boolean
  ) => {
    const configuredRate = parseFloat(record.configuredRate);

    if (rateOverride && rateOverride !== '-') {
      return formatNumberWithDots(rateOverride);
    } else if (adjustedValue && !isNaN(parseFloat(adjustedValue))) {
      const adjustValue = parseFloat(adjustedValue);

      if (isPercentage) {
        const multiplier =
          adjustedType === true ? 1 + adjustValue / 100 : 1 - adjustValue / 100;
        return formatNumberWithDots(Math.round(configuredRate * multiplier));
      } else {
        return formatNumberWithDots(
          adjustedType === true
            ? configuredRate + adjustValue
            : configuredRate - adjustValue
        );
      }
    }
    return formatNumberWithDots(record.configuredRate);
  };

  const handleRateChange = (index: number, field: string, value: any) => {
    if (!filteredRoomRates || index >= filteredRoomRates.length) return;

    const record = filteredRoomRates[index];
    const fullDataIndex = dataTable.findIndex(
      item =>
        item.date === record.date &&
        item.roomTypeCode === record.roomTypeCode &&
        item.packagePlanCode === record.packagePlanCode
    );

    if (fullDataIndex === -1) return;

    const updatedData = [...dataTable];
    const updatedRecord = { ...updatedData[fullDataIndex] };

    if (field === 'rateOverride') {
      if (value !== '' && value !== '-') {
        updatedRecord.rateOverride = value;

        updatedRecord.adjustedRate = {
          type: true,
          value: 0,
          isPercentage: false,
        };

        if (form) {
          form.setFieldsValue({
            [`adjustedRate${index}`]: '',
            [`select${index}`]: true,
            [`checkbox${index}`]: false,
          });
        }
      } else {
        updatedRecord.rateOverride = '-';
      }
    } else if (field.startsWith('adjustedRate')) {
      if (value !== '' && parseFloat(value) > 0) {
        const adjustedType =
          form?.getFieldValue(`select${index}`) ??
          updatedRecord.adjustedRate?.type ??
          true;
        const isPercentage =
          form?.getFieldValue(`checkbox${index}`) ??
          updatedRecord.adjustedRate?.isPercentage ??
          false;

        updatedRecord.adjustedRate = {
          type: adjustedType,
          value: parseFloat(value),
          isPercentage,
        };

        updatedRecord.rateOverride = '-';

        if (form) {
          form.setFieldsValue({
            [`rateOverride_${index}`]: '',
          });
        }
      } else if (value === '') {
        updatedRecord.adjustedRate = {
          type: true,
          value: 0,
          isPercentage: false,
        };
      }
    } else if (field.startsWith('select')) {
      if (updatedRecord.adjustedRate && updatedRecord.adjustedRate.value > 0) {
        updatedRecord.adjustedRate = {
          ...updatedRecord.adjustedRate,
          type: value,
        };

        updatedRecord.rateOverride = '-';

        if (form) {
          form.setFieldsValue({
            [`rateOverride_${index}`]: '',
          });
        }
      }
    } else if (field.startsWith('checkbox')) {
      if (updatedRecord.adjustedRate && updatedRecord.adjustedRate.value > 0) {
        updatedRecord.adjustedRate = {
          ...updatedRecord.adjustedRate,
          isPercentage: value,
        };

        updatedRecord.rateOverride = '-';

        if (form) {
          form.setFieldsValue({
            [`rateOverride_${index}`]: '',
          });
        }
      }
    }

    updatedRecord.rate = calculateRate(
      updatedRecord,
      updatedRecord.rateOverride,
      updatedRecord.adjustedRate?.type,
      String(updatedRecord.adjustedRate?.value || 0),
      updatedRecord.adjustedRate?.isPercentage || false
    );

    updatedData[fullDataIndex] = updatedRecord;

    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
  };

  const columns: any = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (value: string, record: any) => value && formatDateTable(value),
    },
    {
      title: 'Room Type',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 90,
    },
    {
      title: 'Package Plan',
      dataIndex: 'packagePlan',
      key: 'packagePlan',
      width: 110,
    },
    {
      title: 'Configured Rate',
      dataIndex: 'configuredRate',
      key: 'configuredRate',
      width: 130,
    },
    {
      title: 'Rate Override',
      dataIndex: 'rateOverride',
      key: 'rateOverride',
      width: 130,
      render: (value: any, record: TableItem, index: number) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputValue
            placeholder=" "
            name={`rateOverride_${index}`}
            defaultValue={(value !== '-' ? value : '') as string}
            value={
              form?.getFieldValue(`rateOverride_${index}`) ||
              (value !== '-' ? value : '')
            }
            onBlur={(e: any) => handleRateChange(index, 'rateOverride', e)}
            onChange={(e: any) => {
              if (form) {
                form.setFieldsValue({ [`rateOverride_${index}`]: e });
              }
            }}
          />
        </div>
      ),
    },
    {
      title: 'Adjusted Rate',
      dataIndex: 'adjustedRate',
      key: 'adjustedRate',
      width: 230,
      render: (
        adjustedRate: AdjustedRate,
        record: TableItem,
        index: number
      ) => {
        const currentAdjustedValue =
          form?.getFieldValue(`adjustedRate${index}`) !== undefined
            ? form.getFieldValue(`adjustedRate${index}`)
            : adjustedRate?.value || '';
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SelectBasicCustom
              name={`select${index}`}
              isShowLabel={false}
              options={[
                { value: true, label: '+' },
                { value: false, label: '-' },
              ]}
              onChange={(value: any) => {
                if (form) {
                  form.setFieldsValue({ [`select${index}`]: value });
                }
                handleRateChange(index, `select${index}`, value);
              }}
            />
            <span style={{ margin: '0 6px' }}>
              <InputValue
                placeholder=" "
                name={`adjustedRate${index}`}
                defaultValue={(adjustedRate?.value?.toString() || '') as string}
                value={currentAdjustedValue}
                onBlur={(e: any) =>
                  handleRateChange(index, `adjustedRate${index}`, e)
                }
                onChange={(e: any) => {
                  if (form) {
                    form.setFieldsValue({
                      [`adjustedRate${index}`]: e,
                    });
                  }
                }}
              />
            </span>
            <MyCheckBox
              name={`checkbox${index}`}
              label="%"
              form={form}
              checked={
                form?.getFieldValue(`checkbox${index}`) ??
                (adjustedRate?.isPercentage || false)
              }
              onChange={(e: any) => {
                if (form) {
                  form.setFieldsValue({
                    [`checkbox${index}`]: e.target.checked,
                  });
                }
                handleRateChange(index, `checkbox${index}`, e.target.checked);
              }}
            />
          </div>
        );
      },
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      width: 100,
      render: (value: string) => formatNumberWithDots(value),
    },
  ];

  const handleRoomTypeChange = (values: string[]) => {
    setSelectedRoomTypes(values);
  };

  const handlePackagePlanChange = (values: string[]) => {
    setSelectedPackagePlans(values);
  };

  return (
    <div className="rate-adjustment-wrapper">
      <div className="search-list">
        <DatepickerFromToWithoutborder
          arrDeptDate={fromToDate}
          initialValue={dateRange}
          onChange={dates => {
            setDateRange(dates);
          }}
        />
        <div className="divider"></div>
        <MultipleSelectWithoutBorder
          options={roomTypeOptions || []}
          prefix="Room Type:"
          onChange={handleRoomTypeChange}
          value={selectedRoomTypes}
        />
        <div className="divider"></div>

        <MultipleSelectWithoutBorder
          options={packageList || []}
          prefix="Package Plan:"
          onChange={handlePackagePlanChange}
          value={selectedPackagePlans}
        />
      </div>
      <TableBasic
        dataSource={filteredRoomRates}
        columns={columns}
        rowKey={record =>
          `${record.date}-${record.roomTypeCode}-${record.packagePlanCode}`
        }
      />
    </div>
  );
};

export default RateAdjustment;
