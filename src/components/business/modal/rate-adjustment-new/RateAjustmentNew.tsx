import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TableBasic } from '@/components/basic/table';
import {
  Button,
  Divider,
  Form,
  message,
  Table,
  TableColumnsType,
  TableProps,
} from 'antd';
import { ReactComponent as Import } from '@/assets/icons/ic_file-plus.svg';
import { MyFormItem } from '@/components/basic/form-item';
import {
  MultipleSelectWithoutBorder,
  SingleSelectWithoutBorder,
} from '@/components/basic/select';
import './RateAjustment.less';
import { MyRadio } from '@/components/basic/radio';
import RateSetting from '../rate-setting/RateSetting';
import { CollapseProps } from 'antd/lib';
import { MyCollapse } from '@/components/basic/collapse';
interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

import { Input, Select, Checkbox } from 'antd';
import InputBasicWithIcon from '../../input/InputBasicNumberWithIcon';
import InputValue from '../../input/inputValue';
import SelectBasic from '../../select/SelectBasic';
import Icon, { DeleteOutlined } from '@ant-design/icons';
import {
  dataSourceDayType,
  dataSourceSeason,
  getColumnDayType,
  getColumnOccupancy,
  getColumnSeason,
} from './column';
import MyCheckBox from '../../checkbox/MyCheckBox';
import MyCheckBoxWithState from '../../checkbox/MyCheckBoxWithState';
import { validateValueField } from '@/utils/validateInput';
import RadioButtonSimple from '@/components/basic/radio/RadioSimple';
import DeleteModal from '@/components/business/modal/shared-delete-confirm/SharedDeleteConfirm';

const formatNumber = (value: number) => {
  return value.toLocaleString('de-DE'); // Sử dụng định dạng của Đức (cách 3 chữ số bằng dấu chấm)
};
const dataSourceTest = [
  {
    key: '1',
    rateCode: 'RC001',
    roomType: 'Deluxe',
    packagePlan: 'Bed & Breakfast',
    costRate: 120000,
    rackRate: 100050,
    distributionRate: 100030,
  },
  {
    key: '2',
    rateCode: 'RC002',
    roomType: 'Superior',
    packagePlan: 'Full Board',
    costRate: 100000,
    rackRate: 1400000,
    distributionRate: 100025,
  },
];
// rowSelection object indicates the need for row selection

