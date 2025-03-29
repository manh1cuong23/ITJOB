import React, { useState, useEffect, CSSProperties } from 'react';
import { MyButton } from '@/components/basic/button';
import { MyCardContent } from '@/components/basic/card-content';
import { ReactComponent as DeleteSvg } from '@/assets/icons/ic-delete.svg';
import { MyModal } from '@/components/basic/modal';
import { Col, CollapseProps, Divider, Form, message, Row } from 'antd';
import {
  MultiSelectBasic,
  SelectPackageWithoutBorder,
  SelectRoomTypeWithoutBorder,
} from '../../select';
import { ISource } from '@/utils/formatSelectSource';
import DatePickerSingle from '../../date-picker/DatePickerSingle';
import SelectBasic from '../../select/SelectBasic';
import { MyCollapse } from '@/components/basic/collapse';
import { BOOKING_STATUS } from '@/constants/booking';
import './ChangeRate.less';
import { TableBasic } from '@/components/basic/table';
import { columns } from './ChangeRate.columns';
import InputAdjustRate from '@/components/basic/adjust-rate/InputAdjustRate';
import { getMarketSegmentByHotelId } from '@/api/features/marketSegment';
import { apiRateCodeSearch } from '@/api/features/rateCode';
import { getPackagePlanByHotelId } from '@/api/features/packagePlan';
import { generateUniqueString } from '@/utils/common';
import DeleteModal from '../shared-delete-confirm/SharedDeleteConfirm';
import { apiChangeRate } from '@/api/features/roomRate';

