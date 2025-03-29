import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TableBasic } from '@/components/basic/table';
import { Button, Divider, Form } from 'antd';
import { ReactComponent as Import } from '@/assets/icons/ic_file-plus.svg';
import { MyFormItem } from '@/components/basic/form-item';
import {
  MultipleSelectWithoutBorder,
  SingleSelectWithoutBorder,
} from '@/components/basic/select';
import './RateSetting.less';
import InputValue from '../../input/inputValue';
import { CombinedData } from '../rate-config/type';
import InputValueString from '../../input/inputValueString';
import {
  formatNumberValueToDolla,
  handleBeforeInputRateDolla,
  removeDot,
} from '@/utils/formatInput';
import { getRateCodeByHotel } from '@/api/features/rateCode';
import { getRoomTypeByHotelId2 } from '@/api/features/roomType';
import { getPackagePlanByHotelId } from '@/api/features/packagePlan';
import { ISource } from '@/utils/formatSelectSource';
import { groupData, transformDataIsource } from '../rate-config/convertData';
import { RoomSharingImport } from '../room-sharing-import';
import { apiImportFile } from '@/api/features/rateConfig';
import {
  exportTemplateRateToExcel,
  exportTemplateToExcel,
} from '@/utils/exportExcel';
import { apiHotelList } from '@/api/features/myAllotment';
import {
  apiMarketSegmentList,
  apiRoomTypeList,
} from '@/api/features/masterData';
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
}

