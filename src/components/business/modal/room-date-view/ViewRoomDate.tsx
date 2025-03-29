import React, { useEffect, useState } from 'react';
import { MyModal } from '@/components/basic/modal';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as Edit } from '@/assets/icons/ic_edit_white.svg';
import { ReactComponent as AdultSvg } from '@/assets/icons/ic_adult.svg';
import { ReactComponent as ChildSvg } from '@/assets/icons/ic_child.svg';
import './ViewRoomDate.less';
import { MyCardContent } from '@/components/basic/card-content';
import { formatNumberMoney } from '@/utils/common';
import { InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { IRateInfoItem } from '../../rate-info/type';
import ChangeInfor from '../individual-booking-change-info/ChangeInfo';
import MyCardContentMultiBorder from '@/components/basic/card-content/CardContentMultiBorder';
const ViewRoomDate: React.FC<{
  record: any;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  rateInfoList: IRateInfoItem[];
  setRateInfoList: any;
  onBack?: () => void;
  childNum?: number;
  adultNum?: number;
}> = ({
  visible,
  record,
  onOk,
  onCancel,
  rateInfoList,
  setRateInfoList,
  onBack,
  childNum,
  adultNum,
}) => {
  const adultsMatch = record?.totalAdults;
  const childrenMatch = record?.totalChildren;
  const [changeInforVisible, setChangeInforVisible] = useState(false);
  const adultsCount = Number(adultsMatch);
  const childrenCount = Number(childrenMatch);

  return (
    <>
      <MyModal
        width={550}
        title={'View Room Date'}
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        footer={
          <div>
            <MyButton
              onClick={() => {
                setChangeInforVisible(true);
                setTimeout(() => {
                  onCancel();
                }, 100);
              }}
              icon={<Edit />}
              style={{ marginRight: '0px' }}>
              Edit
            </MyButton>
            <MyButton onClick={onCancel} buttonType="outline">
              Cancel
            </MyButton>
          </div>
        }>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
          <MyCardContentMultiBorder
            key={1}
            items={[
              {
                title: 'Date',
                content: <>{dayjs(record?.date).format('DD/MM/YYYY')}</>,
              },
              {
                title: 'Guest',
                content: (
                  <div
                    style={{
                      background: '#FFF',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px 4px',
                      width: '100px',
                      justifyContent: 'center',
                    }}>
                    {/* Icon người lớn */}
                    {adultsCount >= 0 && (
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <AdultSvg />
                        <span style={{ marginLeft: 4 }}>{adultsCount}</span>
                      </span>
                    )}
                    <div
                      style={{
                        background: '#CACACA',
                        width: '1px',
                        height: '14px',
                        margin: '0px 4px',
                      }}></div>
                    {/* Icon trẻ em */}
                    {childrenCount >= 0 && (
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginLeft: '10px',
                          gap: 4,
                        }}>
                        <ChildSvg />
                        {childrenCount}
                      </span>
                    )}
                  </div>
                ),
              },
              {
                title: 'Rate',
                content: (
                  <span style={{ color: 'red' }}>
                    {formatNumberMoney(record?.rate)}
                  </span>
                ),
              },
            ]}
          />

          <MyCardContentMultiBorder
            key={2}
            items={[
              {
                title: 'Source',
                content: <>{record?.sourceName}</>,
              },
              {
                title: 'Source ID',
                content: <span style={{ color: '#16A34A' }}>{record?.id}</span>,
              },
              {
                title: 'Room Type',
                content: <>{record?.roomType}</>,
              },
              {
                title: 'Package',
                content: (
                  <>
                    {record?.package}{' '}
                    {record?.package && (
                      <span style={{ marginLeft: 4, color: '#16A34A' }}>
                        <InfoCircleOutlined />
                      </span>
                    )}
                  </>
                ),
              },
            ]}
          />

          <MyCardContent title="Remark">
            <div>{record?.remark}</div>
          </MyCardContent>
        </div>
      </MyModal>
      {record && (
        <ChangeInfor
          childNum={childNum}
          adultNum={adultNum}
          rateInfoList={rateInfoList}
          setRateInfoList={setRateInfoList}
          rateInfoSelected={[record.No]}
          visible={changeInforVisible}
          onOk={() => {
            setChangeInforVisible(false);
          }}
          onCancel={() => {
            setChangeInforVisible(false);
          }}
        />
      )}
    </>
  );
};

export default ViewRoomDate;
6