import { MyButton } from '@/components/basic/button';
import { MyModal } from '@/components/basic/modal';
import { ReactComponent as Tick } from '@/assets/icons/ic_ticks.svg';
import { IListRoom } from '../../room-info/types';
import { MyCardContent } from '@/components/basic/card-content';
import './Room.less';
import '@/components/business/special-service/style.less';
import { Col, CollapseProps, Form, message, Row } from 'antd';
import { formatNumberMoney, generateUniqueString } from '@/utils/common';
import { DatePickerFromTo } from '../../date-picker';
import { MyFormItem } from '@/components/basic/form-item';
import { MyTextArea } from '@/components/basic/input';
import SpecialService from '../../special-service/SpecialService';
import { MyCollapse } from '@/components/basic/collapse';
import { CSSProperties, useEffect, useState } from 'react';
import { ISpecialServiceList } from '../../special-service/type';
import { IRateInfoItem } from '../../rate-info/type';
import dayjs from 'dayjs';
import { checkAndformatDate } from '@/utils/formatDate';
import { InputAdult, InputChild } from '../../input';
import { apiGetRoomTypeById } from '@/api/features/booking';
import ProfileUpdate from '../update-profile/ProfileUpdate';
import isBetween from 'dayjs/plugin/isBetween';

const SelectRoom: React.FC<{
  isEdit?: boolean;
  visible: boolean;
  onOk?: () => void;
  onCancel: () => void;
  title?: string;
  adultNum?: number;
  childNum?: number;
  cardData?: IListRoom;
  specialServiceList: ISpecialServiceList[];
  setSpecialServiceList: React.Dispatch<
    React.SetStateAction<ISpecialServiceList[]>
  >;
  fromToDate: [string, string] | null;
  setRateInfoList: React.Dispatch<React.SetStateAction<IRateInfoItem[]>>;
  fromToValue?: [string, string] | null;
  hotelSelected: string | null;
  rateInfoList?: IRateInfoItem[];
}> = ({
  visible,
  onOk,
  onCancel,
  title,
  adultNum,
  childNum,
  cardData,
  specialServiceList,
  setSpecialServiceList,
  fromToDate,
  setRateInfoList,
  fromToValue,
  hotelSelected,
  rateInfoList,
  isEdit = false,
}) => {
  const [form] = Form.useForm();
  dayjs.extend(isBetween);
  const [removeSpecialService, setRemoveSpecialService] =
    useState<boolean>(false);
  const [specialServiceData, setSpecialServiceData] = useState<
    ISpecialServiceList[]
  >([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [maxAdult, setMaxAdult] = useState<number>(0);
  const [maxChild, setMaxChild] = useState<number>(0);
  const [roomTypeId, setRoomTypeId] = useState<number>(0);
  const [rateList, setRateList] = useState<IRateInfoItem[]>([]);

  const onChangeFromTo = (dates: string[] | null) => {
    setDateRange([dates?.[0] || '', dates?.[1] || '']);
  };

  const fetchDataRoomType = async () => {
    if (cardData) {
      const res = await apiGetRoomTypeById(cardData.roomTypeId);
      if (res && res.data) {
        setMaxAdult(res.data?.[0]?.total_adult || 0);
        setMaxChild(res.data?.[0]?.total_child || 0);
        setRoomTypeId(res.data?.[0]?.id || 0);
      }
    }
  };

  useEffect(() => {
    fetchDataRoomType();
  }, [cardData]);

  const handleSave = () => {
    setRateInfoList([]); // Clear the list before setting new records
    form
      .validateFields()
      .then(values => {
        if (dateRange && dateRange.length === 2) {
          const [startRawDate, endRawDate] = dateRange;
          const startDateFormatted = checkAndformatDate(startRawDate);
          const endDateFormatted = checkAndformatDate(endRawDate);
          const startDate = dayjs(startDateFormatted, 'YYYY-MM-DD');
          const endDate = dayjs(endDateFormatted, 'YYYY-MM-DD');
          const daysDiff = startDate.isSame(endDate, 'day')
            ? 1
            : endDate.diff(startDate, 'day') + 1;
          const newRecords: IRateInfoItem[] = Array.from(
            { length: daysDiff },
            (_, index) => {
              const currentDay = startDate
                .add(index, 'day')
                .format('YYYY-MM-DD');
              return {
                No: generateUniqueString(),
                hotelId: Number(cardData?.hotelId) || 0,
                date: currentDay,
                roomType: cardData?.roomTypeName || 'Unknown',
                guest: `${values.adultNum || 0} Adults, ${
                  values.childNum || 0
                } Children`,
                adults: values.adultNum || 0,
                children: values.childNum || 0,
                package: cardData?.packageName || 'Unknown',
                rate: Number(cardData?.rate) || 0,
                remark: values.remark || '',
                sourceName: cardData?.sourceName || '',
                sourceId: cardData?.sourceId || 'ALLOTMENT',
                roomTypeId: roomTypeId,
                roomTypeCode: cardData?.roomTypeCode ?? '',
                ratePlanCode: cardData?.ratePlanCode ?? '',
                packageCode: cardData?.packageCode ?? '',
                allotmentNo: cardData?.sourceId ?? '',
                bookingItemId: 0,
              };
            }
          );
          const newHotelId = Number(cardData?.hotelId) || 0;

          const hasDifferentHotelId =
            rateInfoList &&
            rateInfoList.some(
              item => item.hotelId && item.hotelId !== newHotelId
            );
          if (hasDifferentHotelId && !isEdit) {
            setShowUpdateProfile(true);
            setTimeout(() => {
              onCancel();
            }, 100);
            setRateList(newRecords);
          } else {
            setRateInfoList(newRecords);
            message.success('Room selected successfully!');
            onOk && onOk();
          }
        }
        form.resetFields();
      })
      .catch(errorInfo => {
        console.log('Validate Failed:', errorInfo);
      });
    specialServiceData && setSpecialServiceList(specialServiceData);
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        adultNum:
          maxAdult < Number(adultNum) ? maxAdult : Number(adultNum) || 1,
        childNum:
          maxChild < Number(childNum) ? maxChild : Number(childNum) || 0,
        from_to: fromToValue || [null, null],
      });
      setDateRange(fromToValue || null);
      if (isEdit && fromToValue) {
        const [fromDate, toDate] = fromToValue;
        const filteredSpecialServices = specialServiceList.filter(service => {
          const serviceStart = dayjs(service.fromDate);
          const serviceEnd = dayjs(service.toDate);
          const rangeStart = dayjs(fromDate);
          const rangeEnd = dayjs(toDate);

          return (
            serviceStart.isBetween(rangeStart, rangeEnd, 'day', '[]') &&
            serviceEnd.isBetween(rangeStart, rangeEnd, 'day', '[]')
          );
        });
        setSpecialServiceData(filteredSpecialServices);
      } else {
        specialServiceList && setSpecialServiceData(specialServiceList);
      }
    }
  }, [visible, form, adultNum, childNum, fromToValue, specialServiceList]);

  const renderSpecialServices = () => {
    const maxVisible = 5;
    const hiddenCount = specialServiceData.length - maxVisible;

    return (
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginLeft: '15px',
        }}>
        {specialServiceData.slice(0, maxVisible).map((service, index) => (
          <div
            key={index}
            style={{
              padding: '5px 6px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              color: '#1C1917',
            }}>
            {service.serviceCode.slice(0, 2)}
          </div>
        ))}

        {hiddenCount > 0 && (
          <div
            style={{
              padding: '5px 8px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              color: '#ED4E6B',
            }}>
            +{hiddenCount}
          </div>
        )}
      </div>
    );
  };

  const getItems: (
    panelStyle: CSSProperties
  ) => CollapseProps['items'] = panelStyle => [
    {
      key: '1',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          SPECIAL SERVICE {renderSpecialServices()}
        </div>
      ),
      // extra: genExtra(),
      children: (
        <SpecialService
          removeItemFlag={removeSpecialService}
          dataSource={specialServiceData}
          setDataSource={setSpecialServiceData}
          hotelId={hotelSelected}
          arrDeptDate={dateRange ? dateRange : fromToDate}
        />
      ),
      style: panelStyle,
      className: 'special-service-panel',
    },
  ];
  const handleRemoveSpecialService = (event: React.MouseEvent) => {
    event.stopPropagation();
    setRemoveSpecialService(!removeSpecialService);
  };
  const genExtra = () => (
    <div
      className="h-center gap-5"
      onClick={event => {
        event.stopPropagation();
        handleRemoveSpecialService(event);
      }}>
      <div
        style={{
          background: '#A8A29E',
          height: '16px',
          width: '1px',
          margin: '0 10px',
          cursor: 'pointer',
        }}></div>
    </div>
  );

  return (
    <>
      <MyModal
        width={880}
        title={title || 'Select Room'}
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        footer={
          <>
            <MyButton onClick={onCancel} buttonType="outline">
              Close
            </MyButton>
            <MyButton onClick={handleSave} icon={<Tick />}>
              Save
            </MyButton>
          </>
        }>
        <div className="select-room">
          <MyCardContent hasHeader={false}>
            <div className="room-info">
              <div className="room-info-col">
                <h3>ROOM TYPE</h3>
                <p>{cardData?.roomTypeName}</p>
              </div>
              <div className="room-info-divider"></div>
              <div className="room-info-col">
                <h3>Available Room</h3>
                <p className="avail-num">{cardData?.availableRooms}</p>
              </div>
              <div className="room-info-divider"></div>
              <div className="room-info-col">
                <h3>PACKAGE</h3>
                <p>{cardData?.packageName}</p>
              </div>
              <div className="room-info-divider"></div>
              <div className="room-info-col">
                <h3>Source</h3>
                <p className="source-content h-center gap-5">
                  {cardData?.sourceName}
                  <span className="tag-common">{cardData?.sourceId}</span>
                </p>
              </div>
              <div className="room-info-divider"></div>
              <div className="room-info-col">
                <h3>Rate</h3>
                <p className="rate-txt">
                  {' '}
                  {cardData?.rate
                    ? `${formatNumberMoney(Number(cardData?.rate))}`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </MyCardContent>
          <div className="select-room-divider"></div>
          <Form layout="vertical" form={form}>
            <Row gutter={[16, 16]}>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                style={{ marginBottom: '16px' }}>
                <MyCardContent
                  title={<div className="stay-info">Stay information</div>}>
                  <Row
                    gutter={[16, 16]}
                    style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <DatePickerFromTo
                        onChange={onChangeFromTo}
                        defaultValue={fromToDate}
                        value={fromToDate}
                        required
                      />
                    </Col>
                    <Row gutter={[16, 16]} className="guest-info-row">
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <InputAdult
                          name="adultNum"
                          max={
                            maxAdult < Number(adultNum)
                              ? maxAdult
                              : Number(adultNum) || 1
                          }
                          form={form}
                        />
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{ marginTop: 2 }}>
                        <InputChild
                          name="childNum"
                          max={
                            maxChild < Number(childNum)
                              ? maxChild
                              : Number(childNum) || 0
                          }
                        />
                      </Col>
                    </Row>
                  </Row>
                </MyCardContent>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                style={{ marginBottom: '16px' }}>
                <MyCardContent
                  title={<div className="remark-title">Remark</div>}
                  className="remark text-gray f-z-12">
                  <MyFormItem
                    name="remark"
                    initialValue={''}
                    isShowLabel={false}>
                    <MyTextArea placeholder="Enter" className="select-room" />
                  </MyFormItem>
                </MyCardContent>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <MyCollapse
                  getItems={getItems}
                  accordion={false}
                  activeKey={['1']}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </MyModal>
      <ProfileUpdate
        visible={showUpdateProfile}
        onCancel={() => setShowUpdateProfile(false)}
        onOk={() => {
          setShowUpdateProfile(false);
          setRateInfoList(rateList);
          message.success('Room selected successfully!');
        }}
        title="ID no is existed. Do you want to update information of the profile?"
      />
    </>
  );
};

export default SelectRoom;
