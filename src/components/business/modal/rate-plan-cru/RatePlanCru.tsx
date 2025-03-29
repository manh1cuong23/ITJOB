import React, { useEffect, useMemo, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { MyCardContent } from '@/components/basic/card-content';
import { Row, Col, Form, Button, Divider, message } from 'antd';
import { MyModal } from '@/components/basic/modal';
import SelectBasic from '../../select/SelectBasic';
import './RatePlanCru.less';
import DatePickerSingle from '../../date-picker/DatePickerSingle';
import { TableBasic } from '@/components/basic/table';
import { ReactComponent as AdjustSvg } from '@/assets/icons/ic_change_rate.svg';
import { ReactComponent as EyeSvg } from '@/assets/icons/ic_eye_green.svg';
import { MyFormItem } from '@/components/basic/form-item';
import { DatepickerFromToWithoutborder } from '../../date-picker';
import { MultipleSelectWithoutBorder } from '@/components/basic/select';
import OverviewPersonalWithoutStatus from './OverviewPersonalWithoutStatus';
import AdjustRateModal from './adjust-rate/AdjustRate';
import RateActivityLog from './rate-activity-log/RateActivityLog';
import { ISource } from '@/utils/formatSelectSource';
import {
  apiRateCodeList,
  createRatePlan,
  getRatePlanByRateCodeID,
  ratePlanApply,
  updateRatePlan,
  viewRatePlan,
} from '@/api/features/ratePlan';
import { formatDateTable } from '@/utils/formatDate';
import { apiPackageList } from '@/api/features/myAllotment';
import { getRoomTypeByHotelID } from '@/api/features/roomType';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
interface RatePlan {
  from_date: string; // hoặc Date nếu API trả về kiểu Date
  to_date: string;
}

const RatePlanCru: React.FC<{
  id?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish?: () => void;
  onCancel?: () => void;
  title: string;
  isViewMode?: boolean;
  switchEditMode?: () => void;
  isShowOverView?: boolean;
  sourcePopup: 'main' | 'sharing' | 'master';
  hotelList: ISource[];
  marketSegmentList: ISource[];
  hotelId?: number;
}> = ({
  id,
  open,
  onFinish,
  onCancel,
  title,
  setOpen,
  isViewMode = false,
  switchEditMode,
  isShowOverView = true,
  hotelList = [],
  marketSegmentList = [],
  hotelId,
}) => {
  dayjs.extend(isSameOrAfter);
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState('');
  const [identityNo, setIdentityNo] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [rateActLogOpen, setRateActLogOpen] = useState(false);
  const [parentModalState, setParentModalState] = useState(false);
  const [dataTableRoomRate, setDataTableRoomRate] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<string>();
  const [selectedRateCode, setSelectedRateCode] = useState<string>();
  const [packageList, setPackageList] = useState<ISource[]>([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState<ISource[]>([]);
  const [rateCodeList, setRateCodeList] = useState<ISource[]>([]);
  const [fromTo, setFromTo] = useState<[string, string] | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<any>([]);
  const [selectedPackagePlan, setSelectedPackagePlan] = useState<any>([]);
  const [dataRateActLog, setDataRateActLog] = useState<any>([]);
  const [selectedMarketsegment, setSelectedMarketsegment] = useState<any>([]);
  const [dateDisabled, setDateDisabled] = useState<Array<
    [string, string]
  > | null>(null);

  useEffect(() => {
    if (open) {
      if (!id) {
        setLoading(true);
        form.setFieldsValue({ hotelId: hotelId });
        setSelectedHotel(String(hotelId));
        setParentModalState(true);
      }
    } else {
      form.resetFields();
      setRateCodeList([]);
      setDataTableRoomRate([]);
      setSelectedRateCode('');
    }
  }, [open]);

  const handleChange = (e: any) => {
    setSelectedValue(e.target.value);
  };

  const filteredRoomRates = useMemo(() => {
    if (!dataTableRoomRate || !Array.isArray(dataTableRoomRate)) return [];

    return dataTableRoomRate.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = fromTo?.[0] ? new Date(fromTo[0]) : null;
      const endDate = fromTo?.[1] ? new Date(fromTo[1]) : null;

      const isDateValid =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);

      const isRoomTypeValid =
        !selectedRoomType?.length ||
        selectedRoomType.includes(item.roomTypeCode);

      const isPackagePlanValid =
        !selectedPackagePlan?.length ||
        selectedPackagePlan.includes(item.packagePlanCode);

      return isDateValid && isRoomTypeValid && isPackagePlanValid;
    });
  }, [dataTableRoomRate, fromTo, selectedRoomType, selectedPackagePlan]);

  useEffect(() => {
    const featPackageList = async () => {
      if (!selectedHotel) return;
      try {
        const res = await apiPackageList(selectedHotel);
        const packages = res.data.map((item: any) => ({
          label: item.name,
          value: item.code,
        }));
        setPackageList(packages);
      } catch (error) {
        console.error('Error fetching guest info:', error);
      }
    };

    const featRateCodeList = async () => {
      if (!selectedHotel) return;
      try {
        const res = await apiRateCodeList(selectedHotel);
        const rateCodes = res.data.map((item: any) => ({
          label: item.rate_code,
          value: item.id,
          marketSegmentId: item.market_segment,
        }));
        setRateCodeList(rateCodes);
      } catch (error) {
        console.error('Error fetching guest info:', error);
      }
    };

    const fetchRoomTypeByHotelId = async () => {
      if (!selectedHotel) return;
      try {
        const roomTypeList = await getRoomTypeByHotelID(selectedHotel);
        if (roomTypeList && roomTypeList.data.length > 0) {
          const data: ISource[] = roomTypeList.data.map((item: any) => ({
            label: item.name,
            value: item.code,
            code: item.code,
          }));
          setRoomTypeOptions(data);
        }
      } catch (error) {
        console.error('Error fetching hotel list:', error);
      }
    };
    if (selectedHotel && !isViewMode) {
      fetchRoomTypeByHotelId();
      featPackageList();
      featRateCodeList();
    }
  }, [selectedHotel, open]);

  const fetchById = async (id: string | undefined) => {
    if (!id) return;
    // resetForm();
    try {
      setLoading(true);
      const dataRatePlan = await viewRatePlan(id.toString());
      const roomTypeIds =
        dataRatePlan?.data?.room_Type?.map(
          (roomTypeItem: any) => roomTypeItem?.room_type_id?.id
        ) || [];
      if (dataRatePlan) {
        const formatData = {
          hotelId: dataRatePlan?.data?.hotel?.id,
          market_segment: dataRatePlan?.data?.market_segment?.id,
          rate_code: dataRatePlan?.data?.rate_code?.id,
          from_to_date: [
            dataRatePlan?.data?.from_date,
            dataRatePlan?.data?.to_date,
          ],
          'from-to': [
            dataRatePlan?.data?.from_date,
            dataRatePlan?.data?.to_date,
          ],
          createdAt: dataRatePlan?.data?.created_date,
          modifiedAt: dataRatePlan?.data?.modified_date,
          createdBy: dataRatePlan?.data?.user_created,
          modifiedBy: dataRatePlan?.data?.user_modified,
        };
        setDateRange([
          dataRatePlan?.data?.from_date,
          dataRatePlan?.data?.to_date,
        ]);
        setSelectedHotel(dataRatePlan?.data?.hotel?.id);
        const dataTablePackage = dataRatePlan.data.room_rate_detail.map(
          (item: any) => ({
            id: item?.id,
            date: dayjs(item?.date).format('YYYY-MM-DD'),
            roomType: item?.room_type?.name,
            roomTypeCode: item?.room_type?.code,
            packagePlan: item?.package_plan?.name,
            packagePlanCode: item?.package_plan?.code,
            configuredRate: item?.configured_rate,
            rateOverride: item?.rate_override,
            adjustedRate: item?.adjust_rate,
            rateCurrent: item?.rate,
            rate: item?.rate,
            rate_activity_log: item?.rate_activity_log,
          })
        );
        const roomTypeSet = new Set();
        const roomTypeOptions = dataRatePlan.data.room_rate_detail.reduce(
          (acc: any[], item: any) => {
            const code = item?.room_type?.code;
            if (code && !roomTypeSet.has(code)) {
              roomTypeSet.add(code);
              acc.push({
                label: item?.room_type?.name,
                value: code,
              });
            }
            return acc;
          },
          []
        );

        const packagePlanSet = new Set();
        const packagePlanOptions = dataRatePlan.data.room_rate_detail.reduce(
          (acc: any[], item: any) => {
            const code = item?.package_plan?.code;
            if (code && !packagePlanSet.has(code)) {
              packagePlanSet.add(code);
              acc.push({
                label: item?.package_plan?.name,
                value: code,
              });
            }
            return acc;
          },
          []
        );
        const rateCodeOptions = dataRatePlan.data?.rate_code
          ? [
              {
                label: dataRatePlan.data.rate_code.rate_code,
                value: dataRatePlan.data.rate_code.id,
              },
            ]
          : [];
        setRateCodeList(rateCodeOptions);
        setRoomTypeOptions(roomTypeOptions);
        setPackageList(packagePlanOptions);
        setDataTableRoomRate(dataTablePackage);
        setTimeout(() => {
          form.setFieldsValue(formatData);
          setLoading(false);
        }, 300);
      }
    } catch (error) {
      console.error('Error fetching guest info:', error);
    }
  };
  useEffect(() => {
    if (open && id) {
      fetchById(id);
    }
  }, [open, id]);

  useEffect(() => {
    if (rateCodeList.length > 0) {
      setLoading(true);
      setSelectedRateCode(rateCodeList[0]?.value);
      form.setFieldsValue({ rate_code: rateCodeList[0]?.value });
    }
  }, [rateCodeList]);

  const fetchRatePlanByRateCodeID = async (id: any) => {
    const res = await getRatePlanByRateCodeID(id);
    if (res && Array.isArray(res.data)) {
      const formattedDates = res.data.map(
        ({ from_date, to_date }: RatePlan) => [
          dayjs(from_date).format('YYYY-MM-DD'),
          dayjs(to_date).format('YYYY-MM-DD'),
        ]
      );
      setDateDisabled(formattedDates);
    }
  };

  useEffect(() => {
    if (selectedRateCode) {
      setLoading(true);
      fetchRatePlanByRateCodeID(selectedRateCode);
      const selectedRate = rateCodeList.find(
        rate => rate.value === selectedRateCode
      );
      const marketSegmentId = selectedRate
        ? selectedRate.marketSegmentId
        : undefined;
      setSelectedMarketsegment(marketSegmentId);
      form.setFieldsValue({ market_segment: marketSegmentId });
    }
  }, [selectedRateCode]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [loading]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleOk = async () => {
    const dataForm = await form.validateFields();
    if (id) {
      if (dataTableRoomRate.length > 0) {
        const username = localStorage.getItem('username');
        const formatData = {
          status: 'published',
          room_rate_detail: {
            create: [],
            update: dataTableRoomRate.map(item => ({
              adjust_rate: item.adjustedRate,
              adjust_rate_value: item.rate,
              rate: item.rate || 0,
              id: item.id,
              adjust_rate_is_increase: item.adjust_rate_is_increase || false,
              adjust_rate_is_percent: item.adjust_rate_is_percent || false,
              rate_activity_log: [
                {
                  action: 'Adjust Rate',
                  log: `Rate override: ${item.rateCurrent || 0} => ${
                    item.rate || 0
                  }`,
                  execute_at: getCurrentDateTime(),
                  rate_plan_id: Number(id),
                  user_execute: username,
                  rate_plan_room_detail_id: item.id,
                },
              ],
            })),
            delete: [],
          },
        };
        const res = await updateRatePlan(id, formatData);
        if (res && res.data.length > 0) {
          message.success('Edit rate plan successfully');
        }
      }
    } else {
      if (dataForm && dataTableRoomRate.length > 0) {
        const formatData = {
          hotel: dataForm.hotelId,
          rate_code: dataForm.rate_code,
          market_segment: dataForm.market_segment,
          from_date: dataForm.from_to_date[0],
          to_date: dataForm.from_to_date[1],
          status: 'published',
          room_rate_detail: {
            create: dataTableRoomRate.map(item => ({
              status: 'published',
              date: item.date,
              room_type: item.roomTypeId,
              package_plan: item.packagePlanId,
              option_rate: item.rateOverride ? 'rate_override' : 'adjust_rate',
              rate_override: item.rateOverride || 0,
              configured_rate: item.configuredRate,
              rate: item.rate,
              adjust_rate: item.adjustedRate || 0,
              adjust_rate_value: item.adjust_rate ? item.rate : 0,
              adjust_rate_is_increase: item.adjust_rate_is_increase || false,
              adjust_rate_is_percent: item.adjust_rate_is_percent || false,
            })),
            update: [],
            delete: [],
          },
        };
        const res = await createRatePlan(formatData);
        if (res && res.data.length > 0) {
          message.success('Create rate plan successfully');
        }
      }
    }
    onFinish?.();
  };

  const handleCancel = () => {
    form.resetFields();
    setIdentityNo('');
    setOpen(!open);
    setShowAlert(false);
    onCancel && onCancel();
  };

  const handleAdjustClick = () => {
    if (selectedRateCode && dateRange) {
      setParentModalState(open);
      setOpen(false);
      setAdjustModalOpen(true);
    } else {
      message.error(
        'Please fill in Rate Code and From Date - To Date to proceed'
      );
    }
  };

  const handleRateActClick = (record: any) => {
    setDataRateActLog(record.rate_activity_log);
    setParentModalState(open);
    setOpen(false);
    setRateActLogOpen(true);
  };

  const handleAdjustModalClose = () => {
    setAdjustModalOpen(false);
    setOpen(parentModalState);
  };

  const handleRateActLogClose = () => {
    setRateActLogOpen(false);
    setOpen(parentModalState);
  };

  useEffect(() => {
    const fetchRoomRateTable = async () => {
      if (
        selectedHotel &&
        selectedMarketsegment &&
        selectedRateCode &&
        dateRange?.length == 2
      ) {
        const formatBody = {
          HotelId: selectedHotel,
          RateCodeId: selectedRateCode,
          MarketSegmentId: selectedMarketsegment,
          FromDate: dateRange[0],
          ToDate: dateRange[1],
        };
        const roomRateDetailTable = await ratePlanApply(formatBody);
        const dataRoomRateDetail = roomRateDetailTable.map((item: any) => ({
          date: dayjs(item?.Date).format('YYYY-MM-DD'),
          roomTypeId: item?.RoomType?.Id,
          roomType: item?.RoomType?.Name,
          roomTypeCode: item?.RoomType?.Code,
          packagePlan: item?.PackagePlan?.Name,
          packagePlanId: item?.PackagePlan?.Id,
          packagePlanCode: item?.PackagePlan?.Code,
          configuredRate: item?.ConfiguredRate,
          rateOverride: item?.RateOverride,
          adjustedRate: item?.AdjustedRate,
          rate: item?.Rate,
          // rate_activity_log: item?.rate_activity_log,
        }));
        setDataTableRoomRate(dataRoomRateDetail);
      }
    };

    !loading && !id && fetchRoomRateTable();
  }, [selectedHotel, selectedRateCode, selectedMarketsegment, dateRange]);

  const columns: any = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (value: string, record: any) => value && formatDateTable(value),
    },
    {
      title: 'Room Type',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 90,
    },
    {
      title: 'Package Plan',
      dataIndex: 'packagePlan',
      key: 'packagePlan',
      width: 110,
    },
    {
      title: 'Configured Rate',
      dataIndex: 'configuredRate',
      key: 'configuredRate',
      width: 130,
    },
    {
      title: 'Rate Override',
      dataIndex: 'rateOverride',
      key: 'rateOverride',
      width: 120,
    },
    {
      title: 'Adjusted Rate',
      dataIndex: 'adjustedRate',
      key: 'adjustedRate',
      width: 120,
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      width: 120,
    },
    ...(id
      ? [
          {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 80,
            render: (_: any, record: any) => (
              <EyeSvg
                style={{ cursor: 'pointer' }}
                onClick={() => handleRateActClick(record)}
              />
            ),
          },
        ]
      : []),
  ];

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      setDateRange([startDate, endDate]);
    } else {
      setDateRange(null);
    }
  };

  return (
    <>
      <MyModal
        width={880}
        title={title}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <>
            <MyButton onClick={handleCancel} buttonType="outline">
              Close
            </MyButton>
            {isViewMode ? (
              <MyButton onClick={switchEditMode}>Edit</MyButton>
            ) : (
              <MyButton onClick={handleOk}>Save</MyButton>
            )}
          </>
        }
      >
        <Form form={form} layout="vertical" disabled={isViewMode}>
          <Row gutter={16}>
            <Col
              span={24}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <MyCardContent className="add-package-plan">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <SelectBasic
                      required
                      options={hotelList}
                      name="hotelId"
                      label="Hotel"
                      disabled={isViewMode || isShowOverView}
                      loading={loading}
                      onChange={setSelectedHotel}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <SelectBasic
                      disabled={isViewMode || isShowOverView}
                      label="Rate Code"
                      name="rate_code"
                      options={rateCodeList}
                      required
                      loading={loading}
                      noInitValue
                      form={form}
                      onChange={setSelectedRateCode}
                    />
                  </Col>
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
                    <DatePickerSingle
                      disabled={isViewMode || !selectedRateCode}
                      onDateChange={handleDateChange}
                      dateDisabled={dateDisabled}
                      // disabledCurrent
                      showInfo
                      showValue={false}
                      infoTooltip="Rate Code 'From - To' periods in Rate Plans can not overlap"
                    />
                  </Col>
                </Row>
              </MyCardContent>
              <MyCardContent title="Room Rate Detail">
                <div className="room-rate-wrapper">
                  <div className="room-rate-header">
                    <div className="adjust">
                      <Button
                        className={
                          isViewMode ? 'custom-btn-view' : 'custom-btn'
                        }
                        icon={<AdjustSvg height={16} width={16} />}
                        onClick={handleAdjustClick}
                        type="text"
                      >
                        <span>Adjust</span>
                      </Button>
                    </div>
                    <div className="room-rate-search-list">
                      <DatepickerFromToWithoutborder
                        arrDeptDate={dateRange}
                        onChange={setFromTo}
                        initialValue={dateRange}
                        disabled={!dateRange}
                        showValue={false}
                      />
                      <div className="divider"></div>
                      <MultipleSelectWithoutBorder
                        options={roomTypeOptions}
                        prefix="Room Type:"
                        onChange={setSelectedRoomType}
                      />
                      <div className="last-divider"></div>
                      <MultipleSelectWithoutBorder
                        options={packageList}
                        prefix="Package Plan:"
                        onChange={setSelectedPackagePlan}
                      />
                    </div>
                  </div>
                  <TableBasic
                    dataSource={filteredRoomRates}
                    columns={columns}
                  />
                </div>
              </MyCardContent>
              {isViewMode && (
                <MyCardContent
                  title="OVERVIEW INFORMATION"
                  className="text-gray f-z-12"
                >
                  <OverviewPersonalWithoutStatus
                    handleChangeRadio={handleChange}
                    selectedValue={selectedValue}
                    loading={loading}
                    disabled={isViewMode}
                  />
                </MyCardContent>
              )}
            </Col>
          </Row>
        </Form>
      </MyModal>

      <AdjustRateModal
        open={adjustModalOpen}
        onClose={handleAdjustModalClose}
        fromToDate={dateRange}
        selectedRateCode={selectedRateCode}
        packageList={packageList}
        dataRateAdjustTable={dataTableRoomRate}
      />

      <RateActivityLog
        open={rateActLogOpen}
        onClose={handleRateActLogClose}
        dataRateActLog={dataRateActLog}
      />
    </>
  );
};

export default RatePlanCru;
