import React, {
  useState,
  useEffect,
  CSSProperties,
  useRef,
  useMemo,
} from 'react';
import { MyModal } from '@/components/basic/modal';
import { MyButton } from '@/components/basic/button';
import { MyCardContent } from '@/components/basic/card-content';
import { Col, Divider, Form, message, Row } from 'antd';
import SelectBasic from '../../select/SelectBasic';
import { ReactComponent as DeleteSvg } from '@/assets/icons/ic-delete.svg';
import { MyCollapse } from '@/components/basic/collapse';
import {
  SelectPackageWithoutBorder,
  SelectRoomType,
  SelectRoomTypeWithoutBorder,
} from '../../select';
import './RoomSetting.less';
import { TableBasic } from '@/components/basic/table';
import { CollapseProps } from 'antd/lib';
import DeleteModal from '../shared-delete-confirm/SharedDeleteConfirm';
import { tableColumns } from './RoomSetting.columns';
import { ISource } from '@/utils/formatSelectSource';
import { selectMarketSegmentList } from '@/stores/slices/marketSegment.slice';
import { useSelector } from 'react-redux';
import { getUserByMarketSegmentID } from '@/api/features/roomConfig';
import { generateUniqueString } from '@/utils/common';
import { IError } from '../../booking-info/type';
import { formatMoney } from '@/utils/formatCurrentcy';