interface Iprops {}
const RateAjustmentNew: React.FC<{
  isViewMode?: boolean;
  disabled?: boolean;
  forceUpdate?: any;
  loading?: boolean;
  setIsNotDataInOccupancy: any;
  isErrorPriorityOccupancy?: boolean;
  isErrorPrioritySeason?: boolean;
  isErrorPriorityDayType?: boolean;
  setCriteria?: any;
  data?: any;
  isNotDataInOccupancy: boolean;
  form?: any;
}> = ({
  isViewMode,
  // options,
  loading,
  setCriteria,
  isNotDataInOccupancy,
  forceUpdate,
  isErrorPriorityOccupancy,
  isErrorPrioritySeason,
  setIsNotDataInOccupancy,
  isErrorPriorityDayType,
  data = [],
  disabled,
  form,
}) => {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  );
  const [isFromToNotOverlap, setIsFromToNotOverlap] = useState<any>({});
  const [selectedValueRadioRules, setSelectedValueRadioRules] = useState<
    string | undefined
  >();
  const [occupancy, setOccupancy] = useState<any>([]);
  const [occupancyCheck, setOccupancyCheck] = useState<boolean>(false);
  const [dayTypeCheck, setDayTypeCheck] = useState<boolean>(false);
  const [seasonCheck, setSeasonCheck] = useState<boolean>(false);
  const [dayType, setDayType] = useState<any>([]);
  const [season, setSeason] = useState<any>([]);
  const [dataOccupancy, setDataOccupancy] = useState<any>([]);
  const [optionPriority, setOptionPriority] = useState<any>([]);
  const [isValidFromTo, setIsValidFromTo] = useState<any>({});
  const [isNotValidOccu, setIsNotValid] = useState<any>({});
  const [isNotValidDayType, setIsNotValidDayType] = useState<any>({});
  const [isNotValidSeason, setIsNotValidSeason] = useState<any>({});
  const [isPercents, setIsPercents] = useState({});
  const [selectedValueRules, setSelectedValueRules] = useState<any>({});
  const [priorityError, setPriorityError] = useState<any>({});
  const [isNotValidSelectRules, setIsNotValidSelectRules] = useState<any>({});
  const [isModalDelete, setIsModalDelete] = useState(false);

  const [indexKey, setIndexKey] = useState(0);
  const handleChangeRadioAjustment = (e: any) => {
    setSelectedValueRadioRules(e.target.value);
    setIsNotValidSelectRules({});
    setPriorityError({});
  };
  const [dataSource, setDataSource] = useState<any[]>(data);
  const reset = useCallback(() => {
    setIsValidFromTo({});
    setDataOccupancy([]);
    setIsFromToNotOverlap({});
    setIsNotValid({});
    setIsNotValidDayType({});
    setIsNotValidSeason({});
    setIsPercents({});
    setOccupancyCheck(false);
    setDayTypeCheck(false);
    setSeasonCheck(false);
    setIsNotValidSelectRules({});
    setPriorityError({});
  }, []);

  useEffect(() => {
    reset();
    setSelectedValueRules({});
  }, [forceUpdate, reset]);
  useEffect(() => {
    // Đếm số checkbox đang được check
    const count = [dayTypeCheck, seasonCheck, occupancyCheck].filter(Boolean)
      ?.length;

    // Tạo mảng option dựa trên số lượng checkbox được check
    const newOptions = Array.from({ length: count }, (_, index) => ({
      label: `${index + 1}`,
      value: index + 1,
    }));
    setOptionPriority(newOptions);
    setCriteria({
      season: seasonCheck,
      dayType: dayTypeCheck,
      occupancy: occupancyCheck,
    });
    setIsNotValidSelectRules({});
    setPriorityError({});
  }, [dayTypeCheck, seasonCheck, occupancyCheck]);
  const optionsRules = [
    {
      label: 'Max rate',
      value: 'max_rate',
    },
    {
      label: 'Min rate',
      value: 'min_rate',
    },
    {
      label: 'Parallel',
      value: 'parallel',
    },
    {
      label: 'Sequence',
      value: 'sequence',
    },
    {
      label: 'Designation',
      value: 'designation',
    },
  ];

  const handleRadioChangeRules = (groupId: any, value: any) => {
    setSelectedValueRules((prev: any) => ({
      ...prev,
      [groupId]: value,
    }));
  };
  const handleAddRow = () => {
    setIsNotDataInOccupancy(false);
    const newRow = {
      key: indexKey + 1, // Sử dụng timestamp làm key
      rateCode: '',
      roomType: '',
      packagePlan: '+',
      packageValue: '',
      packageChecked: false,
    };
    setDataOccupancy((prevData: any) => [...prevData, newRow]);
    setIndexKey(prev => prev + 1);
  };
  const validateDuplicate = (values: Record<string, string>, name: string) => {
    const value = values[name];
    // Lấy danh sách tất cả giá trị (trừ name hiện tại)
    const otherValues = Object.entries(values)
      .filter(([key]) => key !== name)
      .map(([, val]) => val);
    // Kiểm tra nếu có giá trị trùng lặp
    const isDuplicate = otherValues.includes(value);

    setPriorityError((prevErrors: any) => ({
      ...prevErrors,
      [name]: isDuplicate, // Chỉ cập nhật lỗi cho name bị trùng
    }));
  };
  const handleDelete = () => {
    const newData = dataOccupancy.filter(
      (item: any) => !selectedRowKeys.includes(item.key) // Xóa các hàng được chọn
    );

    setDataOccupancy([...newData]); // Cập nhật danh sách mới
    setSelectedRowKeys([]); // Xóa lựa chọn
    const filterErrors = (errors: Record<string, boolean>) => {
      return Object.keys(errors)
        .filter(
          key => !selectedRowKeys.some((rowKey: any) => key.includes(rowKey))
        )
        .reduce((acc, key) => ({ ...acc, [key]: errors[key] }), {});
    };

    // Cập nhật lại state lỗi, giữ lại lỗi của những dòng chưa bị xóa
    setIsValidFromTo((prev: any) => filterErrors(prev));
    setIsFromToNotOverlap((prev: any) => filterErrors(prev));
    setIsNotValid((prev: any) => filterErrors(prev));
    message.success('Delete criteria successfully!');
    setIsModalDelete(false);
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  const renderHeader = useMemo(() => {
    return (
      <div className="room-ajustment-header">
        <MyFormItem
          name="occupancy"
          label="Choosing the rule to apply the criteria"
          disabled={isViewMode}
          form={form}
          required
          isShowLabel={false}
        >
          <MyRadio
            options={optionsRules}
            value={selectedValueRadioRules}
            onChange={handleChangeRadioAjustment}
            // loading={}
          />
        </MyFormItem>
      </div>
    );
  }, [selectedValueRadioRules, data]);
  const onCancelDelete = () => {
    setIsModalDelete(false);
  };
  // useEffect(() => {
  //   form.setFieldsValue({
  //     priority_day_type: dayType[0]?.adjustement_daytype_id?.priority,
  //   });
  //   form.setFieldsValue({
  //     priority_season: season[0]?.adjustement_season_id?.priority,
  //   });
  //   form.setFieldsValue({
  //     priority_occupancy: occupancy[0]?.adjustement_occupancy_id?.priority,
  //   });
  // }, [dayType, season, occupancy, dataOccupancy, isViewMode]);
  // useEffect(() => {
  //   const formattedData = dayType.map((item: any, index: number) => {
  //     return {
  //       [`dayType[${index}].id`]: item.adjustement_daytype_id.id,
  //       [`dayType[${index}].value`]: item.adjustement_daytype_id.value,
  //       [`dayType[${index}].is_percent`]:
  //         item.adjustement_daytype_id.is_percent,
  //       [`dayType[${index}].is_increase`]:
  //         item.adjustement_daytype_id.is_increase,
  //     };
  //   });

  //   // Đổ dữ liệu vào form
  //   form.setFields(
  //     formattedData.flatMap((field: any) =>
  //       Object.entries(field).map(([name, value]) => ({ name, value }))
  //     )
  //   );
  // }, [form, dayType]);
  // useEffect(() => {
  //   const formattedData = occupancy.map((item: any, index: number) => ({
  //     [`occupancy[${index}].id`]: item.adjustement_occupancy_id.id,
  //     [`occupancy[${index}].value`]: item.adjustement_occupancy_id.value,
  //     [`occupancy[${index}].from`]: item.adjustement_occupancy_id.from,
  //     [`occupancy[${index}].to`]: item.adjustement_occupancy_id.to,
  //     [`occupancy[${index}].is_percent`]:
  //       item.adjustement_occupancy_id.is_percent,
  //     [`occupancy[${index}].is_increase`]:
  //       item.adjustement_occupancy_id.is_increase,
  //   }));

  //   // Đổ dữ liệu vào form
  //   form.setFields(
  //     formattedData.flatMap((field: any) =>
  //       Object.entries(field).map(([name, value]) => ({ name, value }))
  //     )
  //   );
  // }, [form, occupancy]);
  // useEffect(() => {
  //   const formattedData = season.map((item: any, index: number) => ({
  //     [`season[${index}].id`]: item.adjustement_season_id.id,
  //     [`season[${index}].value`]: item.adjustement_season_id.value,
  //     [`season[${index}].is_percent`]: item.adjustement_season_id.is_percent,
  //     [`season[${index}].is_increase`]: item.adjustement_season_id.is_increase,
  //   }));

  //   // Đổ dữ liệu vào form
  //   form.setFields(
  //     formattedData.flatMap((field: any) =>
  //       Object.entries(field).map(([name, value]) => ({ name, value }))
  //     )
  //   );
  // }, [form, season]);
  // useEffect(() => {
  //   // Mapping data để đổ vào form
  //   const fields = dayType.map((item: any, index: number) => ({
  //     name: [`dayType`, index],
  //     value: {
  //       id: item.adjustement_daytype_id.id,
  //       type: item.adjustement_daytype_id.type,
  //       value: item.adjustement_daytype_id.value,
  //       is_percent: item.adjustement_daytype_id.is_percent,
  //       is_increase: item.adjustement_daytype_id.is_increase,
  //     },
  //   }));

  //   // Set fields vào form
  //   form.setFields(fields);
  // }, [dayType, form]);
  const renderDayType = useMemo(() => {
    var dataDayType: any = [];
    if (data && data?.length > 0) {
      dataDayType = data.item_daytype.map(
        (item: any) => item?.adjustement_daytype_id
      );
    } else {
      dataDayType = dataSourceDayType;
    }
    return (
      <div className="austment_table">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <MyCheckBoxWithState
            form={form}
            disabled={isViewMode}
            name={`dayTypeCheck`}
            onChange={e => setDayTypeCheck(e.target.checked)}
            check={dayTypeCheck}
            label="Day type"
          />
          {selectedValueRadioRules == 'sequence' && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div>Priority</div>
              <SelectBasic
                isHideErrorMessage={true}
                required={
                  dayTypeCheck && selectedValueRadioRules ? true : false
                }
                onChange={() =>
                  validateDuplicate(
                    {
                      priority_occupancy: form.getFieldValue(
                        'priority_occupancy'
                      ),
                      priority_day_type: form.getFieldValue(
                        'priority_day_type'
                      ),
                      priority_season: form.getFieldValue('priority_season'),
                    },
                    'priority_day_type'
                  )
                }
                rules={[
                  {
                    validator: () =>
                      priorityError['priority_day_type']
                        ? Promise.reject()
                        : Promise.resolve(),
                  },
                ]}
                disabled={isViewMode || !dayTypeCheck}
                isShowLabel={false}
                name="priority_day_type"
                noInitValue
                options={optionPriority}
              />
            </div>
          )}
          {selectedValueRadioRules == 'designation' && (
            <RadioButtonSimple
              // required={
              //   selectedValueRadioRules == 'designation' && dayTypeCheck
              // }
              disabled={
                selectedValueRadioRules == 'designation' && !dayTypeCheck
              }
              rules={[
                {
                  validator: validateValueField(
                    setIsNotValidSelectRules,
                    1,
                    selectedValueRadioRules == 'designation' && dayTypeCheck
                  ),
                },
              ]}
              name="radioSelectAjustment"
              form={form}
              groupId="group1"
              value="daytype"
              label="Select:"
              selectedValue={selectedValueRules['group1']}
              onChange={handleRadioChangeRules}
            />
          )}
        </div>
        {dayTypeCheck && (
          <>
            {' '}
            {isErrorPriorityDayType && (
              <div style={{ color: 'red', padding: '0 8px' }}>
                Priority is required for selected criteria
              </div>
            )}
            {priorityError['priority_day_type'] && (
              <div style={{ color: 'red', padding: '0 8px' }}>
                Priority order is duplicated for selected criteria
              </div>
            )}
            <div style={{ color: 'red', padding: '0 8px' }}>
              {Object.values(isNotValidSelectRules).some(
                value => value === true
              ) &&
                dayTypeCheck &&
                'Select is required for one of the selected criteria'}
            </div>
          </>
        )}
        <TableBasic
          // rowSelection={rowSelection}
          dataSource={dataDayType}
          columns={getColumnDayType(
            form,
            isViewMode || !dayTypeCheck,
            dayTypeCheck,
            setIsNotValidDayType,
            setIsPercents,
            isPercents
          )}
        />
        {dayTypeCheck && (
          <div style={{ color: 'red', padding: '0 8px' }}>
            {Object.values(isNotValidDayType).some(value => value === true) &&
              'Value is required'}
          </div>
        )}
      </div>
    );
  }, [
    dayType,
    dayTypeCheck,
    isNotValidDayType,
    isPercents,
    priorityError,
    selectedValueRadioRules,
    isViewMode,
    isErrorPriorityDayType,
    selectedValueRules,
    isNotValidSelectRules,
    optionPriority,
  ]);
  const renderSeason = useMemo(() => {
    var dataSeason: any = [];
    if (data && data?.length > 0) {
      dataSeason = data.item_season.map(
        (item: any) => item?.adjustement_season_id
      );
    } else {
      dataSeason = dataSourceSeason;
    }

    return (
      <div className="austment_table">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <MyCheckBoxWithState
            form={form}
            disabled={isViewMode}
            name={`seasonCheck`}
            check={seasonCheck}
            onChange={e => setSeasonCheck(e.target.checked)}
            label="Season"
          />
          {selectedValueRadioRules == 'sequence' && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div>Priority</div>
              <SelectBasic
                onChange={() =>
                  validateDuplicate(
                    {
                      priority_occupancy: form.getFieldValue(
                        'priority_occupancy'
                      ),
                      priority_day_type: form.getFieldValue(
                        'priority_day_type'
                      ),
                      priority_season: form.getFieldValue('priority_season'),
                    },
                    'priority_season'
                  )
                }
                rules={[
                  {
                    validator: () =>
                      priorityError['priority_season']
                        ? Promise.reject()
                        : Promise.resolve(),
                  },
                ]}
                disabled={isViewMode || !seasonCheck}
                isShowLabel={false}
                isHideErrorMessage={true}
                required={seasonCheck && selectedValueRadioRules ? true : false}
                // defaultValue={season[0]?.adjustement_season_id?.priority}
                noInitValue
                name="priority_season"
                options={optionPriority}
              />
            </div>
          )}
          {selectedValueRadioRules == 'designation' && (
            <RadioButtonSimple
              // required={selectedValueRadioRules == 'designation' && seasonCheck}
              disabled={
                selectedValueRadioRules == 'designation' && !seasonCheck
              }
              rules={[
                {
                  validator: validateValueField(
                    setIsNotValidSelectRules,
                    1,
                    selectedValueRadioRules == 'designation' && seasonCheck
                  ),
                },
              ]}
              form={form}
              name="radioSelectAjustment"
              groupId="group1"
              value="season"
              label="Select:"
              selectedValue={selectedValueRules['group1']}
              onChange={handleRadioChangeRules}
            />
          )}
        </div>
        {seasonCheck && (
          <>
            {isErrorPrioritySeason && (
              <div style={{ color: 'red', padding: '0 8px' }}>
                Priority is required for selected criteria
              </div>
            )}
            {priorityError['priority_season'] && (
              <div style={{ color: 'red', padding: '0 8px' }}>
                Priority order is duplicated for selected criteria
              </div>
            )}
            <div style={{ color: 'red', padding: '0 8px' }}>
              {Object.values(isNotValidSelectRules).some(
                value => value === true
              ) &&
                seasonCheck &&
                'Select is required for one of the selected criteria'}
            </div>
          </>
        )}
        <TableBasic
          // rowSelection={rowSelection}
          dataSource={dataSeason}
          columns={getColumnSeason(
            form,
            isViewMode || !seasonCheck,
            seasonCheck,
            setIsNotValidSeason,
            setIsPercents,
            isPercents
          )}
        />
        {seasonCheck && (
          <div style={{ color: 'red', padding: '0 8px' }}>
            {Object.values(isNotValidSeason).some(value => value === true) &&
              'Value is required'}
          </div>
        )}
      </div>
    );
  }, [
    selectedRowKeys,
    isErrorPrioritySeason,
    dataSource,
    isNotValidSeason,
    priorityError,
    seasonCheck,
    season,
    selectedValueRadioRules,
    isPercents,
    selectedValueRules,
    isNotValidSelectRules,
    isViewMode,
    optionPriority,
  ]);
  const renderOccupancy = useMemo(() => {
    return (
      <div className="austment_table">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <MyCheckBoxWithState
            form={form}
            disabled={isViewMode}
            check={occupancyCheck}
            name={`occupancyCheck`}
            onChange={e => setOccupancyCheck(e.target.checked)}
            label="Occupancy"
          />
          {selectedValueRadioRules == 'sequence' && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div>Priority</div>
              <SelectBasic
                disabled={isViewMode || !occupancyCheck}
                required={
                  occupancyCheck && selectedValueRadioRules ? true : false
                }
                onChange={() =>
                  validateDuplicate(
                    {
                      priority_occupancy: form.getFieldValue(
                        'priority_occupancy'
                      ),
                      priority_day_type: form.getFieldValue(
                        'priority_day_type'
                      ),
                      priority_season: form.getFieldValue('priority_season'),
                    },
                    'priority_occupancy'
                  )
                }
                rules={[
                  {
                    validator: () =>
                      priorityError['priority_occupancy']
                        ? Promise.reject()
                        : Promise.resolve(),
                  },
                ]}
                isHideErrorMessage={true}
                name="priority_occupancy"
                isShowLabel={false}
                noInitValue
                // defaultValue={occupancy[0]?.adjustement_occupancy_id?.priority}
                options={optionPriority}
              />
            </div>
          )}

          {selectedValueRadioRules == 'designation' && (
            <RadioButtonSimple
              // required={
              //   selectedValueRadioRules == 'designation' && occupancyCheck
              // }
              disabled={
                selectedValueRadioRules == 'designation' && !occupancyCheck
              }
              rules={[
                {
                  validator: validateValueField(
                    setIsNotValidSelectRules,
                    1,
                    selectedValueRadioRules == 'designation' && occupancyCheck
                  ),
                },
              ]}
              form={form}
              name="radioSelectAjustment"
              groupId="group1"
              value="occupancy"
              label="Select:"
              selectedValue={selectedValueRules['group1']}
              onChange={handleRadioChangeRules}
            />
          )}
        </div>
        {occupancyCheck && (
          <>
            {isErrorPriorityOccupancy && (
              <div style={{ color: 'red', padding: '0 8px' }}>
                Priority is required for selected criteria
              </div>
            )}
            {priorityError['priority_occupancy'] && (
              <div style={{ color: 'red', padding: '0 8px' }}>
                Priority order is duplicated for selected criteria
              </div>
            )}
            <div style={{ color: 'red', padding: '0 8px' }}>
              {Object.values(isNotValidSelectRules).some(
                value => value === true
              ) &&
                occupancyCheck &&
                'Select is required for one of the selected criteria'}
            </div>
          </>
        )}
        <div
          style={{ cursor: 'pointer', marginLeft: 6 }}
          onClick={() => {
            if (selectedRowKeys.length > 0) {
              setIsModalDelete(true);
            }
          }}
        >
          <DeleteOutlined />
          <span style={{ marginLeft: 4 }}>Delete</span>
        </div>
        <TableBasic
          rowSelection={rowSelection}
          dataSource={dataOccupancy}
          columns={getColumnOccupancy(
            form,
            isViewMode || !occupancyCheck,
            occupancyCheck,
            setIsValidFromTo,
            setIsFromToNotOverlap,
            setIsNotValid,
            setIsPercents,
            isPercents
          )}
          footer={() => (
            <button
              disabled={isViewMode || !occupancyCheck}
              onClick={handleAddRow}
              style={{
                color: `${
                  !(isViewMode || !occupancyCheck) ? 'red' : '#56524f'
                }`,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
              }}
            >
              + Add
            </button>
          )}
        />

        {occupancyCheck && (
          <>
            {' '}
            <div style={{ color: 'red', padding: '0 8px' }}>
              {Object.values(isNotValidOccu).some(value => value === true) &&
                'Value is required'}
            </div>
            {!Object.values(isValidFromTo).every(value => value === true) && (
              <div style={{ color: 'red', padding: '0 8px' }}>
                {'From must be greater than To'}
              </div>
            )}
            {Object.values(isFromToNotOverlap).some(
              value => value === true
            ) && (
              <div style={{ color: 'red', padding: '0 8px' }}>
                {'From - To can not overlap'}
              </div>
            )}
          </>
        )}
        {isNotDataInOccupancy && (
          <div style={{ color: 'red', padding: '0 8px' }}>
            {'No data available in the table'}
          </div>
        )}
      </div>
    );
  }, [
    selectedRowKeys,
    isNotDataInOccupancy,
    isFromToNotOverlap,
    isValidFromTo,
    dataSource,
    occupancy,
    selectedValueRules,
    isPercents,
    occupancyCheck,
    isNotValidSelectRules,
    dataOccupancy,
    selectedValueRadioRules,
    isNotValidOccu,
    optionPriority,
    priorityError,
    isErrorPriorityOccupancy,
    isViewMode,
  ]);
  return (
    <div className="rate-ajustment-wrapper">
      {renderHeader}
      {/* <TableBasic dataSource={[]} columns={columns} /> */}
      {/* <MyCollapse getItems={getItems} accordion={false} activeKey={['3']} /> */}
      <div className="rate-backgroud-wrapper">
        {renderOccupancy}
        {renderDayType}
        {renderSeason}
      </div>
      <DeleteModal
        content="Are you sure to delete the record(s)?"
        visible={isModalDelete}
        onOk={handleDelete}
        onCancel={onCancelDelete}
      />
    </div>
  );
};

export default RateAjustmentNew;