const RateSetting: React.FC<Iprops> = ({
  dataSource,
  forceUpdate,
  isViewMode,
  selectedHotel,
  isLoading = true,
  setIsLoading,
  isCreate,
  form,
}) => {
  const [isRateSettingValid, setIsRateSettingValid] = useState({});
  const [isNotValidValue, setIsNotValidValue] = useState<any>({});
  const [rateCode, setRateCode] = useState<any>([]);
  const [roomType, setRoomType] = useState<any>([]);
  const [packagePlan, setPackagePlan] = useState<any>([]);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [dataSourceSeacrch, setDataSourceSeacrch] = useState<any>([]);
  const [dataSourceClone, setDataSourceClone] = useState<any>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [isModalImport, setIsModalImport] = useState(false);
  const [isUpdateContentTable, setIsUpdateContentTable] = useState<boolean>(
    true
  );
  const tableRef = useRef<any>(null);
  // useEffect(() => {
  //   const tableBody = tableRef.current?.querySelector('.ant-table-body');
  //   if (tableBody) {
  //     tableBody.addEventListener('scroll', handleScroll);
  //   }

  //   return () => {
  //     if (tableBody) {
  //       tableBody.removeEventListener('scroll', handleScroll);
  //     }
  //   };
  // }, [visibleData]);
  console.log('check datasỉuce', dataSource);
  const updateRates = (object1: any, object2: any) => {
    return object2.map((item2: any) => {
      const matchedItem = object1.find((item1: any) => item1.id === item2.id);
      if (matchedItem) {
        return {
          ...item2,
          cost_rate: matchedItem.cost_rate,
          rack_rate: matchedItem.rack_rate,
          distribution_rate: matchedItem.distribution_rate,
        };
      }
      return item2;
    });
  };

  useEffect(() => {
    setDataSourceClone(dataSource);
    setIsUpdateContentTable(true);
  }, [dataSource]);
  useEffect(() => {
    if (dataSourceSeacrch.length > 0) {
      setIsLoading(false);
    }
  }, [dataSourceSeacrch]);
  // useEffect(() => {
  //   // Lấy 10 bản ghi đầu tiên
  //   setVisibleData(dataSourceSeacrch.slice(0, 10));
  // }, [dataSourceSeacrch]);
  const columns: any = [
    {
      title: 'Rate Code',
      dataIndex: 'rate_code',
      key: 'rate_code',
      align: 'center',
      render: (rateCode: any, record: any, index: number) => {
        return (
          <>
            {rateCode?.rate_code}
            <InputValue
              isHideErrorMessage={true}
              // required
              value={rateCode?.id}
              placeholder="-"
              hidden
              disabled={isViewMode}
              form={form}
              name={`rates[${index}].rate_code`}
            />
          </>
        );
      },
    },
    {
      title: 'Room Type',
      dataIndex: 'room_type',
      key: 'room_type',
      align: 'center',
      render: (roomType: any, record: any, index: number) => (
        <>
          {roomType?.name || '-'}
          <InputValue
            isHideErrorMessage={true}
            // required
            value={roomType?.id}
            placeholder="-"
            hidden
            disabled={isViewMode}
            form={form}
            name={`rates[${index}].room_type`}
          />
        </>
      ), // Hiển thị label hoặc dấu "-"
    },
    {
      title: 'Package Plan',
      dataIndex: 'package_plan',
      key: 'package_plan',
      align: 'center',
      render: (packagePlan: any, record: any, index: number) => (
        <>
          {packagePlan?.name || '-'}
          <InputValue
            isHideErrorMessage={true}
            // required
            value={packagePlan?.id}
            placeholder="-"
            hidden
            disabled={isViewMode}
            form={form}
            name={`rates[${index}].package_plan`}
          />
        </>
      ), // Hiển thị label hoặc dấu "-"
    },
    {
      title: 'Cost Rate',
      dataIndex: 'cost_rate',
      key: 'cost_rate',
      align: 'center',
      render: (cost_rate: any, record: any, index: number) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputValueString
            onChange={e => handleInputChange(e, record.id, 'cost_rate')}
            rules={[
              {
                validator: (_: any, value: any) => {
                  if (!value || value.trim() === '') {
                    // Nếu không có giá trị (chưa nhập hoặc chỉ có khoảng trắng)
                    setIsNotValidValue((prevState: any) => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`costRate_${index}`]: true,
                    }));
                    return Promise.reject();
                  } else {
                    setIsNotValidValue((prevState: any) => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`costRate_${index}`]: false,
                    }));
                  }
                  value = removeDot(value);
                  const distributionRate = removeDot(
                    form.getFieldValue(`rates[${index}].distribution_rate`)
                  );
                  if (
                    Number(value) < 0 ||
                    (distributionRate !== undefined &&
                      Number(value) > Number(distributionRate))
                  ) {
                    setIsRateSettingValid(prevState => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`costRate_${index}`]: false,
                    }));
                    return Promise
                      .reject
                      // new Error('Cost Rate must be ≥ 0 and ≤ Distribution Rate')
                      ();
                  } else {
                    setIsRateSettingValid(prevState => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`costRate_${index}`]: true,
                    }));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            isHideErrorMessage={true}
            placeholder=" "
            required
            label="cost_rate"
            value={cost_rate}
            disabled={isViewMode}
            form={form}
            name={`rates[${index}].cost_rate`}
            isFormatDolla
            handleBeforeInput={handleBeforeInputRateDolla}
          />
          <InputValue
            isHideErrorMessage={true}
            // required
            placeholder=" "
            hidden
            disabled={isViewMode}
            form={form}
            name={`rates[${index}].id`}
          />
          <InputValue
            isHideErrorMessage={true}
            placeholder=" "
            hidden
            disabled={isViewMode}
            form={form}
            name={`rates[${index}].id_rate_setting`}
          />
        </div>
      ),
    },
    {
      title: 'Rack Rate',
      dataIndex: 'rack_rate',
      key: 'rack_rate',
      align: 'center',
      render: (rack_rate: any, record: any, index: number) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InputValueString
              onChange={e => handleInputChange(e, record.id, 'rack_rate')}
              rules={[
                {
                  validator: (_: any, value: any) => {
                    if (!value || value.trim() === '') {
                      // Nếu không có giá trị (chưa nhập hoặc chỉ có khoảng trắng)
                      setIsNotValidValue((prevState: any) => ({
                        ...prevState, // Giữ lại các field hiện có
                        [`rack_rate${index}`]: true,
                      }));
                      return Promise.reject();
                    } else {
                      setIsNotValidValue((prevState: any) => ({
                        ...prevState, // Giữ lại các field hiện có
                        [`rack_rate${index}`]: false,
                      }));
                    }
                    value = removeDot(value);
                    const distributionRate = removeDot(
                      form.getFieldValue(`rates[${index}].distribution_rate`)
                    );
                    if (
                      Number(value) < 0 ||
                      (distributionRate !== undefined &&
                        Number(value) < Number(distributionRate))
                    ) {
                      setIsRateSettingValid(prevState => ({
                        ...prevState, // Giữ lại các field hiện có
                        [`rack_rate${index}`]: false,
                      }));
                      return Promise
                        .reject
                        // new Error('Cost Rate must be ≥ 0 and ≤ Distribution Rate')
                        ();
                    } else {
                      setIsRateSettingValid(prevState => ({
                        ...prevState, // Giữ lại các field hiện có
                        [`rack_rate${index}`]: true,
                      }));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              value={rack_rate}
              isFormatDolla
              handleBeforeInput={handleBeforeInputRateDolla}
              isHideErrorMessage={true}
              required
              placeholder=" "
              label="rack_rate"
              form={form}
              disabled={isViewMode}
              name={`rates[${index}].rack_rate`}
            />
          </div>
        );
      },
    },
    {
      title: 'Distribution Rate',
      dataIndex: 'distribution_rate',
      key: 'distribution_rate',
      align: 'center',
      render: (distribution_rate: any, record: any, index: number) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputValueString
            onChange={e => handleInputChange(e, record.id, 'distribution_rate')}
            isFormatDolla
            handleBeforeInput={handleBeforeInputRateDolla}
            rules={[
              {
                validator: (_: any, value: any) => {
                  if (!value || value.trim() === '') {
                    // Nếu không có giá trị (chưa nhập hoặc chỉ có khoảng trắng)
                    setIsNotValidValue((prevState: any) => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`distribution_rate${index}`]: true,
                    }));
                    return Promise.reject();
                  } else {
                    setIsNotValidValue((prevState: any) => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`distribution_rate${index}`]: false,
                    }));
                  }
                  value = removeDot(value);
                  const costRate = removeDot(
                    form.getFieldValue(`rates[${index}].cost_rate`)
                  );
                  const rackRate = removeDot(
                    form.getFieldValue(`rates[${index}].rack_rate`)
                  );
                  if (
                    Number(value) < 0 ||
                    (rackRate !== undefined &&
                      Number(value) > Number(rackRate)) ||
                    (costRate !== undefined && Number(value) < Number(costRate))
                  ) {
                    setIsRateSettingValid(prevState => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`distribution_rate${index}`]: false,
                    }));
                    return Promise
                      .reject
                      // new Error('Cost Rate must be ≥ 0 and ≤ Distribution Rate')
                      ();
                  } else {
                    setIsRateSettingValid(prevState => ({
                      ...prevState, // Giữ lại các field hiện có
                      [`distribution_rate${index}`]: true,
                    }));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            value={distribution_rate}
            isHideErrorMessage={true}
            required
            label="distribution_rate"
            placeholder=" "
            disabled={isViewMode}
            form={form}
            name={`rates[${index}].distribution_rate`}
          />
        </div>
      ),
    },
  ];
  // Hàm định dạng số
  const formatNumber = (value: number) => {
    return value.toLocaleString('de-DE'); // Sử dụng định dạng của Đức (cách 3 chữ số bằng dấu chấm)
  };

  const options = [
    {
      label: 'Active',
      value: 'published',
    },
    {
      label: 'Inactive',
      value: 'disable',
    },
  ];

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

    const fetchPackagePlanByHotelId = async () => {
      if (selectedHotel) {
        const res = await getPackagePlanByHotelId(selectedHotel);
        if (res?.data && res?.data.length > 0) {
          setPackagePlan(transformDataIsource(res.data));
        }
      }
    };
    fetchPackagePlanByHotelId();
    fetchRateCodeByHotelId();
    fetchRoomTypeByHotelId();
  }, [selectedHotel]);

  const handleOnchangeSearch = (e: any, name: string) => {
    const updatedObject2 = updateRates(
      groupData(form.getFieldsValue()).rates,
      dataSourceClone
    );
    setDataSourceClone(updatedObject2);
    setIsUpdateContentTable(true);

    setIsLoadingSearch(true);
    setSearchParams(prev => ({
      ...prev,
      [name]: e, // Cập nhật giá trị theo name
    }));
  };
  const handleScroll = () => {
    if (!tableRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      // Nếu cuộn gần cuối thì load thêm data
      // loadMoreData();
    }
  };

  // const loadMoreData = () => {
  //   const nextPage = page + 1;
  //   const newData = dataSourceSeacrch.slice(0, nextPage * PAGE_SIZE);

  //   if (newData.length !== visibleData.length) {
  //     setVisibleData(newData);
  //     setPage(nextPage);
  //   }
  // };
  const filterData = (params: Record<string, any>, data: any[]) => {
    if (1) {
      return data?.filter(item => {
        return Object.keys(params).every(key => {
          if (!params[key] || params[key].length === 0) return true; // Bỏ qua nếu không có giá trị tìm kiếm

          switch (key) {
            case 'rateCode':
              return params[key].includes(item.rate_code?.rate_code);
            case 'roomType':
              return params[key].includes(item.room_type?.code); // Sử dụng `code` thay vì `name`
            case 'packagePlan':
              return params[key].includes(item.package_plan?.code);
            case 'status':
              return params[key] === 'published'
                ? params[key] === item.rate_code?.status
                : item.rate_code?.status !== 'published';
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
    // if (!timeoutRefs.current[id]) {
    //   timeoutRefs.current[id] = {};
    // }
    // // Xóa timeout trước đó nếu cùng id và cùng field
    // if (timeoutRefs.current[id][field]) {
    //   clearTimeout(timeoutRefs.current[id][field]!);
    // }
    // // Tạo timeout mới
    // timeoutRefs.current[id][field] = setTimeout(() => {
    //   setDataSourceClone((prev: any) =>
    //     prev.map((item: any) =>
    //       item.id === id ? { ...item, [field]: value } : item
    //     )
    //   );
    // }, 300);
  };
  // const handleInputChange = (value: any, id: number, field: string) => {
  //   console.log('check value,id,field', value, id, field);
  //   setDataSourceClone((prev: any) => {
  //     console.log('check prev', prev);
  //     return prev.map((item: any) =>
  //       item.id === id ? { ...item, [field]: value } : item
  //     );
  //   });

  // setDataSourceSeacrch(newData);
  // };
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
    if (
      dataSourceSeacrch &&
      dataSourceSeacrch?.length > 0 &&
      isUpdateContentTable
    ) {
      const formattedData = dataSourceSeacrch?.map(
        (item: any, index: number) => {
          return {
            [`rates[${index}].id`]: item?.id,
            [`rates[${index}].cost_rate`]: formatMoney(item.cost_rate),
            [`rates[${index}].rack_rate`]: formatMoney(item.rack_rate),
            [`rates[${index}].distribution_rate`]: formatMoney(
              item.distribution_rate
            ),
            [`rates[${index}].id_rate_setting`]: item?.id_rate_setting,
          };
        }
      );

      // Đổ dữ liệu vào form
      form.setFields(
        formattedData.flatMap((field: any) =>
          Object.entries(field).map(([name, value]) => ({ name, value }))
        )
      );
      setIsUpdateContentTable(false);
    }
  }, [dataSourceSeacrch]);

  useEffect(() => {
    setIsRateSettingValid({});
    setIsNotValidValue({});
    setSearchParams({});
  }, [forceUpdate]);
  useEffect(() => {
    if (dataSourceClone && dataSourceClone?.length > 0 && isCreate) {
      const formattedData = dataSourceClone?.map(
        (item: any, index: number) => ({
          [`rates[${index}].rate_code`]: item?.rate_code?.id,
          [`rates[${index}].room_type`]: item?.room_type?.id,
          [`rates[${index}].package_plan`]: item?.package_plan?.id,
        })
      );
      // Đổ dữ liệu vào form
      if (formattedData && form) {
        form.setFields(
          formattedData.flatMap((field: any) =>
            Object.entries(field).map(([name, value]) => ({ name, value }))
          )
        );
      }
    }
  }, [isCreate, forceUpdate]);
  const renderTable = useMemo(() => {
    return (
      <div ref={tableRef} onScroll={handleScroll}>
        <TableBasic
          className="table-hidden-scrool-x"
          loading={isLoading || isLoadingSearch}
          dataSource={dataSourceSeacrch}
          columns={columns}
          pagination={false}
          scroll={{ y: 400 }} // Tạo thanh cuộn cho bảng
        />
      </div>
    );
  }, [dataSourceSeacrch, dataSource, columns, isLoadingSearch, isLoading]);

  const showModalImport = () => {
    setIsModalImport(true);
    // setTimeout(() => {}, 100);
  };

  const handleCancel = () => {
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
            rate_code: item?.rate_code?.rate_code,
            room_type: item?.room_type?.name,
            package_plan: item?.package_plan?.name,
            cost_rate: item?.cost_rate || 0,
            rack_rate: item?.rack_rate || 0,
            distribution_rate: item?.distribution_rate || 0,
          }))
        : [];

      const fileName = 'import_rate_template';
      const messageError = 'Không thể sửa Rate Code, Room Type, Package Plan';
      const editableColumns = [
        'Cost Rate (*)\n(Giá sàn)',
        'Rack Rate (*)\n(Giá niêm yết)',
        'Distribution Rate (*)\n(Giá phân phối)',
      ];

      const downFile = await exportTemplateRateToExcel(
        [
          {
            name: 'Rate',
            headers: [
              { key: 'no', title: 'No\n(STT)' },
              { key: 'rate_code', title: 'Rate Code (*)\n(Mã rate code)' },
              {
                key: 'room_type',
                title: 'Room Type (*)\n(Hạng phòng)',
              },
              {
                key: 'package_plan',
                title: 'Package Plan (*)\n(Package plan)',
              },
              {
                key: 'cost_rate',
                title: 'Cost Rate (*)\n(Giá sàn)',
                description:
                  'Admin:\nBắt buộc\nChỉ nhập số nguyên\ndương, ngăn cách các\nhàng bằng dấu "."',
              },
              {
                key: 'rack_rate',
                title: 'Rack Rate (*)\n(Giá niêm yết)',
                description:
                  'Admin:\nBắt buộc\nChỉ nhập số nguyên\ndương, ngăn cách các\nhàng bằng dấu "."',
              },
              {
                key: 'distribution_rate',
                title: 'Distribution Rate (*)\n(Giá phân phối)',
                description:
                  'Admin:\nBắt buộc\nChỉ nhập số nguyên\ndương, ngăn cách các\nhàng bằng dấu "."',
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

  return (
    <div className="rate-setting-wrapper">
      <div className="room-setting-header">
        <div className="import">
          <Button
            className="custom-btn"
            onClick={showModalImport}
            icon={<Import width={16} height={16} />}
            type="text"
          >
            <span className="">Import</span>
          </Button>
        </div>
        <div className="search-list">
          <MyFormItem>
            <MultipleSelectWithoutBorder
              options={rateCode}
              prefix="Rate Code:"
              onChange={(e: any) => {
                handleOnchangeSearch(e, 'rateCode');
              }}
            />
          </MyFormItem>
          <Divider type="vertical" />
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
              options={packagePlan}
              prefix="Package Plan:"
              onChange={(e: any) => {
                handleOnchangeSearch(e, 'packagePlan');
              }}
            />
          </MyFormItem>
          <Divider type="vertical" />
          <MyFormItem>
            <SingleSelectWithoutBorder
              options={options}
              prefix="Rate Code Status"
              onChange={(e: any) => {
                handleOnchangeSearch(e, 'status');
              }}
            />
          </MyFormItem>
        </div>
      </div>
      {renderTable}
      {/* <TableBasic
        loading={isLoading || isLoadingSearch}
        dataSource={visibleData}
        columns={columns}
        pagination={false}
        scroll={{ y: 400 }} // Tạo thanh cuộn cho bảng
      /> */}
      <span style={{ color: 'red', padding: '0 8px' }}>
        {!Object.values(isRateSettingValid).every(value => value === true)
          ? 'Rate must meet the condition: 0 ≤ Cost Rate ≤ Distribution Rate ≤ Rack Rate'
          : ''}
      </span>
      <div style={{ color: 'red', padding: '0 8px' }}>
        {Object.values(isNotValidValue).some(value => value === true) &&
          'Cost Rate, Rack Rate and Distribution Rate are required for Rate Setting'}
      </div>
      <RoomSharingImport
        title="Import Rate"
        visible={isModalImport}
        onOk={handleImportOk}
        onCancel={handleCancel}
        onBack={handleBack}
        apiImport={apiImportFile}
        hotelId={selectedHotel}
        setData={setDataSourceClone}
        expectedHeaders={[
          'No',
          'Rate Code',
          'Room Type',
          'Package Plan',
          'Cost Rate',
          'Rack Rate',
          'Distribution Rate',
        ]}
        onDownloadTemplate={generateExcel}
      />
    </div>
  );
};

export default RateSetting;
