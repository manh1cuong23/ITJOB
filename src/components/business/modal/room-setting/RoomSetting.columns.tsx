import { validateValueField } from '@/utils/validateInput';
import MyCheckBox from '../../checkbox/MyCheckBox';
import InputValueString from '../../input/inputValueString';
import { handleBeforeInputFloat } from '@/utils/formatInput';
import { ReactComponent as ListCheckSvg } from '@/assets/icons/ic_list-check.svg';
import { ReactComponent as ListCollapseSvg } from '@/assets/icons/ic_list-collapse.svg';
import InputValue from '../../input/inputValue';
import { IError } from '../../booking-info/type';

const handleCheckboxChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setIsPercents: React.Dispatch<React.SetStateAction<any>>,
  index: number,
  form: any,
  setData: any
) => {
  const { id, checked } = e.target;
  console.log('check id check', id);
  setIsPercents((prev: any) => ({
    ...prev,
    [id]: checked, // Lưu trạng thái của checkbox vào key là id
  }));
  const data = form.getFieldsValue([`setting[${index}].id`]);
  const key = `setting[${index}].id`;
  setData((prev: any) => {
    return prev.map((item: any) => {
      if (item.id === data[key]) {
        return {
          ...item,
          is_percent: checked,
        };
      }
      return item;
    });
  });
};

const handleInputChange = (
  value: any,
  index: number,
  form: any,
  setData: any
) => {
  const data = form.getFieldsValue([`setting[${index}].id`]);
  const key = `setting[${index}].id`;
  const id = data[key];
  setData((prev: any) => {
    return prev.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          distribution_room: value,
        };
      }
      return item;
    });
  });
};

export const tableColumns = (
  form: any,
  isViewMode: boolean | undefined,
  settingCheck: boolean | undefined,
  setIsNotValid: any,
  setIsPercents: any,
  isPercents: any,
  isGrouped: boolean,
  toggleGroup: () => void,
  errorSetting: IError[],
  setData?: any,
  isAccount: boolean = false
): any => [
  {
    title: (
      <div className="group-title">
        {isGrouped ? (
          <ListCheckSvg className="group-icon" onClick={toggleGroup} />
        ) : (
          <ListCollapseSvg className="group-icon" onClick={toggleGroup} />
        )}
        Room Type
      </div>
    ),
    key: 'room_type',
    dataIndex: 'room_type',
    width: 190,
    render: (_value: string, record: any, index: number) => (
      <span
        style={{
          color: errorSetting?.some(error => error.row === index)
            ? '#DC2626'
            : '#1C1917',
        }}
      >
        {_value}
      </span>
    ),
  },
  ...(isAccount
    ? [
        {
          title: 'Account',
          key: 'account',
          dataIndex: 'account',
          width: 190,
        },
      ]
    : [
        {
          title: 'Market Segment',
          key: 'market_segment',
          dataIndex: 'market_segment',
          width: 190,
        },
      ]),
  {
    title: 'Distribution Room',
    key: 'distribution_room',
    dataIndex: 'distribution_room',
    render: (_: any, record: any, index: number) => {
      const isChildRow = record?.parentId !== undefined;

      if (isChildRow && record.children) {
        var childIndex = record.children.findIndex(
          (child: any) => child.id === record.id
        );
      }

      const percentName = `setting[${
        childIndex ? childIndex + index + 1 : index
      }].is_percent`;

      return isChildRow ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ margin: '0 6px' }}>{record.value}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ margin: '0 6px' }}>
            <InputValueString
              rules={[
                {
                  validator: validateValueField(
                    setIsNotValid,
                    index,
                    settingCheck
                  ),
                },
              ]}
              isFormatDolla
              isPercent={
                isPercents[percentName] ? isPercents[percentName] : false
              }
              isHideErrorMessage={true}
              required
              label="value"
              handleBeforeInput={handleBeforeInputFloat}
              name={`setting[${
                childIndex ? childIndex + index + 1 : index
              }].distribution_room`}
              disabled={isViewMode}
              form={form}
              onChange={value =>
                handleInputChange(
                  value,
                  childIndex ? childIndex + index + 1 : index,
                  form,
                  setData
                )
              }
            />
            <InputValue
              isHideErrorMessage={true}
              label="id"
              placeholder="-"
              hidden
              disabled={isViewMode}
              form={form}
              name={`setting[${
                childIndex ? childIndex + index + 1 : index
              }].id`}
            />
          </span>
          <MyCheckBox
            form={form}
            disabled={isViewMode}
            name={percentName}
            onChange={e =>
              handleCheckboxChange(
                e,
                setIsPercents,
                childIndex ? childIndex + index + 1 : index,
                form,
                setData
              )
            }
            label="%"
          />
        </div>
      );
    },
  },
];