const ChangeRate: React.FC<{
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  title?: string;
  hotelList: ISource[];
  hotelId?: number;
  arrDeptDate?: [string, string] | null;
}> = ({ visible, onOk, onCancel, title, hotelList, hotelId, arrDeptDate }) => {
  const [form] = Form.useForm();

  const [mainTableSelectedRowKeys, setMainTableSelectedRowKeys] = useState<
    React.Key[]
  >([]);
  const [marketSegmentList, setMarketSegmentList] = useState<ISource[]>([]);
  const [rateCodeList, setRateCodeList] = useState<ISource[]>([]);
  const [roomTypeList, setRoomTypeList] = useState<ISource[]>([]);
  const [packagePlanList, setPackagePlanList] = useState<ISource[]>([]);
  const [dataTable, setDataTable] = useState<any>([]);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [selectedMarketSegment, setSelectedMarketSegment] = useState<any>([]);
  const [selectedRateCode, setSelectedRateCode] = useState<any>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<any>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>([]);
  const [filteredDataTable, setFilteredDataTable] = useState<any>([]);

  const mainTableRowSelection = {
    selectedRowKeys: mainTableSelectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setMainTableSelectedRowKeys(selectedRowKeys);
    },
  };

  useEffect(() => {
    const filteredData = dataTable.filter((item: any) => {
      const isMarketSegmentMatch =
        selectedMarketSegment.length === 0 ||
        selectedMarketSegment.includes(item.marketSegmentId);
      const isRateCodeMatch =
        selectedRateCode.length === 0 ||
        selectedRateCode.includes(item.rateCodeId);
      const isRoomTypeMatch =
        selectedRoomType.length === 0 ||
        selectedRoomType.includes(item.roomTypeId);
      const isPackageMatch =
        selectedPackage.length === 0 ||
        selectedPackage.includes(item.packagePlanId);

      return (
        isMarketSegmentMatch &&
        isRateCodeMatch &&
        isRoomTypeMatch &&
        isPackageMatch
      );
    });

    setFilteredDataTable(filteredData);
  }, [
    selectedMarketSegment,
    selectedRateCode,
    selectedRoomType,
    selectedPackage,
    dataTable,
  ]);

  useEffect(() => {
    const featMarketSegment = async () => {
      if (!hotelId) return;
      try {
        const marketSegmentRes = await getMarketSegmentByHotelId(
          String(hotelId)
        );
        if (marketSegmentRes && marketSegmentRes.data.length > 0) {
          const data: ISource[] = marketSegmentRes.data.map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
          setMarketSegmentList(data);
        } else {
          setMarketSegmentList([]);
        }
      } catch (error) {
        console.error('Error fetching hotel list:', error);
      }
    };

    const featPackagePlan = async () => {
      if (!hotelId) return;
      try {
        const res = await getPackagePlanByHotelId(String(hotelId));
        if (res && res.data.length > 0) {
          const data: ISource[] = res.data.map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
          setPackagePlanList(data);
        } else {
          setPackagePlanList([]);
        }
      } catch (error) {
        console.error('Error fetching hotel list:', error);
      }
    };

    featPackagePlan();
    featMarketSegment();
  }, [hotelId]);

  useEffect(() => {
    if (hotelId && marketSegmentList.length > 0) {
      const marketSegments = marketSegmentList
        .map(item => item.value)
        .join(',');
      const initialSearchField: API.searchObj[] = [
        {
          key: 'hotelId',
          value: hotelId,
        },
        {
          key: 'market_segment',
          value: marketSegments,
        },
      ];
      const obj = {
        searchFields: initialSearchField,
        pagination: {
          pageNum: 15,
          pageSize: 1,
        },
      };

      const featRaceCode = async (SearchField: any) => {
        if (!hotelId) return;
        try {
          const res = await apiRateCodeSearch(SearchField, true);
          if (res && res.result.data.length > 0) {
            const rateCodes: ISource[] = res.result.data.map((item: any) => ({
              label: item.rate_code,
              value: item.id,
            }));
            const roomTypes: ISource[] = res.result.data.flatMap((item: any) =>
              item?.room_Type.map((room: any) => ({
                value: room?.room_type_id?.id,
                label: room?.room_type_id?.name,
              }))
            );
            const uniqueRoomTypes = Array.from(
              new Map(roomTypes.map(item => [item.value, item])).values()
            );

            setRateCodeList(rateCodes);
            setRoomTypeList(uniqueRoomTypes);
          } else {
            setRateCodeList([]);
            setRoomTypeList([]);
          }
        } catch (error) {
          console.error('Error fetching hotel list:', error);
        }
      };
      featRaceCode(obj);
    }
  }, [marketSegmentList]);

  useEffect(() => {
    if (visible) {
      form.setFields([
        {
          name: 'package',
          errors: [''],
        },
        {
          name: 'adjustRate',
          errors: [''],
        },
        {
          name: 'from_to_date',
          errors: [''],
        },
        {
          name: 'marketSegment',
          errors: [''],
        },
        {
          name: 'rateCode',
          errors: [''],
        },
        {
          name: 'roomType',
          errors: [''],
        },
      ]);
      form.setFieldsValue({
        hotelId: hotelId,
        occupancy_0_is_increase: true,
        is_percent: true,
        from_to_date:
          arrDeptDate && arrDeptDate.length >= 2
            ? arrDeptDate.some(
                date =>
                  new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))
              )
              ? null
              : [arrDeptDate[0], arrDeptDate[1]]
            : null,
      });
    } else {
      form.resetFields();
      setDataTable([]);
    }
  }, [visible]);

  const handleAdd = async () => {
    try {
      const dataForm = await form.validateFields();

      const marketSegments = dataForm.marketSegment || [];
      const rateCodes = dataForm.rateCode || [];
      const roomTypes = dataForm.roomType || [];
      const packages = dataForm.package || [];

      let newData: any[] = [];

      marketSegments.forEach((marketSegmentId: number) => {
        rateCodes.forEach((rateCodeId: number) => {
          roomTypes.forEach((roomTypeId: number) => {
            packages.forEach((packagePlanId: number) => {
              newData.push({
                No: generateUniqueString(),
                marketSegmentId,
                marketSegment:
                  marketSegmentList.find(item => item.value === marketSegmentId)
                    ?.label || '',
                rateCodeId,
                rateCode:
                  rateCodeList.find(item => item.value === rateCodeId)?.label ||
                  '',
                roomTypeId,
                roomType:
                  roomTypeList.find(item => item.value === roomTypeId)?.label ||
                  '',
                packagePlanId,
                packagePlan:
                  packagePlanList.find(item => item.value === packagePlanId)
                    ?.label || '',
              });
            });

            if (packages.length === 0) {
              newData.push({
                No: generateUniqueString(),
                marketSegmentId,
                marketSegment:
                  marketSegmentList.find(item => item.value === marketSegmentId)
                    ?.label || '',
                rateCodeId,
                rateCode:
                  rateCodeList.find(item => item.value === rateCodeId)?.label ||
                  '',
                roomTypeId,
                roomType:
                  roomTypeList.find(item => item.value === roomTypeId)?.label ||
                  '',
              });
            }
          });

          if (roomTypes.length === 0) {
            newData.push({
              No: generateUniqueString(),
              marketSegmentId,
              marketSegment:
                marketSegmentList.find(item => item.value === marketSegmentId)
                  ?.label || '',
              rateCodeId,
              rateCode:
                rateCodeList.find(item => item.value === rateCodeId)?.label ||
                '',
            });
          }
        });

        if (rateCodes.length === 0) {
          newData.push({
            No: generateUniqueString(),
            marketSegmentId,
            marketSegment:
              marketSegmentList.find(item => item.value === marketSegmentId)
                ?.label || '',
          });
        }
      });

      setDataTable((prevData: any) => {
        const updatedData = [...prevData];

        newData.forEach(newItem => {
          const existingIndex = updatedData.findIndex(
            item =>
              item.marketSegmentId === newItem.marketSegmentId &&
              item.rateCodeId === newItem.rateCodeId &&
              item.roomTypeId === newItem.roomTypeId &&
              item.packagePlanId === newItem.packagePlanId
          );

          if (existingIndex !== -1) {
            updatedData[existingIndex] = {
              ...updatedData[existingIndex],
              ...newItem,
            };
          } else {
            updatedData.push(newItem);
          }
        });

        return updatedData;
      });
      form.resetFields(['package', 'rateCode', 'roomType', 'marketSegment']);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const getItems: (
    panelStyle: CSSProperties
  ) => CollapseProps['items'] = panelStyle => [
    {
      key: '1',
      label: 'RATE INFORMATION',
      children: (
        <>
          <div className="container-form">
            <Form layout="vertical" form={form}>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <MultiSelectBasic
                    required
                    form={form}
                    options={marketSegmentList}
                    name="marketSegment"
                    label="Market Segment"
                    maxTagCount={4}
                    maxWidth="333px"
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <MultiSelectBasic
                    required
                    form={form}
                    options={rateCodeList}
                    name="rateCode"
                    label="Rate Code"
                    maxTagCount={4}
                    maxWidth="333px"
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <MultiSelectBasic
                    required
                    form={form}
                    options={roomTypeList}
                    name="roomType"
                    label="Room Type"
                    maxWidth="333px"
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <MultiSelectBasic
                    required
                    form={form}
                    options={packagePlanList}
                    name="package"
                    label="Package"
                    maxWidth="333px"
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <MyButton
                    style={{ float: 'right', marginTop: '5px' }}
                    onClick={handleAdd}
                  >
                    Add
                  </MyButton>
                </Col>
              </Row>
            </Form>
          </div>

          <div className="container-table">
            <div className="header">
              <span>Applicable to the following object(s)</span>
              <div className="action">
                <div
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={event => {
                    event.stopPropagation();
                    mainTableSelectedRowKeys.length > 0 &&
                      setIsModalDelete(true);
                  }}
                >
                  <DeleteSvg />
                  <span style={{ marginLeft: '5px' }}>Delete</span>
                </div>
                <div className="search">
                  <SelectPackageWithoutBorder
                    options={marketSegmentList}
                    name="marketSegment"
                    label="Market Segment:"
                    maxWidth="50px"
                    onChange={setSelectedMarketSegment}
                  />
                  <Divider type="vertical" />
                  <SelectPackageWithoutBorder
                    options={rateCodeList}
                    name="rateCode"
                    label="Rate Code:"
                    maxWidth="50px"
                    onChange={setSelectedRateCode}
                  />
                  <Divider type="vertical" />
                  <SelectRoomTypeWithoutBorder
                    options={roomTypeList}
                    maxWidth="70px"
                    onChange={setSelectedRoomType}
                  />
                  <Divider type="vertical" />
                  <SelectPackageWithoutBorder
                    options={packagePlanList}
                    label="Package Plan:"
                    maxWidth="50px"
                    onChange={setSelectedPackage}
                  />
                </div>
              </div>
            </div>
            <TableBasic
              columns={columns}
              dataSource={filteredDataTable}
              rowSelection={mainTableRowSelection}
              rowKey="No"
            />
          </div>
        </>
      ),
      style: panelStyle,
      className: 'collapse-room-info',
    },
  ];

  const handleDelete = () => {
    setDataTable(
      dataTable.filter(
        (item: any) => !mainTableSelectedRowKeys.includes(item.No)
      )
    );
    message.success('Delete room package successfully!');
    setIsModalDelete(false);
  };

  const onCancelDelete = () => {
    setIsModalDelete(false);
  };

  const handleSave = async () => {
    if (
      dataTable.length > 0 &&
      hotelId &&
      arrDeptDate &&
      arrDeptDate.length === 2
    ) {
      const dataForm = await form.validateFields([
        'occupancy_0_is_increase',
        'adjust_rate',
        'is_percent',
      ]);
      const MarketSegmentIds = [
        ...new Set(dataTable.map((item: any) => item.marketSegmentId)),
      ];
      const UserName = localStorage.getItem('username');
      const RateCodeIds = [
        ...new Set(dataTable.map((item: any) => item.rateCodeId)),
      ];
      const RoomTypeIds = [
        ...new Set(dataTable.map((item: any) => item.roomTypeId)),
      ];
      const PackagePlanIds = [
        ...new Set(dataTable.map((item: any) => item.packagePlanId)),
      ];

      const formatData = {
        HotelId: hotelId,
        FromDate: arrDeptDate[0],
        ToDate: arrDeptDate[1],
        MarketSegmentIds,
        RateCodeIds,
        RoomTypeIds,
        PackagePlanIds,
        IsIncrease: dataForm.occupancy_0_is_increase
          ? dataForm.occupancy_0_is_increase
          : true,
        IsPercent: dataForm.is_percent ? dataForm.is_percent : false,
        Value: Number(dataForm.adjust_rate),
        UserName,
      };
      const res = await apiChangeRate(formatData);
      if (res && res.status === 'success') {
        message.success('Change rate successfully');
        onOk();
      }
    }
  };

  return (
    <>
      <MyModal
        title={title || 'Change Rate'}
        width={880}
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        centered
        footer={
          <>
            <MyButton onClick={onCancel} buttonType="outline">
              Close
            </MyButton>
            <MyButton onClick={handleSave}>Save</MyButton>
          </>
        }
      >
        <MyCardContent style={{ marginBottom: 15 }}>
          <Form layout="vertical" form={form}>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <SelectBasic
                  required
                  options={hotelList}
                  name="hotelId"
                  label="Hotel"
                  disabled
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <DatePickerSingle
                  showValue={false}
                  required
                  // dateDisabled={arrDeptDate}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <InputAdjustRate
                  name="adjustRate"
                  form={form}
                  required
                  isShowLabel
                  isHideErrorMessage={false}
                />
              </Col>
            </Row>
          </Form>
        </MyCardContent>
        <MyCollapse getItems={getItems} accordion={false} activeKey={['1']} />
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

export default ChangeRate;
