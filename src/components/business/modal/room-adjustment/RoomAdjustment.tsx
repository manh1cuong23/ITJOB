import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { TableBasic } from '@/components/basic/table';
import { MyFormItem } from '@/components/basic/form-item';
import './RoomAdjustment.less';
import { MyRadio } from '@/components/basic/radio';
interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

import SelectBasic from '../../select/SelectBasic';
import Icon, { DeleteOutlined } from '@ant-design/icons';
import {
  getColumnDayType,
  getColumnOccupancy,
  getColumnSeason,
} from './column';
import MyCheckBoxWithState from '../../checkbox/MyCheckBoxWithState';
import RadioButtonSimple from '@/components/basic/radio/RadioSimple';
import { validateValueField } from '@/utils/validateInput';
import { generateUniqueString } from '@/utils/common';
import { formatMoney } from '@/utils/formatCurrentcy';

const formatNumber = (value: number) => {
  return value.toLocaleString('de-DE'); // Sử dụng định dạng của Đức (cách 3 chữ số bằng dấu chấm)
};

const RateAjustment: React.FC<{
  isViewMode?: boolean;
  disabled?: boolean;
  data?: any;
  open?: boolean;
  isErrorPriorityOccupancy?: boolean;
  setIsLoading?: (a: boolean) => void;
  isLoading?: boolean;
  isErrorPrioritySeason?: boolean;
  isErrorPriorityDayType?: boolean;
  setSelectOcccupancyDeletes?: any;
  form?: any;
}> = ({
  isViewMode,
  data,
  setIsLoading,
  isLoading,
  open,
  isErrorPriorityOccupancy,
  isErrorPrioritySeason,
  setSelectOcccupancyDeletes,
  isErrorPriorityDayType,
  disabled,
  form,
}) => {
  const [selectedValueRadioRules, setSelectedValueRadioRules] = useState<
    string | undefined
  >(data?.occupancy);
  const [selectedValueRulesChild, setSelectedValueRulesChild] = useState<any>(
    ''
  );
  const [occupancy, setOccupancy] = useState<any>([]);
  const [occupancyCheck, setOccupancyCheck] = useState<boolean>(false);
  const [dayTypeCheck, setDayTypeCheck] = useState<boolean>(false);
  const [seasonCheck, setSeasonCheck] = useState<boolean>(false);
  const [dayType, setDayType] = useState<any>([]);
  const [season, setSeason] = useState<any>([]);
  const [dataOccupancy, setDataOccupancy] = useState<any>([]);
  const [isValidFromTo, setIsValidFromTo] = useState<any>({});
  const [isFromToNotOverlap, setIsFromToNotOverlap] = useState<any>({});
  const [isNotValidOccu, setIsNotValid] = useState<any>({});
  const [priorityError, setPriorityError] = useState<any>({});
  const [isNotValidSelectRules, setIsNotValidSelectRules] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowSections, setSelectedRowSections] = useState<React.Key[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isNotValidDayType, setIsNotValidDayType] = useState<any>({});
  const [isNotValidSeason, setIsNotValidSeason] = useState<any>({});
  const [indexKey, setIndexKey] = useState(0);
  const [isPercents, setIsPercents] = useState({});
  // const [selectOcccupancyDeletes, setSelectOcccupancyDeletes] =
  //   useState<any>(null);
  const [optionPriority, setOptionPriority] = useState<any>([]);
  const handleChangeRadioAjustment = (e: any) => {
    setSelectedValueRadioRules(e.target.value);
    setIsNotValidSelectRules({});
    setPriorityError({});
  };
  const [dataSource, setDataSource] = useState<any[]>(data);

  const handleRadioChangeRules = (groupId: any, value: any) => {
    setSelectedValueRulesChild((prev: any) => ({
      ...prev,
      [groupId]: value,
    }));
  };

  useEffect(() => {
    // Đếm số checkbox đang được check
    const count = [dayTypeCheck, seasonCheck, occupancyCheck].filter(Boolean)
      .length;

    // Tạo mảng option dựa trên số lượng checkbox được check
    const newOptions = Array.from({ length: count }, (_, index) => ({
      label: `${index + 1}`,
      value: index + 1,
    }));
    setOptionPriority(newOptions);
    form.setFieldsValue({
      priority_day_type: undefined, // hoặc giá trị mặc định
      priority_season: undefined, // hoặc giá trị mặc định
      priority_occupancy: undefined, // hoặc giá trị mặc định
      radioSelectAjustment: undefined,
    });
    // setSelectedValueRulesChild({});
    setIsNotValidSelectRules({});
    setPriorityError({});
  }, [dayTypeCheck, seasonCheck, occupancyCheck]);

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

  useEffect(() => {
    setIsPercents({});
    if (data) {
      setLoading(true);
      setSeason(data?.season);
      setDayType(data?.day_type);
      setOccupancy(data?.occupancy);
      setOccupancyCheck(data?.is_occupancy);
      setDayTypeCheck(data?.is_daytype);
      setSeasonCheck(data?.is_season);
    }
  }, [data]);

  const handleAddRow = () => {
    const newRow = {
      id: generateUniqueString(),
      from: '',
      to: '',
      is_increase: true,
      is_percent: true,
    };
    setOccupancy([...occupancy, newRow]);
    setIndexKey(prev => prev + 1);
  };
  const handleDelete = async () => {
    const idDelete = selectedRowSections
      .map((item: any) => {
        return item?.id_item;
      })
      .filter((id: any) => id !== undefined);
    if (idDelete && Array.isArray(idDelete)) {
      setSelectOcccupancyDeletes((prev: any) => {
        const updatedArray = prev ? [...prev, ...idDelete] : idDelete;
        return [...new Set(updatedArray)];
      });
    }
    const newData = dataOccupancy.filter(
      (item: any) => !selectedRowKeys.includes(item.id)
    );
    setDataOccupancy(newData);
    setSelectedRowKeys([]); // Clear selection
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
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(keys);
      setSelectedRowSections(selectedRows);
    },
  };

  const optionsAdjustment = [
    {
      label: 'Max Room',
      value: 'max_room',
    },
    {
      label: 'Min Room',
      value: 'min_room',
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

  useEffect(() => {
    setTimeout(() => {
      setSelectedValueRadioRules(data?.option_adjustment);
      form.setFieldsValue({ occupancyRadio: data?.option_adjustment });
      setLoading(false);
    }, 200);
  }, [open, data]);

  const renderHeader = useMemo(() => {
    return (
      <div className="room-ajustment-header">
        <MyFormItem
          name={'occupancyRadio'}
          form={form}
          label="Choosing the rule to apply the criteria"
          required={true}
          isShowLabel={false}
          disabled={isViewMode}
        >
          <MyRadio
            options={optionsAdjustment}
            value={selectedValueRadioRules}
            onChange={handleChangeRadioAjustment}
            loading={loading}
          />
        </MyFormItem>
      </div>
    );
  }, [selectedValueRadioRules, data, open]);
  useEffect(() => {
    dayType &&
      form.setFieldsValue({
        priority_day_type: dayType[0]?.priority,
      });
    season &&
      form.setFieldsValue({
        priority_season: season[0]?.priority,
      });
    occupancy &&
      form.setFieldsValue({
        priority_occupancy: occupancy[0]?.priority,
      });
  }, [dayType, season, occupancy, dataOccupancy]);

  useEffect(() => {
    const formattedData =
      dayType?.map((item: any, index: number) => {
        return {
          [`dayType[${index}].id`]: item?.id,
          [`dayType[${index}].type`]: item?.type,
          [`dayType[${index}].value`]: formatMoney(item?.value),
          [`dayType[${index}].is_percent`]: item?.is_percent,
          [`dayType[${index}].is_increase`]: item?.is_increase,
        };
      }) || [];

    // Đổ dữ liệu vào form
    form.setFields(
      formattedData.flatMap((field: any) =>
        Object.entries(field).map(([name, value]) => ({ name, value }))
      )
    );
  }, [form, dayType, data, open]);

  useEffect(() => {
    const formattedData =
      season?.map((item: any, index: number) => {
        return {
          [`season[${index}].id`]: item?.id,
          [`season[${index}].type`]: item?.type,
          [`season[${index}].value`]: formatMoney(item?.value),
          [`season[${index}].is_percent`]: item?.is_percent,
          [`season[${index}].is_increase`]: item?.is_increase,
        };
      }) || [];

    // Đổ dữ liệu vào form
    form.setFields(
      formattedData.flatMap((field: any) =>
        Object.entries(field)?.map(([name, value]) => ({ name, value }))
      )
    );
  }, [form, season, data, open]);

  useEffect(() => {
    const formattedData =
      occupancy?.map((item: any, index: number) => {
        return {
          [`occupancy[${index}].id`]: item?.id,
          [`occupancy[${index}].id_item`]: item?.id,
          [`occupancy[${index}].value`]: formatMoney(item?.value),
          [`occupancy[${index}].from`]: item?.from,
          [`occupancy[${index}].to`]: item?.to,
          [`occupancy[${index}].is_percent`]: item?.is_percent,
          [`occupancy[${index}].is_increase`]: item?.is_increase,
        };
      }) || [];

    // Đổ dữ liệu vào form
    form.setFields(
      formattedData.flatMap((field: any) =>
        Object.entries(field).map(([name, value]) => ({ name, value }))
      )
    );
  }, [form, occupancy, data, open]);

  const handleChangeooo = (e: any) => {
    setDayTypeCheck(e);
  };
  const renderDayType = useMemo(() => {
    const dataDayType = data?.day_type
      ? data?.day_type?.map((item: any) => item)
      : [];

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
                disabled={isViewMode}
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
              disabledEdit={isViewMode}
              rules={[
                {
                  validator: validateValueField(
                    setIsNotValidSelectRules,
                    0,
                    selectedValueRadioRules == 'designation' && dayTypeCheck
                  ),
                },
              ]}
              name="radioSelectAjustment"
              form={form}
              groupId="group1"
              value="daytype"
              label="Select:"
              selectedValue={selectedValueRulesChild['group1']}
              onChange={handleRadioChangeRules}
            />
          )}
        </div>
        {dayTypeCheck && (
          <>
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
          loading={isLoading}
          columns={getColumnDayType(
            form,
            isViewMode,
            dayTypeCheck,
            handleChangeooo,
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
    selectedValueRulesChild,
    dayTypeCheck,
    isNotValidDayType,
    isPercents,
    priorityError,
    selectedValueRadioRules,
    isViewMode,
    isErrorPriorityDayType,
    isNotValidSelectRules,
    isLoading,
    optionPriority,
  ]);
  const renderSeason = useMemo(() => {
    const dataSeason = data?.season
      ? data?.season?.map((item: any) => item)
      : [];

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
                disabled={isViewMode}
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
              disabledEdit={isViewMode}
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
              selectedValue={selectedValueRulesChild['group1']}
              onChange={handleRadioChangeRules}
            />
          )}
        </div>
        {season && (
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
          loading={isLoading}
          // rowSelection={rowSelection}
          dataSource={dataSeason}
          columns={getColumnSeason(
            form,
            isViewMode,
            seasonCheck,
            setIsNotValidSeason,
            setIsPercents,
            isPercents
          )}
        />
        {season && (
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
    selectedValueRulesChild,
    isNotValidSelectRules,
    data,
    isViewMode,
    isLoading,
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
                disabled={isViewMode}
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
              disabledEdit={isViewMode}
              // required={
              //   selectedValueRadioRules == 'designation' && occupancyCheck
              // }
              disabled={
                selectedValueRadioRules == 'designation' && !occupancyCheck
              }
              rules={[
                {
                  validator: (_: any, value: any) => {
                    if (
                      selectedValueRadioRules == 'designation' &&
                      occupancyCheck
                    ) {
                      if (!value || value.trim() === '') {
                        setIsNotValidSelectRules((prevState: any) => ({
                          ...prevState,
                          [`value2`]: true,
                        }));
                        return Promise.reject();
                      } else {
                        setIsNotValidSelectRules((prevState: any) => ({
                          ...prevState,
                          [`value2`]: false,
                        }));
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              form={form}
              name="radioSelectAjustment"
              groupId="group1"
              value="occupancy"
              label="Select:"
              selectedValue={selectedValueRulesChild['group1']}
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
          style={{ cursor: 'pointer', marginLeft: 6, display: 'flex' }}
          onClick={handleDelete}
        >
          <DeleteOutlined />
          <div style={{ marginLeft: 4 }}>Delete</div>
        </div>
        <TableBasic
          loading={isLoading}
          rowSelection={rowSelection}
          rowKey="id"
          dataSource={occupancy}
          columns={getColumnOccupancy(
            form,
            isViewMode,
            occupancyCheck,
            setIsValidFromTo,
            setIsFromToNotOverlap,
            setIsNotValid,
            setIsPercents,
            isPercents
          )}
          footer={() => (
            <div
              onClick={handleAddRow}
              style={{ color: 'red ', cursor: 'pointer' }}
            >
              + Add
            </div>
          )}
        />

        {occupancyCheck && (
          <>
            <div style={{ color: 'red', padding: '0 8px' }}>
              {Object.values(isNotValidOccu).some(value => value === true) &&
                'From, To, Value is required'}
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
                {'From - To can not intersect'}
              </div>
            )}
          </>
        )}
      </div>
    );
  }, [
    selectedRowKeys,
    isFromToNotOverlap,
    isValidFromTo,
    dataSource,
    occupancy,
    selectedValueRulesChild,
    isPercents,
    occupancyCheck,
    isNotValidSelectRules,
    dataOccupancy,
    selectedValueRadioRules,
    isNotValidOccu,
    optionPriority,
    priorityError,
    isLoading,
    isErrorPriorityOccupancy,
    isViewMode,
  ]);
  return (
    <div className="rate-ajustment-wrapper">
      {renderHeader}
      <div className="rate-backgroud-wrapper">
        {renderOccupancy}
        {renderDayType}
        {renderSeason}
      </div>
    </div>
  );
};

export default RateAjustment;
