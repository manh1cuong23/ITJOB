import { MyButton } from '@/components/basic/button';
import { MyModal } from '@/components/basic/modal';
import { ReactComponent as Tick } from '@/assets/icons/ic_ticks.svg';
import { MyCardContent } from '@/components/basic/card-content';
import { useEffect, useState } from 'react';
import { ReactComponent as ChangeSvg } from '@/assets/icons/ic_change_rate.svg';
import { IPackage, IRateInfoItem } from '../../rate-info/type';
import { Col, Form, Row } from 'antd';
import RateInfo from '../../rate-info/RateInfo';
import { InputAdult, InputChild } from '../../input';
import { DatePickerArrDeptCount } from '../../date-picker';
import { IndividualListItem } from '../../individual-list/IndividualList.types';
import dayjs from 'dayjs';
import { generateUniqueString } from '@/utils/common';

const ModalRateInfo: React.FC<{
  visible: boolean;
  onOk?: () => void;
  onCancel: () => void;
  individualList: IndividualListItem[];
  setIndividualList: React.Dispatch<React.SetStateAction<IndividualListItem[]>>;
  roomNo?: string;
  childNum?: number;
  adultNum?: number;
  arrDeptDate?: [string, string] | null;
}> = ({
  visible,
  onOk,
  onCancel,
  individualList = [],
  setIndividualList,
  roomNo,
  childNum,
  adultNum,
  arrDeptDate,
}) => {
  const [form] = Form.useForm();
  const [rateList, setRateList] = useState<IRateInfoItem[]>([]);
  const [packageList, setPackageList] = useState<IPackage[]>([]);

  useEffect(() => {
    if (individualList.length > 0) {
      setRateList(individualList[0]?.rateInfos);
    }
  }, [individualList]);

  useEffect(() => {
    individualList &&
      form.setFieldsValue({
        arr_dept: [
          individualList[0]?.arrivalDate,
          individualList[0]?.departureDate,
        ],
        adultNum: individualList[0]?.adults,
        childNum: individualList[0]?.numChildren,
      });
  }, [visible]);

  const handleSave = () => {
    setIndividualList((prevList: IndividualListItem[]) =>
      prevList.map(item => {
        if (item.roomNo === roomNo) {
          return {
            ...item,
            adults: rateList?.[0]?.adults,
            numChildren: rateList?.[0]?.children,
            rateInfos: rateList,
          };
        }
        return item;
      })
    );
    onOk && onOk();
  };

  const handleChangeAdult = (value: number) => {
    const arrDept = form.getFieldValue('arr_dept');
    const [startDateStr, endDateStr] = arrDept || [];
    if (!startDateStr || !endDateStr) return;

    const startDate = dayjs(startDateStr);
    const endDate = dayjs(endDateStr);

    const datesInRange: string[] = [];
    for (
      let date = startDate;
      date.isBefore(endDate) || date.isSame(endDate);
      date = date.add(1, 'day')
    ) {
      datesInRange.push(date.format('YYYY-MM-DD'));
    }

    setRateList(prevRateList =>
      prevRateList.map(rateInfo => {
        if (datesInRange.includes(rateInfo.date)) {
          return {
            ...rateInfo,
            adults: value,
            guest: `${value} Adults, ${rateInfo.children} Children`,
          };
        }
        return rateInfo;
      })
    );
  };

  const handleChangeChild = (value: number) => {
    const arrDept = form.getFieldValue('arr_dept');
    const [startDateStr, endDateStr] = arrDept || [];
    if (!startDateStr || !endDateStr) return;

    const startDate = dayjs(startDateStr);
    const endDate = dayjs(endDateStr);

    const datesInRange: string[] = [];
    for (
      let date = startDate;
      date.isBefore(endDate) || date.isSame(endDate);
      date = date.add(1, 'day')
    ) {
      datesInRange.push(date.format('YYYY-MM-DD'));
    }

    setRateList(prevRateList =>
      prevRateList.map(rateInfo => {
        if (datesInRange.includes(rateInfo.date)) {
          return {
            ...rateInfo,
            children: value,
            guest: `${rateInfo.adults} Adults, ${value} Children`,
          };
        }
        return rateInfo;
      })
    );
  };

  return (
    <MyModal
      width={880}
      title={
        <>
          Rate Information:{' '}
          <span
            style={{ color: '#ED4E6B', fontSize: '18px', fontWeight: '600' }}>
            {roomNo}
          </span>
        </>
      }
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
      <div className="rate-info">
        <MyCardContent hasHeader={false} style={{ marginBottom: '16px' }}>
          <Form layout="vertical" form={form}>
            <Row gutter={[16, 16]} className="rate-row">
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <DatePickerArrDeptCount value={arrDeptDate} />
              </Col>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <InputAdult
                  name="adultNum"
                  loading={false}
                  max={Number(adultNum) || 1}
                  onChange={value => handleChangeAdult(Number(value))}
                />
              </Col>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <InputChild
                  name="childNum"
                  loading={false}
                  max={Number(childNum) || 0}
                  onChange={value => handleChangeChild(Number(value))}
                />
              </Col>
            </Row>
          </Form>
        </MyCardContent>
        <MyCardContent title="RATE INFORMATION">
          <RateInfo
            // setRateInfoSelected={setRateInfoSelected}
            setRateInfoList={setRateList}
            rateInfoList={rateList}
          />
        </MyCardContent>
      </div>
    </MyModal>
  );
};

export default ModalRateInfo;
