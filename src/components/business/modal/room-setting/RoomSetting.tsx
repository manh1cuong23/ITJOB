import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TableBasic } from '@/components/basic/table';
import { Button, Divider, Form, message } from 'antd';
import { ReactComponent as Import } from '@/assets/icons/ic_file-plus.svg';
import { ReactComponent as Change } from '@/assets/icons/ic_change_rate.svg';
import { MyFormItem } from '@/components/basic/form-item';
import { MultipleSelectWithoutBorder } from '@/components/basic/select';
import './RoomSetting.less';
import { getRateCodeByHotel } from '@/api/features/rateCode';
import { getRoomTypeByHotelId2 } from '@/api/features/roomType';
import { ISource } from '@/utils/formatSelectSource';
import { transformDataIsource } from '../rate-config/convertData';
import { RoomSharingImport } from '../room-sharing-import';
import {
  exportTemplateRateToExcel,
  exportTemplateToExcel,
} from '@/utils/exportExcel';
import { selectMarketSegmentList } from '@/stores/slices/marketSegment.slice';
import { useSelector } from 'react-redux';
import Account from './Account';
import { tableColumns } from './RoomSetting.columns';
import { apiImportFile } from '@/api/features/roomConfig';
import { IError } from '../../booking-info/type';
import { formatMoney } from '@/utils/formatCurrentcy';