const Account: React.FC<{
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  hotelId?: any;
  hotelList?: ISource[];
  data?: any;
  isViewMode?: boolean;
  roomType: ISource[];
  roomSettingToAccount?: any;
  setRoomSettingToAccount?: any;
  setRoomSetting?: any;
}> = ({
  visible,
  onOk,
  onCancel,
  hotelId,
  isViewMode = false,
  hotelList,
  data,
  roomType,
  roomSettingToAccount,
  setRoomSetting,
  setRoomSettingToAccount,
}) => {
  const [form] = Form.useForm();
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [dataSourceSearch, setDataSourceSearch] = useState<any>([]);
  const [isUpdateContentTable, setIsUpdateContentTable] = useState<boolean>(
    true
  );
  const [isPercents, setIsPercents] = useState({});
  const [settingCheck, setSettingCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isNotValidValue, setIsNotValidValue] = useState<any>({});
  const [dataTable, setDataTable] = useState<any>([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState<ISource[]>([]);
  const [accountOptions, setAccountOptions] = useState<ISource[]>([]);
  const [errorSetting, setErrorSetting] = useState<IError[]>([]);
  const marketSegmentList = useSelector(selectMarketSegmentList);
  const [isGrouped, setIsGrouped] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchAccountByMarketSegmentID = async (id: number) => {
    if (!id) return;
    const res = await getUserByMarketSegmentID(id);
    if (res.data && res.data.length > 0) {
      const data = res.data.map((item: any) => ({
        value: item?.user?.userName,
        label: item?.user?.userName,
      }));
      setAccountOptions(data);
    }
  };

  const toggleGroup = () => {
    setIsGrouped(!isGrouped);
  };

  const handleExpand = (expanded: boolean, record: any) => {
    setExpanded(expanded);
  };

  const getGroupedDataSource = (dataSource: any[]) => {
    const groupedData: Record<string, any> = {};

    dataSource.forEach(item => {
      const key = `${item.room_type}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          id: key,
          parentId: key,
          room_type: item.room_type,
          market_segment: item.market_segment,
          children: [],
          value: null,
        };
      }
      groupedData[key].children.push(item);
    });

    Object.values(groupedData).forEach(group => {
      const isPercentValues = group.children.map(
        (child: any) => child.is_percent
      );
      const allTrue = isPercentValues.every((val: any) => val === true);
      const allFalse = isPercentValues.every((val: any) => val === false);

      const totalValue = group.children.reduce(
        (sum: number, child: any) => sum + (child.distribution_room || 0),
        0
      );

      if (allTrue) {
        group.value = `${totalValue / group.children.length} %`;
      } else if (allFalse) {
        group.value = `${totalValue / group.children.length}`;
      } else {
        group.value = '';
      }
    });
    return Object.values(groupedData);
  };

  const displayedDataSource = useMemo(() => {
    return isGrouped
      ? getGroupedDataSource(dataSourceSearch)
      : dataSourceSearch;
  }, [dataSourceSearch, isGrouped]);

  useEffect(() => {
    if (visible) {
      form.setFields([
        {
          name: 'account',
          errors: [''],
        },
      ]);
      if (data.length > 0) {
        setLoading(true);
        const roomTypeOptions = data.map((item: any) => ({
          value: item.room_type_code,
          label: item.room_type,
        }));
        setRoomTypeOptions(roomTypeOptions);
        const room_type = roomTypeOptions.map((item: any) => item.value);
        fetchAccountByMarketSegmentID(data[0].market_segment_id);
        form.setFieldsValue({
          hotelId: hotelId,
          room_type,
          market_segment: data[0].market_segment_id,
        });
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }

      if (roomSettingToAccount && roomSettingToAccount.length > 0) {
        const filteredData = roomSettingToAccount.filter((item: any) =>
          data.some(
            (d: any) =>
              d.market_segment_id === item.market_segment_id &&
              d.room_type_id === item.room_type_id
          )
        );
        setDataTable(filteredData);
      } else {
        setDataTable([]);
      }
    } else {
      form.resetFields();
      setIsGrouped(false);
      setSelectedRowKeys([]);
    }
  }, [visible]);

  const getItems: (
    panelStyle: CSSProperties
  ) => CollapseProps['items'] = panelStyle => [
    {
      key: '1',
      label: 'ACCOUNT DISTRIBUTION',
      children: (
        <div className="container-table">
          <div className="header">
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={event => {
                event.stopPropagation();
                selectedRowKeys.length > 0 && setIsModalDelete(true);
              }}
            >
              <DeleteSvg />
              <span style={{ marginLeft: '5px' }}>Delete</span>
            </div>
            <div className="search">
              <SelectRoomTypeWithoutBorder
                options={roomTypeOptions}
                maxWidth="70px"
                onChange={(e: any) => {
                  handleOnchangeSearch(e, 'roomType');
                }}
              />
              <Divider type="vertical" />
              <SelectPackageWithoutBorder
                options={accountOptions}
                label="Account:"
                maxWidth="50px"
                onChange={(e: any) => {
                  handleOnchangeSearch(e, 'account');
                }}
              />
            </div>
          </div>
          <TableBasic
            loading={isLoadingSearch}
            columns={tableColumns(
              form,
              isViewMode,
              settingCheck,
              setIsNotValidValue,
              setIsPercents,
              isPercents,
              isGrouped,
              toggleGroup,
              [],
              setDataTable,
              true
            )}
            dataSource={displayedDataSource}
            rowSelection={mainTableRowSelection}
            rowKey="id"
            expandable={{
              onExpand: handleExpand,
            }}
          />
          {/* <div style={{ color: 'red', padding: '0 8px' }}>
            {errorSetting.length > 0 &&
              'Distribution Room are required for Room Setting'}
          </div> */}
        </div>
      ),
      style: panelStyle,
      className: 'collapse-room-info',
    },
  ];

  const mainTableRowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  useEffect(() => {
    let formattedData;
    if (isGrouped) {
      formattedData = displayedDataSource?.flatMap(
        (item: any, index: number) => {
          const baseData = {};
          if (item.children && item.children.length > 0) {
            return [
              baseData,
              ...item.children.map((child: any, childIndex: number) => ({
                [`setting[${childIndex + index}].id`]: child.id,
                [`setting[${
                  childIndex + index
                }].distribution_room`]: formatMoney(child?.distribution_room),
                [`setting[${childIndex + index}].is_percent`]: child.is_percent,
              })),
            ];
          }

          return baseData;
        }
      );
    } else {
      formattedData = dataSourceSearch?.map((item: any, index: number) => ({
        [`setting[${index}].id`]: item?.id,
        [`setting[${index}].distribution_room`]: item?.distribution_room,
        [`setting[${index}].is_percent`]: item?.is_percent,
      }));
    }

    // Đổ dữ liệu vào form
    form.setFields(
      formattedData.flatMap((field: any) =>
        Object.entries(field).map(([name, value]) => ({ name, value }))
      )
    );
  }, [form, dataSourceSearch, open, isGrouped, expanded]);

  const handleOnchangeSearch = (e: any, name: string) => {
    setIsUpdateContentTable(true);

    setIsLoadingSearch(true);
    setSearchParams(prev => ({
      ...prev,
      [name]: e, // Cập nhật giá trị theo name
    }));
  };

  const filterData = (params: Record<string, any>, data: any[]) => {
    if (1) {
      return data?.filter(item => {
        return Object.keys(params).every(key => {
          if (!params[key] || params[key].length === 0) return true; // Bỏ qua nếu không có giá trị tìm kiếm

          switch (key) {
            case 'roomType':
              return params[key].includes(item.room_type_code); // Sử dụng `code` thay vì `name`
            case 'account':
              return params[key].includes(item.account);
            default:
              return true;
          }
        });
      });
    }
  };
  const timeoutRefs = useRef<Record<number, Record<string, NodeJS.Timeout>>>(
    {}
  );

  useEffect(() => {
    const dataSearch = filterData(searchParams, dataTable);
    setDataSourceSearch(dataSearch);
    const timeoutId = setTimeout(() => {
      setIsLoadingSearch(false);
    }, 300);

    // Cleanup timeout nếu searchParams hoặc dataSourceClone thay đổi trước khi 300ms kết thúc
    return () => clearTimeout(timeoutId);
  }, [searchParams, dataTable]);

  const handleDelete = () => {
    setDataSourceSearch(
      dataSourceSearch.filter((item: any) => !selectedRowKeys.includes(item.id))
    );
    setRoomSettingToAccount(
      roomSettingToAccount.filter(
        (item: any) => !selectedRowKeys.includes(item.id)
      )
    );
    message.success('Delete room package successfully!');
    setIsModalDelete(false);
  };

  const onCancelDelete = () => {
    setIsModalDelete(false);
  };

  const handleSave = async () => {
    const allFields = form.getFieldsValue();
    const fieldsToValidate = Object.keys(allFields).filter(
      field => field !== 'account'
    );
    await form.validateFields(fieldsToValidate);

    const formattedRoomSetting = Array.isArray(dataTable)
      ? dataTable
          .map((setting: any) => ({
            ...setting,
            hotel: Number(hotelId),
            room_type: setting.room_type_id,
            market_segment: setting.market_segment_id,
            distribution_room: setting.distribution_room,
            is_percent: setting.is_percent || false,
          }))
          .filter(Boolean)
      : [];
    const countMap = formattedRoomSetting.reduce((acc, setting) => {
      const key = `${setting.room_type_id}-${setting.market_segment_id}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const groupedSettings = formattedRoomSetting.reduce((acc, setting) => {
      const key = `${setting.room_type_id}-${setting.market_segment_id}`;

      if (!acc[key]) {
        acc[key] = { ...setting };
      } else if (countMap[key] > 1) {
        acc[key].distribution_room += setting.distribution_room;
        if (acc[key].is_percent !== setting.is_percent) {
          acc[key].distribution_room = '';
          acc[key].is_percent = false;
        }
      }

      return acc;
    }, {} as Record<string, any>);

    const finalRoomSettings = Object.values(groupedSettings);

    setRoomSetting?.((prevSettings: any[]) => {
      const updatedSettings = prevSettings.map(prevSetting => {
        const matchedSetting = finalRoomSettings.find(
          (setting: any) =>
            setting.room_type_id === prevSetting.room_type_id &&
            setting.market_segment_id === prevSetting.market_segment_id
        );
        return matchedSetting
          ? { ...prevSetting, ...matchedSetting }
          : prevSetting;
      });

      return [...updatedSettings];
    });
    setRoomSettingToAccount?.((prevSettings: any[]) => {
      const updatedSettings = prevSettings.map(prevSetting => {
        const matchedSetting = formattedRoomSetting.find(
          setting => setting.id === prevSetting.id
        );
        return matchedSetting
          ? { ...prevSetting, ...matchedSetting }
          : prevSetting;
      });

      const newSettings = formattedRoomSetting.filter(
        setting => !prevSettings.some(prev => prev.id === setting.id)
      );

      return [...updatedSettings, ...newSettings];
    });
    message.success('Distribute room to account successfully');
    onOk();
  };

  const handleAdd = async () => {
    const dataForm = await form.validateFields(['account', 'room_type']);
    const { account, room_type } = dataForm;

    if (!Array.isArray(account) || !Array.isArray(room_type)) {
      return;
    }

    const formattedData = account.flatMap(acc =>
      room_type.map(room => {
        const roomInfo = roomTypeOptions.find(rt => rt.value === room);
        const room_type_id = data.find(
          (item: any) => item.room_type_code === room
        ).room_type_id;

        return {
          id: generateUniqueString(),
          account: acc,
          room_type_id: room_type_id ? room_type_id : null,
          room_type_code: room,
          room_type: roomInfo ? roomInfo.label : null,
          is_percent: true,
        };
      })
    );
    setDataTable(formattedData);
    form.resetFields(['account']);
  };

  return (
    <>
      <MyModal
        width={880}
        title={'Distribute Room To Account'}
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        footer={
          <>
            <MyButton onClick={onCancel} buttonType="outline">
              Close
            </MyButton>
            {!isViewMode && <MyButton onClick={handleSave}>Save</MyButton>}
          </>
        }
      >
        <Form layout="vertical" form={form}>
          <MyCardContent style={{ marginBottom: 15 }}>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <SelectBasic
                  options={hotelList}
                  name="hotelId"
                  label="Hotel"
                  loading={loading}
                  disabled
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <SelectRoomType
                  isDisabled
                  loading={loading}
                  label="Room Type"
                  name="room_type"
                  options={roomType}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <SelectBasic
                  disabled
                  noInitValue
                  loading={loading}
                  label="Market Segment"
                  name="market_segment"
                  options={marketSegmentList}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <SelectRoomType
                  required
                  isDisabled={isViewMode}
                  form={form}
                  loading={loading}
                  label="Account"
                  name="account"
                  options={accountOptions}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <MyButton
                  style={{ float: 'right', marginTop: '5px' }}
                  onClick={handleAdd}
                  disabled={isViewMode}
                >
                  Add
                </MyButton>
              </Col>
            </Row>
          </MyCardContent>
          <MyCollapse getItems={getItems} accordion={false} activeKey={['1']} />
        </Form>
      </MyModal>
      <DeleteModal
        content="Are you sure to delete the record(s)?"
        visible={isModalDelete}
        onOk={handleDelete}
        onCancel={onCancelDelete}
      />
    </>
  );
};

export default Account;
