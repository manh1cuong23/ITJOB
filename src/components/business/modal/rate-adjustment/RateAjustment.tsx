import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
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
import DeleteModal from '@/components/business/modal/shared-delete-confirm/SharedDeleteConfirm';
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
import RadioButtonSimple from '@/components/basic/radio/RadioSimple';
import { validateValueField } from '@/utils/validateInput';
import { formatMoney } from '@/utils/formatCurrentcy';

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
const RateAjustment: React.FC<{
  isViewMode?: boolean;
  disabled?: boolean;
  loading?: boolean;
  data?: any;
  isErrorPriorityOccupancy?: boolean;
  setIsLoading?: (a: boolean) => void;
  isLoading?: boolean;
  isErrorPrioritySeason?: boolean;
  isErrorPriorityDayType?: boolean;
  setSelectOcccupancyDeletes?: any;
  setIsNotDataInOccupancy: any;
  isNotDataInOccupancy: boolean;
  form?: any;
  options: { label: string; value: string }[];
}> = ({
  isViewMode,
  options,
  loading,
  data = [],
  isNotDataInOccupancy,
  setIsLoading,
  setIsNotDataInOccupancy,
  isLoading,
  isErrorPriorityOccupancy,
  isErrorPrioritySeason,
  setSelectOcccupancyDeletes,
  isErrorPriorityDayType,
  disabled,
  form,
}) => {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  );
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
  const [isModalDelete, setIsModalDelete] = useState(false);

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
  console.log('check dtaa', data);
  const [dataSource, setDataSource] = useState<any[]>(data);
  // });
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
    setSelectedValueRulesChild((prev: any) => ({
      ...prev,
      [groupId]: value,
    }));
  };

  const validateDuplicate = () => {
    const priority_occupancy = form.getFieldValue('priority_occupancy');
    const priority_day_type = form.getFieldValue('priority_day_type');
    const priority_season = form.getFieldValue('priority_season');

    const values = {
      priority_occupancy,
      priority_day_type,
      priority_season,
    };

    const allValues = Object.values(values);
    const duplicates = allValues.filter(
      (val, index, arr) => arr.indexOf(val) !== index && val !== undefined
    );

    const newErrors: Record<string, boolean> = {};

    Object.entries(values).forEach(([name, value]) => {
      newErrors[name] = duplicates.includes(value); // Đánh dấu lỗi nếu giá trị bị trùng
    });

    // Cập nhật state lỗi
    setPriorityError(newErrors);
  };
  console.log('setPriorityError', priorityError);
  const onCancelDelete = () => {
    setIsModalDelete(false);
  };
  useEffect(() => {
    console.log('sieu check', data);
    setIsPercents({});
    if (data?.item_season) {
    }
    if (data.length > 0) {
      // Thực hiện hành động khi mảng không rỗng
      if (setIsLoading) setIsLoading(false);
    }
    setIsPercents(prev => ({
      ...prev, // Giữ nguyên dữ liệu cũ

      // Thêm dữ liệu từ item_season
      ...Object.fromEntries(
        data.item_season.map((item: any, index: number) => [
          `season[${index}].is_percent`,
          item.adjustement_season_id.is_percent,
        ])
      ),

      // Thêm dữ liệu từ item_daytype
      ...Object.fromEntries(
        data.item_daytype.map((item: any, index: number) => [
          `dayType[${index}].is_percent`,
          item.adjustement_daytype_id.is_percent,
        ])
      ),

      // Thêm dữ liệu từ item_occupancy
      ...Object.fromEntries(
        data.item_occupancy.map((item: any, index: number) => [
          `occupancy[${index + 1}].is_percent`,
          item.adjustement_occupancy_id.is_percent,
        ])
      ),
    }));
    form.setFieldsValue(data);
    form.setFieldValue('dayTypeCheck', data?.is_daytype);
    form.setFieldValue('seasonCheck', data?.is_season);
    form.setFieldValue('occupancyCheck', data?.is_occupancy);
    form.setFieldsValue({
      priority_day_type: dayType[0]?.adjustement_daytype_id?.priority,
    });
    form.setFieldsValue({
      priority_season: season[0]?.adjustement_season_id?.priority,
    });
    form.setFieldsValue({
      priority_occupancy: occupancy[0]?.adjustement_occupancy_id?.priority,
    });
    if (data && data?.occupancy) {
      setSelectedValueRadioRules(data?.occupancy);
    }
    if (data && data?.selected) {
      setSelectedValueRulesChild({ group1: data?.selected });
      form.setFieldsValue({
        radioSelectAjustment: data?.selected,
      });
    }
    setOccupancy(data?.item_occupancy);
    setDayType(data?.item_daytype);
    setSeason(data?.item_season);
    setOccupancyCheck(data?.is_occupancy);
    setDayTypeCheck(data?.is_daytype);
    setSeasonCheck(data?.is_season);
    setDataOccupancy(
      data.item_occupancy?.map((item: any, index: number) => {
        setIndexKey(index + 1);
        return {
          ...item?.adjustement_occupancy_id,
          key: index + 1, // Thêm key là số thứ tự (bắt đầu từ 1)
        };
      })
    );

    setIsValidFromTo({});
    setIsFromToNotOverlap({});
    setIsNotValid({});
    setIsNotValidDayType({});
    setIsNotValidSeason({});
    setIsNotValidSelectRules({});
    setPriorityError({});
  }, [data]);
  const handleAddRow = () => {
    setIsNotDataInOccupancy(false);
    const newRow = {
      key: indexKey + 1,
      rateCode: '',
      roomType: '',
      packagePlan: '+',
      packageValue: '',
      packageChecked: false,
    };
    setDataOccupancy([...dataOccupancy, newRow]);
    setIndexKey(prev => prev + 1);
  };
  const handleDelete = async () => {
    const idDelete = selectedRowSections
      .map((item: any) => {
        return item?.id_item; // Lấy `id` của từng phần tử
      })
      .filter((id: any) => id !== undefined); // Loại bỏ các `undefined` nếu có
    if (idDelete && Array.isArray(idDelete)) {
      setSelectOcccupancyDeletes((prev: any) => {
        // Nếu prev đã tồn tại, gộp các phần tử trong idDelete vào prev mà không bị trùng
        const updatedArray = prev ? [...prev, ...idDelete] : idDelete;

        // Loại bỏ các phần tử trùng trong mảng
        return [...new Set(updatedArray)];
      });
    }
    const newData = dataOccupancy.filter(
      (item: any) => !selectedRowKeys.includes(item.key)
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
    message.success('Delete criteria successfully!');
    setIsModalDelete(false);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowSections, setSelectedRowSections] = useState<React.Key[]>(
    []
  );
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(keys);
      setSelectedRowSections(selectedRows);
    },
    getCheckboxProps: () => ({
      disabled: isViewMode, // Vô hiệu hóa checkbox trên từng dòng
    }),
    // onSelectAll: () => {}, // Ngăn chặn chọn tất cả
  };
  useEffect(() => {}, [selectedValueRadioRules]);
  const renderHeader = useMemo(() => {
    return (
      <div className="room-ajustment-header">
        <MyFormItem
          name="occupancy"
          label="Choosing the rule to apply the criteria"
          isShowLabel={false}
          disabled={isViewMode}
          form={form}
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
  }, [selectedValueRadioRules, data, isViewMode]);
  useEffect(() => {
    form.setFieldsValue({
      priority_day_type: dayType[0]?.adjustement_daytype_id?.priority,
    });
    form.setFieldsValue({
      priority_season: season[0]?.adjustement_season_id?.priority,
    });
    form.setFieldsValue({
      priority_occupancy: occupancy[0]?.adjustement_occupancy_id?.priority,
    });
  }, [dayType, season, occupancy, dataOccupancy]);
  useEffect(() => {
    const formattedData = dayType?.map((item: any, index: number) => {
      return {
        [`dayType[${index}].id`]: item.adjustement_daytype_id.id,
        [`dayType[${index}].id_item`]: item.adjustement_daytype_id.id_item,
        [`dayType[${index}].value`]: formatMoney(
          item.adjustement_daytype_id.value
        ),
        [`dayType[${index}].is_percent`]: item.adjustement_daytype_id
          .is_percent,
        [`dayType[${index}].is_increase`]: item.adjustement_daytype_id
          .is_increase,
      };
    });

    // Đổ dữ liệu vào form
    form.setFields(
      formattedData.flatMap((field: any) =>
        Object.entries(field).map(([name, value]) => ({ name, value }))
      )
    );
  }, [form, dayType, data]);
  useEffect(() => {
    const formattedData = occupancy?.map((item: any, index: number) => {
      return {
        [`occupancy[${index + 1}].id`]: item.adjustement_occupancy_id.id,
        [`occupancy[${index + 1}].id_item`]: item.adjustement_occupancy_id
          .id_item,
        [`occupancy[${index + 1}].value`]: formatMoney(
          item.adjustement_occupancy_id.value
        ),
        [`occupancy[${index + 1}].from`]: item.adjustement_occupancy_id.from,
        [`occupancy[${index + 1}].to`]: item.adjustement_occupancy_id.to,
        [`occupancy[${index + 1}].is_percent`]: item.adjustement_occupancy_id
          .is_percent,
        [`occupancy[${index + 1}].is_increase`]: item.adjustement_occupancy_id
          .is_increase,
      };
    });

    // Đổ dữ liệu vào form
    form.setFields(
      formattedData.flatMap((field: any) =>
        Object.entries(field).map(([name, value]) => ({ name, value }))
      )
    );
  }, [form, occupancy, data]);
  useEffect(() => {
    const formattedData = season?.map((item: any, index: number) => {
      return {
        [`season[${index}].id`]: item.adjustement_season_id.id,
        [`season[${index}].id_item`]: item.adjustement_season_id.id_item,
        [`season[${index}].value`]: formatMoney(
          item.adjustement_season_id.value
        ),
        [`season[${index}].is_percent`]: item.adjustement_season_id.is_percent,
        [`season[${index}].is_increase`]: item.adjustement_season_id
          .is_increase,
      };
    });

    // Đổ dữ liệu vào form
    form.setFields(
      formattedData.flatMap((field: any) =>
        Object.entries(field)?.map(([name, value]) => ({ name, value }))
      )
    );
  }, [form, season, data]);
  useEffect(() => {
    // Mapping data để đổ vào form
    const fields = dayType?.map((item: any, index: number) => ({
      name: [`dayType`, index],
      value: {
        id: item.adjustement_daytype_id.id,
        type: item.adjustement_daytype_id.type,
        value: item.adjustement_daytype_id.value,
        is_percent: item.adjustement_daytype_id.is_percent,
        is_increase: item.adjustement_daytype_id.is_increase,
      },
    }));

    // Set fields vào form
    form.setFields(fields);
  }, [dayType, form, data]);
  const handleChangeooo = (e: any) => {
    setDayTypeCheck(e);
  };
  const renderDayType = useMemo(() => {
    const dataDayType = data?.item_daytype?.map(
      (item: any) => item?.adjustement_daytype_id
    );

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
                onChange={() => validateDuplicate()}
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
          className="table-hidden-scrool"
          // rowSelection={rowSelection}
          dataSource={dataDayType}
          loading={isLoading}
          columns={getColumnDayType(
            form,
            isViewMode || !dayTypeCheck,
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
    const dataSeason = data?.item_season?.map(
      (item: any) => item?.adjustement_season_id
    );

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
                onChange={() => validateDuplicate()}
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
          className="table-hidden-scrool"
          loading={isLoading}
          // rowSelection={rowSelection}
          dataSource={dataSeason}
          // scroll={{ x: '100%' }}
          columns={getColumnSeason(
            form,
            isViewMode || !seasonCheck,
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
    console.log('Checl isPercents', isPercents);
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
                onChange={() => validateDuplicate()}
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
          onClick={() => {
            console.log('vodat');
            if (selectedRowKeys.length > 0) {
              setIsModalDelete(true);
            }
          }}
        >
          <DeleteOutlined />
          <div style={{ marginLeft: 4 }}>Delete</div>
        </div>
        <TableBasic
          className="table-hidden-scrool"
          loading={isLoading}
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
    isFromToNotOverlap,
    isValidFromTo,
    isNotDataInOccupancy,
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

export default RateAjustment;