interface Iprops {
  dataSource?: any;
  isViewMode?: boolean | undefined;
  forceUpdate?: number;
  form?: any;
  selectedHotel: any;
  isCreate?: boolean;
  setIsLoading?: any;
  isLoading?: boolean;
  open?: boolean;
  errorSetting: IError[];
  hotelList?: ISource[];
  roomSettingToAccount?: any;
  setRoomSettingToAccount?: any;
  setRoomSetting?: any;
}
const RoomSetting: React.FC<Iprops> = ({
  dataSource,
  roomSettingToAccount,
  forceUpdate,
  isViewMode,
  selectedHotel,
  isLoading = true,
  setIsLoading,
  isCreate,
  form,
  errorSetting,
  open,
  hotelList,
  setRoomSettingToAccount,
  setRoomSetting,
}) => {
  const [isRateSettingValid, setIsRateSettingValid] = useState({});
  const [isNotValidValue, setIsNotValidValue] = useState<any>({});
  const [rateCode, setRateCode] = useState<ISource[]>([]);
  const [roomType, setRoomType] = useState<ISource[]>([]);
  const marketSegmentList = useSelector(selectMarketSegmentList);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [dataSourceSeacrch, setDataSourceSeacrch] = useState<any>([]);
  const [dataSourceClone, setDataSourceClone] = useState<any>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [isModalImport, setIsModalImport] = useState(false);
  const [isModalAccount, setIsModalAccount] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isUpdateContentTable, setIsUpdateContentTable] = useState<boolean>(
    true
  );
  const [isPercents, setIsPercents] = useState({});
  const [settingCheck, setSettingCheck] = useState<boolean>(false);
  const [isGrouped, setIsGrouped] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    console.log(dataSource);
    setDataSourceClone(dataSource);
    setIsUpdateContentTable(true);
  }, [dataSource]);

  useEffect(() => {
    let formattedData;
    if (isGrouped) {
      formattedData = displayedDataSource?.flatMap(
        (item: any, index: number) => {
          const baseData = {};
          if (item.children && item.children.length > 0) {
            return [
              baseData,
              ...item.children.map((child: any, childIndex: number) => {
                return {
                  [`setting[${childIndex + index}].id`]: child.id,
                  [`setting[${
                    childIndex + index
                  }].distribution_room`]: formatMoney(child?.distribution_room),
                  [`setting[${
                    childIndex + index
                  }].is_percent`]: child.is_percent,
                };
              }),
            ];
          }

          return baseData;
        }
      );
    } else {
      formattedData = dataSourceSeacrch?.map((item: any, index: number) => {
        return {
          [`setting[${index}].id`]: item?.id,
          [`setting[${index}].distribution_room`]: formatMoney(
            item?.distribution_room
          ),
          [`setting[${index}].is_percent`]: item?.is_percent,
        };
      });
    }
    // Đổ dữ liệu vào form
    form.setFields(
      formattedData.flatMap((field: any) =>
        Object.entries(field).map(([name, value]) => ({ name, value }))
      )
    );
  }, [form, dataSourceSeacrch, open, isGrouped, expanded]);

  useEffect(() => {
    if (!open) {
      setSelectedRowKeys([]);
      setIsGrouped(false);
    }
  }, [open]);

  useEffect(() => {
    if (dataSourceSeacrch && dataSourceSeacrch.length > 0) {
      setIsLoading(false);
    }
  }, [dataSourceSeacrch]);

  const mainTableRowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
      let newSelectedKeys = new Set(selectedKeys);

      selectedRows.forEach(row => {
        if (row.children) {
          row.children.forEach((child: any) => {
            newSelectedKeys.add(child.id);
          });
        }
      });

      setSelectedRowKeys(Array.from(newSelectedKeys));
    },
  };

  // fetch data for search
  useEffect(() => {
    const fetchRateCodeByHotelId = async () => {
      if (selectedHotel) {
        const res = await getRateCodeByHotel(selectedHotel);
        if (res?.data && res?.data.length > 0) {
          setRateCode(transformDataIsource(res.data));
        }
      }
    };
    const fetchRoomTypeByHotelId = async () => {
      if (selectedHotel) {
        const res = await getRoomTypeByHotelId2(selectedHotel);
        if (res?.data && res?.data.length > 0) {
          setRoomType(transformDataIsource(res.data));
        }
      }
    };

    fetchRateCodeByHotelId();
    fetchRoomTypeByHotelId();
  }, [selectedHotel]);

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
            case 'marketSegment':
              return params[key].includes(item.market_segment_id);
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

  const handleInputChange = (value: any, id: number, field: string) => {
    // Nếu chưa có id trong timeoutRefs, khởi tạo object rỗng
    if (!timeoutRefs.current[id]) {
      timeoutRefs.current[id] = {};
    }
    // Xóa timeout trước đó nếu cùng id và cùng field
    if (timeoutRefs.current[id][field]) {
      clearTimeout(timeoutRefs.current[id][field]!);
    }
    // Tạo timeout mới
    timeoutRefs.current[id][field] = setTimeout(() => {
      setDataSourceClone((prev: any) =>
        prev.map((item: any) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    }, 300);
  };

  useEffect(() => {
    const dataSearch = filterData(searchParams, dataSourceClone);
    setDataSourceSeacrch(dataSearch);
    const timeoutId = setTimeout(() => {
      setIsLoadingSearch(false);
    }, 300);

    // Cleanup timeout nếu searchParams hoặc dataSourceClone thay đổi trước khi 300ms kết thúc
    return () => clearTimeout(timeoutId);
  }, [searchParams, dataSourceClone]);

  useEffect(() => {
    setIsRateSettingValid({});
    setIsNotValidValue({});
    setSearchParams({});
  }, [forceUpdate]);

  const showModalImport = () => {
    setIsModalImport(true);
    // setTimeout(() => {}, 100);
  };

  const handleCheck = (e: any) => {
    setSettingCheck(e);
  };

  const showModalAccount = () => {
    if (selectedRowKeys.length > 0) {
      const selectedItems = dataSourceSeacrch.filter((item: any) =>
        selectedRowKeys.includes(item.id)
      );
      const uniqueMarketSegments = new Set(
        selectedItems.map((item: any) => item.market_segment_id)
      );

      if (uniqueMarketSegments.size === 1) {
        setIsModalAccount(true);
      } else {
        message.error(
          'Rooms can only be distributed within the same Market Segment'
        );
      }
    }
  };

  const toggleGroup = () => {
    setIsGrouped(!isGrouped);
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
      ? getGroupedDataSource(dataSourceSeacrch)
      : dataSourceSeacrch;
  }, [dataSourceSeacrch, isGrouped]);

  const handleAccountOk = () => {
    setIsModalAccount(false);
  };

  const handleCancel = () => {
    setIsModalAccount(false);
    setIsModalImport(false);
  };
  const handleImportOk = () => {
    setIsModalImport(false);
  };

  const handleBack = () => {
    setIsModalImport(false);
  };

  const generateExcel = async () => {
    try {
      const data = Array.isArray(dataSourceSeacrch)
        ? dataSourceSeacrch.map((item, index) => ({
            no: index + 1,
            market_segment: item?.market_segment,
            room_type: item?.room_type,
            distribution_room: item?.distribution_room || 0,
          }))
        : [];

      const fileName = 'import_room_template';
      const messageError = 'Không thể sửa Room Type, Market Segment';
      const editableColumns = ['Distribution Room (*)\n(Phân phối phòng)'];
      const downFile = await exportTemplateRateToExcel(
        [
          {
            name: 'Room',
            headers: [
              { key: 'no', title: 'No\n(STT)' },
              {
                key: 'room_type',
                title: 'Room Type (*)\n(Hạng phòng)',
              },
              {
                key: 'market_segment',
                title: 'Market Segment (*)\n(Market Segment)',
              },
              {
                key: 'distribution_room',
                title: 'Distribution Room (*)\n(Phân phối phòng)',
                description:
                  'Admin:\nBắt buộc\nNhập xx,xx %: Nếu phân phối phòng theo phần trăm\nNhập xx hoặc xx,0: Nếu phân phối phòng theo số lượng\nTrong đó: x là số nguyên từ 0-9',
              },
            ],
            data: data,
          },
        ],
        fileName,
        editableColumns,
        messageError
      );

      return downFile;
    } catch (error) {
      console.error('Lỗi khi tạo file Excel:', error);
    }
  };

  const handleExpand = (expanded: boolean, record: any) => {
    setExpanded(expanded);
  };

  return (
    <div className="rate-setting-wrapper">
      <div className="room-setting-header">
        <div className="import">
          <Button
            className="custom-btn"
            disabled={isViewMode}
            onClick={showModalImport}
            icon={<Import width={16} height={16} />}
            type="text"
          >
            <span className="">Import</span>
          </Button>
          <Divider type="vertical" />
          <Button
            className="custom-btn"
            onClick={showModalAccount}
            icon={<Change width={16} height={16} />}
            type="text"
          >
            <span className="">Account</span>
          </Button>
        </div>
        <div className="search-list">
          <MyFormItem>
            <MultipleSelectWithoutBorder
              options={roomType}
              prefix="Room Type:"
              onChange={(e: any) => {
                handleOnchangeSearch(e, 'roomType');
              }}
            />
          </MyFormItem>
          <Divider type="vertical" />
          <MyFormItem>
            <MultipleSelectWithoutBorder
              options={marketSegmentList}
              prefix="Market Segment:"
              onChange={(e: any) => {
                handleOnchangeSearch(e, 'marketSegment');
              }}
            />
          </MyFormItem>
        </div>
      </div>
      <TableBasic
        loading={isLoading || isLoadingSearch}
        dataSource={displayedDataSource}
        columns={tableColumns(
          form,
          isViewMode,
          settingCheck,
          setIsNotValidValue,
          setIsPercents,
          isPercents,
          isGrouped,
          toggleGroup,
          errorSetting,
          setRoomSetting
        )}
        rowSelection={mainTableRowSelection}
        rowKey="id"
        expandable={{
          onExpand: handleExpand,
        }}
      />
      <div style={{ color: 'red', padding: '0 8px' }}>
        {errorSetting.length > 0 &&
          'Distribution Room are required for Room Setting'}
      </div>
      <RoomSharingImport
        title="Import Room"
        visible={isModalImport}
        onOk={handleImportOk}
        onCancel={handleCancel}
        onBack={handleBack}
        apiImport={apiImportFile}
        hotelId={selectedHotel}
        setData={setDataSourceClone}
        isRoomConfig
        expectedHeaders={[
          'No',
          'Room Type',
          'Market Segment',
          'Distribution Room',
        ]}
        onDownloadTemplate={generateExcel}
      />
      <Account
        visible={isModalAccount}
        onOk={handleAccountOk}
        onCancel={handleCancel}
        isViewMode={isViewMode}
        roomType={roomType}
        hotelId={selectedHotel}
        hotelList={hotelList}
        data={dataSourceSeacrch.filter((item: any) =>
          selectedRowKeys.includes(item.id)
        )}
        roomSettingToAccount={roomSettingToAccount}
        setRoomSetting={setRoomSetting}
        setRoomSettingToAccount={setRoomSettingToAccount}
      />
    </div>
  );
};

export default RoomSetting;
