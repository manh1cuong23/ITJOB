import { MyButton } from '@/components/basic/button';
import { MyModal } from '@/components/basic/modal';
import { ReactComponent as Tick } from '@/assets/icons/ic_ticks.svg';
import { MyCardContent } from '@/components/basic/card-content';
// import '../styles.less';
import '@/components/business/special-service/style.less';
import { Col, Form, Row } from 'antd';
import { formatNumberMoney, generateUniqueString } from '@/utils/common';
import { MyFormItem } from '@/components/basic/form-item';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import MyInputNumber from '@/components/basic/input/InputNumber';
import { IListRoom } from '../../room-info/types';
import { ISpecialServiceList } from '../../special-service/type';
import { IndividualListItem } from '../../individual-list/IndividualList.types';
import { DatePickerFromTo } from '../../date-picker';
import { InputAdult, InputChild } from '../../input';
import { SpecialServiceItem } from '../../special-service-group';
import { MyTextArea } from '@/components/basic/input';
import { IRateInfoItem } from '../../rate-info/type';
import { apiGetRoomTypeById } from '@/api/features/booking';
const AddRoom: React.FC<{
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
  setIndividualList: React.Dispatch<React.SetStateAction<IndividualListItem[]>>;
  fromToDate: [string, string] | null;
  fromToValue?: [string, string] | null;
  hotelId: string | null;
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
  setIndividualList,
  fromToDate,
  fromToValue,
  hotelId,
}) => {
  const [form] = Form.useForm();
  dayjs.extend(isSameOrBefore);
  const [maxAdult, setMaxAdult] = useState<number>(0);
  const [maxChild, setMaxChild] = useState<number>(0);
  const [roomTypeId, setRoomTypeId] = useState<number>(0);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

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

  const onChangeFromTo = (dates: string[] | null) => {
    setDateRange([dates?.[0] || '', dates?.[1] || '']);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(values => {
        if (values.from_to && values.from_to.length === 2) {
          const [startRawDate, endRawDate] = values.from_to;
          const startDate = dayjs(startRawDate).format('YYYY-MM-DD');
          const endDate = dayjs(endRawDate).format('YYYY-MM-DD');

          const generateRateInfos = (): IRateInfoItem[] => {
            const rateInfos: IRateInfoItem[] = [];
            let currentDate = dayjs(startDate, 'YYYY-MM-DD');

            while (currentDate.isSameOrBefore(dayjs(endDate, 'YYYY-MM-DD'))) {
              rateInfos.push({
                No: generateUniqueString(),
                sourceName: cardData?.sourceName || '',
                sourceId: cardData?.sourceId || '',
                date: currentDate.format('YYYY-MM-DD'),
                roomType: cardData?.roomTypeName || '',
                guest: `${values.adultNum || 0} Adults, ${
                  values.childNum || 0
                } Children`,
                package: cardData?.packageName || '',
                rate: Number(cardData?.rate) || 0,
                remark: values.remark || '',
                adults: values.adultNum || 0,
                children: values.childNum || 0,
                ratePlanCode: cardData?.ratePlanCode || '',
                packageCode: cardData?.packageCode || '',
                allotmentNo: cardData?.sourceId || '',
                roomTypeId: roomTypeId,
                roomTypeCode: cardData?.roomTypeCode || '',
                bookingItemId: 0,
              });
              currentDate = currentDate.add(1, 'day');
            }

            return rateInfos;
          };

          setIndividualList(prevList => {
            const newRecords = [];
            const initialRoomNo = prevList.length > 0 ? prevList.length + 1 : 1;

            for (let i = 0; i < values.room; i++) {
              const roomNo = (initialRoomNo + newRecords.length).toString();

              const updatedSpecialServices = Array.isArray(specialServiceList)
                ? specialServiceList.map(service => ({
                    ...service,
                    roomNo: `#${roomNo}`,
                  }))
                : [];

              const newRecord: IndividualListItem = {
                No: generateUniqueString(),
                hotelId: hotelId || '',
                roomNo: `#${roomNo}`,
                arrivalDate: startDate || '',
                departureDate: endDate || '',
                roomType: cardData?.roomTypeName || '',
                adults: values.adultNum || 0,
                numChildren: values.childNum || 0,
                package: cardData?.packageName || '',
                rate: Number(cardData?.rate) || 0,
                remark: values.remark || '',
                sourceId: cardData?.sourceId || '',
                specialServices: updatedSpecialServices,
                rateInfos: generateRateInfos(),
              };

              newRecords.push(newRecord);
            }
            return [...prevList, ...newRecords];
          });
        }

        onOk && onOk();
        form.resetFields();
      })
      .catch(errorInfo => {
        console.log('Validate Failed:', errorInfo);
      });
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
    }
  }, [visible, form, adultNum, childNum, fromToValue]);

  return (
    <MyModal
      width={880}
      title={title || 'Add Room'}
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
              md={24}
              lg={24}
              xl={24}
              style={{ marginBottom: '16px' }}>
              <MyCardContent title="stay infomation">
                <Row
                  gutter={[16, 16]}
                  style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <DatePickerFromTo
                      defaultValue={fromToDate}
                      value={fromToDate}
                      onChange={onChangeFromTo}
                      required
                    />
                  </Col>
                </Row>
                <Row
                  gutter={[16, 16]}
                  className="row-container"
                  style={{ margin: '4px 0 16px' }}>
                  <Col
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    style={{ paddingLeft: 0 }}>
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
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
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
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ paddingRight: 0 }}>
                    <MyFormItem
                      name={'room'}
                      label={'# Room'}
                      required
                      initialValue={1}
                      form={form}>
                      <MyInputNumber
                        min={1}
                        max={Number(cardData?.availableRooms)}
                      />
                    </MyFormItem>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <MyFormItem name="remark" label="Remark">
                      <MyTextArea placeholder="Enter" />
                    </MyFormItem>
                  </Col>
                </Row>
              </MyCardContent>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <SpecialServiceItem
                setSpecialServiceList={setSpecialServiceList}
                specialServiceList={specialServiceList}
                arrDeptDate={dateRange}
                hotelIdSelected={hotelId}
                isAdd
              />
            </Col>
          </Row>
        </Form>
      </div>
    </MyModal>
  );
};

export default AddRoom;
