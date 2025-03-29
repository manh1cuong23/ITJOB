import { Checkbox } from 'antd';
import InputValue from '../../input/inputValue';
import SelectBasic from '../../select/SelectBasic';
import SelectBasicCustom from '../../select/SelectBasicCustom';
import MyCheckBox from '../../checkbox/MyCheckBox';
import InputValueString from '../../input/inputValueString';
import { convertCommaToDot, handleBeforeInputFloat } from '@/utils/formatInput';
import {
  hasOverlap,
  validateBooleanField,
  validateValueField,
} from '@/utils/validateInput';
const handleCheckboxChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setIsPercents: React.Dispatch<React.SetStateAction<any>>
) => {
  const { id, checked } = e.target;

  setIsPercents((prev: any) => ({
    ...prev,
    [id]: checked, // Lưu trạng thái của checkbox vào key là id
  }));
};
export const optionSelectPlus = [
  {
    value: true,
    label: <span style={{ color: '#15803D' }}>+</span>,
  },
  {
    value: false,
    label: <span style={{ color: '#DC2626' }}>-</span>,
  },
];
export const getColumnOccupancy = (
  form: any,
  isViewMode: boolean | undefined,
  occupancyCheck: boolean | undefined,
  setIsValidFromTo: any,
  setIsFromToNotOverlap: any,
  setIsNotValid: any,
  setIsPercents: any,
  isPercents: any
): any => [
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    align: 'center',
    render: (from: any, record: any, index: number) => {
      if (record?.isDeleted) return null;
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputValueString
            rules={[
              {
                validator: (_: any, value: any) => {
                  if (occupancyCheck) {
                    if (!value || value.trim() === '') {
                      // Nếu không có giá trị (chưa nhập hoặc chỉ có khoảng trắng)
                      setIsNotValid((prevState: any) => ({
                        ...prevState, // Giữ lại các field hiện có
                        [`from${record.key}`]: true,
                      }));
                      return Promise.reject();
                    } else {
                      setIsNotValid((prevState: any) => ({
                        ...prevState, // Giữ lại các field hiện có
                        [`from${record.key}`]: false,
                      }));
                    }
                    value = convertCommaToDot(value);

                    const allFields = form.getFieldsValue(); // Lấy tất cả giá trị trong form
                    const occupancyFields = Object.entries(allFields)
                      .filter(
                        ([key]) =>
                          (key.startsWith('occupancy') && key.endsWith('to')) ||
                          key.endsWith('from')
                      )
                      .map(([key, value]) => ({
                        key,
                        value,
                      })); // Lấy toàn bộ dữ liệu trong bảng
                    const currentTo = convertCommaToDot(
                      form.getFieldValue(`occupancy[${record.key}].to`)
                    );

                    // Kiểm tra nếu giá trị `from` lớn hơn bất kỳ `to` nào khác
                    const isInvalid = hasOverlap(occupancyFields);

                    const to = convertCommaToDot(
                      form.getFieldValue(`occupancy[${record.key}].to`)
                    );
                    if (
                      Number(value) < 0 ||
                      (to !== undefined && Number(value) > Number(to))
                    ) {
                      setIsValidFromTo((prevState: any) => ({
                        ...prevState, // Giữ lại các field hiện có
                        [`from${record.key}`]: false,
                      }));
                      return Promise.reject();
                    } else {
                      setIsValidFromTo((prevState: any) => ({
                        ...prevState, // Giữ lại các field hiện có
                        [`from${record.key}`]: true,
                      }));
                    }
                    if (isInvalid) {
                      setIsFromToNotOverlap((prevState: any) => ({
                        ...prevState,
                        [`from_overlap_${record.key}`]: true,
                      }));
                      return Promise.reject();
                      // new Error('From must be less than all other To values.')
                    } else {
                      setIsFromToNotOverlap((prevState: any) => ({
                        ...prevState,
                        [`from_overlap_${record.key}`]: false,
                      }));
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
            handleBeforeInput={handleBeforeInputFloat}
            isHideErrorMessage={true}
            required={occupancyCheck}
            label="from"
            disabled={isViewMode}
            name={`occupancy[${record.key}].from`}
            form={form}
          />
          <span style={{ padding: '0 6px' }}>%</span>
        </div>
      );
    },
  },
  {
    title: 'To',
    dataIndex: 'to',
    key: 'to',
    align: 'center',
    render: (to: any, record: any, index: number) => {
      if (record?.isDeleted) return null;
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputValueString
            rules={[
              {
                validator: (_: any, value: any) => {
                  if (occupancyCheck) {
                    if (!value || value.trim() === '') {
                      // Nếu không có giá trị (chưa nhập hoặc chỉ có khoảng trắng)
                      setIsNotValid((prevState: any) => ({
                        ...prevState, // Giữ lại các field hiện có
                        [`from${record.key}`]: true,
                      }));
                      return Promise.reject();
                    } else {
                      setIsNotValid((prevState: any) => ({
                        ...prevState, // Giữ lại các field hiện có
                        [`from${record.key}`]: false,
                      }));
                    }

                    value = convertCommaToDot(value);
                    const allFields = form.getFieldsValue(); // Lấy tất cả giá trị trong form
                    const occupancyFields = Object.entries(allFields)
                      .filter(
                        ([key]) =>
                          (key.startsWith('occupancy') && key.endsWith('to')) ||
                          key.endsWith('from')
                      )
                      .map(([key, value]) => ({
                        key,
                        value,
                      })); // Lấy toàn bộ dữ liệu trong bảng
                    const currentTo = convertCommaToDot(
                      form.getFieldValue(`occupancy[${record.key}].to`)
                    );

                    // Kiểm tra nếu giá trị `from` lớn hơn bất kỳ `to` nào khác
                    const isInvalid = hasOverlap(occupancyFields);
                    value = convertCommaToDot(value);
                    const from = convertCommaToDot(
                      form.getFieldValue(`occupancy[${record.key}].from`)
                    );

                    if (
                      Number(value) < 0 ||
                      (from !== undefined && Number(value) < Number(from))
                    ) {
                      setIsValidFromTo((prevState: any) => ({
                        ...prevState, // Giữ lại các field hiện có
                        [`to${record.key}`]: false,
                      }));
                      return Promise.reject();
                    } else {
                      setIsValidFromTo((prevState: any) => ({
                        ...prevState, // Giữ lại các field hiện có
                        [`to${record.key}`]: true,
                      }));
                    }
                    if (isInvalid) {
                      setIsFromToNotOverlap((prevState: any) => ({
                        ...prevState,
                        [`to_overlap_${record.key}`]: true,
                      }));
                      return Promise.reject();
                      // new Error('From must be less than all other To values.')
                    } else {
                      setIsFromToNotOverlap((prevState: any) => ({
                        ...prevState,
                        [`to_overlap_${record.key}`]: false,
                      }));
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
            handleBeforeInput={handleBeforeInputFloat}
            isFormatDolla
            isHideErrorMessage={true}
            required={occupancyCheck}
            label="to"
            disabled={isViewMode}
            name={`occupancy[${record.key}].to`}
            form={form}
          />
          <span style={{ padding: '0 6px' }}>%</span>
        </div>
      );
    },
  },
  {
    title: 'Value',
    dataIndex: 'packagePlan',
    key: 'packagePlan',
    align: 'center',
    width: '300px',
    render: (_: any, record: any, index: number) => {
      if (record?.isDeleted) return null;
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <SelectBasicCustom
            rules={[
              {
                validator: validateBooleanField(
                  setIsNotValid,
                  index,
                  occupancyCheck
                ),
              },
            ]}
            isHideErrorMessage={true}
            isShowLabel={false}
            required={occupancyCheck}
            noInitValue
            name={`occupancy[${record.key}].is_increase`}
            disabled={isViewMode}
            form={form}
            options={optionSelectPlus}
          />
          <span style={{ margin: '0 12px', flex: 1 }}>
            <InputValueString
              rules={[
                {
                  validator: validateValueField(
                    setIsNotValid,
                    index,
                    occupancyCheck
                  ),
                },
              ]}
              handleBeforeInput={handleBeforeInputFloat}
              isHideErrorMessage={true}
              required={occupancyCheck}
              label="value"
              isFormatDolla
              isPercent={
                isPercents[`occupancy[${record.key}].is_percent`]
                  ? isPercents[`occupancy[${record.key}].is_percent`]
                  : false
              }
              name={`occupancy[${record.key}].value`}
              disabled={isViewMode}
              form={form}
            />
            <InputValue
              isHideErrorMessage={true}
              label="id"
              placeholder="-"
              hidden
              disabled={isViewMode}
              form={form}
              name={`occupancy[${record.key}].id`}
            />
          </span>
          <MyCheckBox
            defaultValue={false}
            form={form}
            disabled={isViewMode}
            name={`occupancy[${record.key}].is_percent`}
            onChange={e => handleCheckboxChange(e, setIsPercents)}
            label="%"
          />
        </div>
      );
    },
  },
];
export const getColumnDayType = (
  form: any,
  isViewMode: boolean | undefined,
  dayTypeCheck: boolean | undefined,
  setIsNotValidDayType: any,
  setIsPercents: any,
  isPercents: any
): any => [
  {
    title: <div style={{ textAlign: 'left' }}>Type</div>, // Header căn trái
    dataIndex: 'type',
    key: 'type',
    align: 'center', // Dữ liệu căn giữa
  },
  {
    title: <div style={{ textAlign: 'left' }}>Value</div>, // Header căn trái
    dataIndex: 'value',
    key: 'value',
    align: 'center', // Dữ liệu căn giữa
    render: (_: any, record: any, index: number) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <SelectBasicCustom
          rules={[
            {
              validator: validateBooleanField(
                setIsNotValidDayType,
                index,
                dayTypeCheck
              ),
            },
          ]}
          isHideErrorMessage={true}
          isShowLabel={false}
          required={dayTypeCheck}
          disabled={isViewMode}
          name={`dayType[${index}].is_increase`}
          noInitValue
          form={form}
          options={optionSelectPlus}
        />
        <span style={{ margin: '0 12px', flex: 1 }}>
          <InputValueString
            rules={[
              {
                validator: validateValueField(
                  setIsNotValidDayType,
                  index,
                  dayTypeCheck
                ),
              },
            ]}
            isHideErrorMessage={true}
            isPercent={
              isPercents[`dayType[${index}].is_percent`]
                ? isPercents[`dayType[${index}].is_percent`]
                : false
            }
            handleBeforeInput={handleBeforeInputFloat}
            isFormatDolla
            required={dayTypeCheck}
            label="value"
            disabled={isViewMode}
            name={`dayType[${index}].value`}
            form={form}
          />
          <InputValue
            isHideErrorMessage={true}
            label="to"
            placeholder="-"
            hidden
            disabled={isViewMode}
            form={form}
            name={`dayType[${index}].id`}
          />
          <InputValue
            isHideErrorMessage={true}
            label="id"
            placeholder="-"
            hidden
            value={record?.type}
            disabled={isViewMode}
            form={form}
            name={`dayType[${index}].type`}
          />
        </span>
        <MyCheckBox
          defaultValue={false}
          form={form}
          onChange={e => handleCheckboxChange(e, setIsPercents)}
          disabled={isViewMode}
          name={`dayType[${index}].is_percent`}
          // onChange={e => console.log('Checkbox Checked:', e.target.checked)}
          label="%"
        />
      </div>
    ),
  },
];
export const getColumnSeason = (
  form: any,
  isViewMode: boolean | undefined,
  seasonCheck: boolean | undefined,
  setIsNotValidSeason: any,
  setIsPercents: any,
  isPercents: any
): any => [
  {
    title: <div style={{ textAlign: 'left' }}>Type</div>, // Header căn trái
    dataIndex: 'type',
    key: 'type',
    align: 'center', // Dữ liệu căn giữa
  },
  {
    title: <div style={{ textAlign: 'left' }}>Value</div>, // Header căn trái
    dataIndex: 'value',
    key: 'value',
    align: 'center', // Dữ liệu căn giữa
    render: (_: any, record: any, index: number) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <SelectBasicCustom
          rules={[
            {
              validator: validateBooleanField(
                setIsNotValidSeason,
                index,
                seasonCheck
              ),
            },
          ]}
          required={seasonCheck}
          isHideErrorMessage={true}
          isShowLabel={false}
          disabled={isViewMode}
          name={`season[${index}].is_increase`}
          noInitValue
          form={form}
          options={optionSelectPlus}
        />
        <span style={{ margin: '0 12px', flex: 1 }}>
          <InputValueString
            rules={[
              {
                validator: validateValueField(
                  setIsNotValidSeason,
                  index,
                  seasonCheck
                ),
              },
            ]}
            handleBeforeInput={handleBeforeInputFloat}
            isFormatDolla
            isPercent={
              isPercents[`season[${index}].is_percent`]
                ? isPercents[`season[${index}].is_percent`]
                : false
            }
            isHideErrorMessage={true}
            required={seasonCheck}
            label="to"
            disabled={isViewMode}
            name={`season[${index}].value`}
            form={form}
          />
          <InputValue
            isHideErrorMessage={true}
            placeholder="-"
            hidden
            disabled={isViewMode}
            form={form}
            name={`season[${index}].id`}
          />
          <InputValue
            isHideErrorMessage={true}
            label="id"
            placeholder="-"
            hidden
            value={record?.type}
            disabled={isViewMode}
            form={form}
            name={`season[${index}].type`}
          />
        </span>
        <MyCheckBox
          defaultValue={false}
          onChange={e => handleCheckboxChange(e, setIsPercents)}
          form={form}
          disabled={isViewMode}
          name={`season[${index}].is_percent`}
          // onChange={e => console.log('Checkbox Checked:', e.target.checked)}
          label="%"
        />
      </div>
    ),
  },
];

// Dữ liệu mẫu:
export const dataSourceDayType = [
  {
    key: '1',
    type: 'Weekend',
    value: null,
  },
  {
    key: '2',
    type: 'Holiday',
    value: null,
  },
];
export const dataSourceSeason = [
  {
    key: '1',
    type: 'Hight',
    value: null,
  },
  {
    key: '2',
    type: 'Low',
    value: null,
  },
];
