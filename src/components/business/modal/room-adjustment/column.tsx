import { Checkbox } from 'antd';
import InputValue from '../../input/inputValue';
import SelectBasic from '../../select/SelectBasic';
import SelectBasicCustom from '../../select/SelectBasicCustom';
import MyCheckBox from '../../checkbox/MyCheckBox';
import InputNumberValue from '../../input/inputNumberValue';
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
  console.log('check id check', id);
  setIsPercents((prev: any) => ({
    ...prev,
    [id]: checked, // Lưu trạng thái của checkbox vào key là id
  }));
};
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
    title: 'From (%)',
    dataIndex: 'from',
    key: 'from',
    align: 'center',
    render: (from: any, record: any, index: number) => (
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
                      [`from${index}`]: true,
                    }));
                    return Promise.reject();
                  } else {
                    setIsNotValid((prevState: any) => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`from${index}`]: false,
                    }));
                  }
                  console.log('check value', value);
                  value = convertCommaToDot(value);

                  console.log('check value for from', value);

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
                    form.getFieldValue(`occupancy[${index}].to`)
                  );

                  // Kiểm tra nếu giá trị `from` lớn hơn bất kỳ `to` nào khác
                  const isInvalid = hasOverlap(occupancyFields);

                  const to = convertCommaToDot(
                    form.getFieldValue(`occupancy[${index}].to`)
                  );

                  if (
                    Number(value) < 0 ||
                    (to !== undefined && Number(value) >= Number(to))
                  ) {
                    setIsValidFromTo((prevState: any) => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`from${index}`]: false,
                    }));
                    return Promise.reject();
                  } else {
                    setIsValidFromTo((prevState: any) => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`from${index}`]: true,
                    }));
                  }
                  if (isInvalid) {
                    setIsFromToNotOverlap((prevState: any) => ({
                      ...prevState,
                      [`from_overlap_${index}`]: true,
                    }));
                    return Promise.reject();
                    // new Error('From must be less than all other To values.')
                  } else {
                    setIsFromToNotOverlap((prevState: any) => ({
                      ...prevState,
                      [`from_overlap_${index}`]: false,
                    }));
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
          isHideErrorMessage={true}
          required={occupancyCheck}
          label="from"
          handleBeforeInput={handleBeforeInputFloat}
          disabled={isViewMode}
          name={`occupancy[${index}].from`}
          form={form}
        />
        <span style={{ padding: '0 6px' }}>%</span>
      </div>
    ),
  },
  {
    title: 'To (%)',
    dataIndex: 'to',
    key: 'to',
    align: 'center',
    // width: 100,
    render: (to: any, record: any, index: number) => (
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
                      [`from${index}`]: true,
                    }));
                    return Promise.reject();
                  } else {
                    setIsNotValid((prevState: any) => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`from${index}`]: false,
                    }));
                  }

                  console.log('check value', value);
                  value = convertCommaToDot(value);

                  console.log('check value for from', value);

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
                    form.getFieldValue(`occupancy[${index}].to`)
                  );
                  console.log('check currentTo', currentTo);
                  console.log('check occupancyFields', occupancyFields);

                  // Kiểm tra nếu giá trị `from` lớn hơn bất kỳ `to` nào khác
                  const isInvalid = hasOverlap(occupancyFields);
                  console.log('check is valid ', isInvalid);
                  value = convertCommaToDot(value);
                  console.log('check value', value);
                  const from = convertCommaToDot(
                    form.getFieldValue(`occupancy[${index}].from`)
                  );

                  if (
                    Number(value) < 0 ||
                    (from !== undefined && Number(value) <= Number(from))
                  ) {
                    setIsValidFromTo((prevState: any) => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`to${index}`]: false,
                    }));
                    return Promise.reject();
                  } else {
                    setIsValidFromTo((prevState: any) => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`to${index}`]: true,
                    }));
                  }
                  if (isInvalid) {
                    setIsFromToNotOverlap((prevState: any) => ({
                      ...prevState,
                      [`to_overlap_${index}`]: true,
                    }));
                    return Promise.reject();
                    // new Error('From must be less than all other To values.')
                  } else {
                    setIsFromToNotOverlap((prevState: any) => ({
                      ...prevState,
                      [`to_overlap_${index}`]: false,
                    }));
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
          isHideErrorMessage={true}
          required={occupancyCheck}
          handleBeforeInput={handleBeforeInputFloat}
          label="to"
          disabled={isViewMode}
          name={`occupancy[${index}].to`}
          form={form}
        />
        <span style={{ padding: '0 6px' }}>%</span>
      </div>
    ),
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    align: 'center',
    width: 300,
    render: (_: any, record: any, index: number) => {
      console.log('check recod in value', record.key);
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!isViewMode && (
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
              isShowLabel={false}
              noInitValue
              isHideErrorMessage={true}
              required={occupancyCheck}
              name={`occupancy[${index}].is_increase`}
              disabled={isViewMode}
              form={form}
              options={[
                { value: true, label: '+' },
                { value: false, label: '-' },
              ]}
            />
          )}
          <span style={{ margin: '0 6px' }}>
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
              isFormatDolla
              isPercent={
                isPercents[`occupancy[${index}].is_percent`]
                  ? isPercents[`occupancy[${index}].is_percent`]
                  : false
              }
              isHideErrorMessage={true}
              required={occupancyCheck}
              label="value"
              handleBeforeInput={handleBeforeInputFloat}
              name={`occupancy[${index}].value`}
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
              name={`occupancy[${index}].id`}
            />
            <InputValue
              isHideErrorMessage={true}
              label="id"
              placeholder="-"
              hidden
              disabled={isViewMode}
              form={form}
              name={`occupancy[${index}].id_item`}
            />
          </span>
          <MyCheckBox
            form={form}
            // defaultValue={false}
            disabled={isViewMode}
            name={`occupancy[${index}].is_percent`}
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
  setDayTypeCheck: (e: any) => void,
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!isViewMode && (
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
            isShowLabel={false}
            isHideErrorMessage
            required={dayTypeCheck}
            disabled={isViewMode}
            name={`dayType[${index}].is_increase`}
            noInitValue
            form={form}
            options={[
              { value: true, label: '+' },
              { value: false, label: '-' },
            ]}
          />
        )}
        <span style={{ margin: '0 6px' }}>
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
            isPercent={
              isPercents[`dayType[${index}].is_percent`]
                ? isPercents[`dayType[${index}].is_percent`]
                : false
            }
            handleBeforeInput={handleBeforeInputFloat}
            isFormatDolla
            isHideErrorMessage={true}
            setErrorState={setDayTypeCheck}
            required={dayTypeCheck}
            label="value"
            disabled={isViewMode}
            name={`dayType[${index}].value`}
            form={form}
          />
          <InputValue
            isHideErrorMessage={true}
            required={dayTypeCheck}
            label="to"
            placeholder="-"
            hidden
            disabled={isViewMode}
            form={form}
            name={`dayType[${index}].id`}
          />
          <InputValue
            isHideErrorMessage={true}
            required={dayTypeCheck}
            label="to"
            placeholder="-"
            hidden
            disabled={isViewMode}
            form={form}
            name={`dayType[${index}].type`}
          />
        </span>
        <MyCheckBox
          form={form}
          // defaultValue={false}
          disabled={isViewMode}
          name={`dayType[${index}].is_percent`}
          onChange={e => handleCheckboxChange(e, setIsPercents)}
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!isViewMode && (
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
            isHideErrorMessage={true}
            required={seasonCheck}
            isShowLabel={false}
            disabled={isViewMode}
            name={`season[${index}].is_increase`}
            noInitValue
            form={form}
            options={[
              { value: true, label: '+' },
              { value: false, label: '-' },
            ]}
          />
        )}
        <span style={{ margin: '0 6px' }}>
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
            placeholder="-"
            hidden
            disabled={isViewMode}
            form={form}
            name={`season[${index}].type`}
          />
        </span>
        <MyCheckBox
          // defaultValue={false}
          form={form}
          disabled={isViewMode}
          name={`season[${index}].is_percent`}
          onChange={e => handleCheckboxChange(e, setIsPercents)}
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
    is_increase: null,
  },
  {
    key: '2',
    type: 'Holiday',
    value: null,
    is_increase: null,
  },
];
export const dataSourceSeason = [
  {
    key: '1',
    type: 'Hight',
    value: null,
    is_increase: null,
  },
  {
    key: '2',
    type: 'Low',
    value: null,
    is_increase: null,
  },
];
