import { MyCard } from '@/components/basic/card';
import { MyCollapse } from '@/components/basic/collapse';
import { CollapseProps } from 'antd';
import { CSSProperties, useEffect, useState } from 'react';
import RoomInfo from '../room-info/RoomInfo';
import RateInfo from '../rate-info/RateInfo';
import { IBookingInfoProps } from './type';
import SpecialService from '../special-service/SpecialService';
import ChangeInfor from '../modal/individual-booking-change-info/ChangeInfo';
import { IPackage, IRateInfoItem } from '../rate-info/type';
import { generateUniqueString } from '@/utils/common';

const BookingInfo = (props: IBookingInfoProps) => {
  const {
    bookingData,
    arrDeptDate,
    adultNum,
    childNum,
    setSpecialSvcAmt,
    setTotalRoomCharge,
    specialServiceData,
    setSpecialServiceData,
    rateInfoList,
    setRateInfoList,
    errorRateInfor,
    errorSpecialService,
    isEdit = false,
    individualList,
    setHotelId,
  } = props;
  const [rateInfoSelected, setRateInfoSelected] = useState<any>();
  const [changeInforVisible, setChangeInforVisible] = useState<boolean>(false);
  const [packageList, setPackageList] = useState<IPackage[]>([]);
  const [rateList, setRateList] = useState<IRateInfoItem[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [removeSpecialService, setRemoveSpecialService] =
    useState<boolean>(false);
  const [hotelSelected, setHotelSelected] = useState<string | null>(null);
  const [activeKeys, setActiveKeys] = useState<string | string[]>([]);
  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsSmallScreen(window.innerWidth <= 430);
  //   };

  //   handleResize();
  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  useEffect(() => {
    const initialKeys = isEdit
      ? ['2', '3']
      : rateInfoList.some(item => item.sourceId && item.adults)
      ? ['1', '2']
      : ['1'];

    setActiveKeys(initialKeys);
  }, [isEdit, rateInfoList]);

  useEffect(() => {
    if (bookingData) {
      setHotelSelected(bookingData.hotel.hotelId);
    }
  }, [bookingData]);

  useEffect(() => {
    if (arrDeptDate && Array.isArray(arrDeptDate) && arrDeptDate.length === 2) {
      const startDate = new Date(arrDeptDate[0]);
      const endDate = new Date(arrDeptDate[1]);

      const newRateInfo: IRateInfoItem[] = [];
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        newRateInfo.push({
          No: generateUniqueString(),
          sourceName: '',
          sourceId: '',
          date: d.toISOString().split('T')[0],
          roomType: '',
          guest: '',
          hotelId: 0,
          package: '',
          rate: 0,
          remark: '',
          adults: 0,
          children: 0,
          ratePlanCode: '',
          packageCode: '',
          allotmentNo: '',
          roomTypeId: 0,
          roomTypeCode: '',
          bookingItemId: 0,
        });
      }

      setRateInfoList(prevRateList => {
        const validDates = new Set(
          newRateInfo.map(
            item => new Date(item.date).toISOString().split('T')[0]
          )
        );

        const filteredRateList = prevRateList.filter(item =>
          validDates.has(new Date(item.date).toISOString().split('T')[0])
        );

        newRateInfo.forEach(newItem => {
          const newDate = new Date(newItem.date).toISOString().split('T')[0];
          if (
            !filteredRateList.some(
              item =>
                new Date(item.date).toISOString().split('T')[0] === newDate
            )
          ) {
            filteredRateList.push(newItem);
          }
        });

        return filteredRateList.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA - dateB;
        });
      });
    }
  }, [arrDeptDate]);

  useEffect(() => {
    const hotelIdsInRateList = new Set(rateList.map(item => item.hotelId));
    const rateInfoMap = rateList.reduce((acc, item) => {
      acc[new Date(item.date).toISOString().split('T')[0]] = item;
      return acc;
    }, {} as Record<string, IRateInfoItem>);

    setRateInfoList(prevRateList => {
      return prevRateList.map(existingItem => {
        const existingDate = new Date(existingItem.date)
          .toISOString()
          .split('T')[0];

        const matchingRateInfo = rateInfoMap[existingDate];
        if (!isEdit) {
          if (!hotelIdsInRateList.has(existingItem.hotelId)) {
            if (matchingRateInfo) {
              return { ...existingItem, ...matchingRateInfo };
            } else {
              return {
                ...existingItem,
                hotelId: rateList[0]?.hotelId,
                date: existingItem.date,
                No: existingItem.No,
                sourceName: '',
                sourceId: '',
                roomType: '',
                guest: '',
                package: '',
                rate: 0,
                remark: '',
                adults: 0,
                children: 0,
                ratePlanCode: '',
                packageCode: '',
                allotmentNo: '',
                roomTypeId: 0,
                roomTypeCode: '',
                bookingItemId: 0,
              };
            }
          } else {
            if (matchingRateInfo) {
              return { ...existingItem, ...matchingRateInfo };
            }
          }
        } else {
          if (matchingRateInfo) {
            return { ...existingItem, ...matchingRateInfo };
          }
        }
        return existingItem;
      });
    });
  }, [rateList]);

  const renderSpecialServices = () => {
    const maxVisible = isSmallScreen ? 3 : 5;
    const hiddenCount = specialServiceData.length - maxVisible;

    return (
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginLeft: isSmallScreen ? '0px' : '15px',
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
  const handleRemoveSpecialService = (event: React.MouseEvent) => {
    event.stopPropagation();
    setRemoveSpecialService(!removeSpecialService);
  };
  const getItems: (
    panelStyle: CSSProperties
  ) => CollapseProps['items'] = panelStyle => [
    {
      key: '1',
      label: 'ROOM INFOMATION',
      children: (
        <RoomInfo
          bookingData={bookingData}
          individualList={individualList}
          adultNum={adultNum}
          childNum={childNum}
          arrDeptDate={arrDeptDate}
          specialServiceList={specialServiceData}
          setSpecialServiceList={setSpecialServiceData}
          rateInfoList={rateInfoList}
          setRateInfoList={setRateList}
          setPackages={setPackageList}
          setHotelSelected={setHotelSelected}
          setHotelId={setHotelId}
          isEdit={isEdit}
        />
      ),
      style: panelStyle,
      className: 'collapse-room-info',
    },
    {
      key: '2',
      label: 'RATE INFORMATION',
      children: (
        <RateInfo
          adultNum={adultNum}
          childNum={childNum}
          rateInfoList={rateInfoList}
          setTotalRoomCharge={setTotalRoomCharge}
          setRateInfoList={setRateInfoList}
          errorRateInfor={errorRateInfor}
        />
      ),
      style: panelStyle,
      // extra: getExtraChangeRate(),
      className: 'collapse-rate-info',
    },
    {
      key: '3',
      // Loại bỏ flex khi màn hình nhỏ hơn 430px
      label: (
        <div
          style={
            isSmallScreen ? {} : { display: 'flex', alignItems: 'center' }
          }>
          SPECIAL SERVICE {renderSpecialServices()}
        </div>
      ),
      // extra: genExtra(),
      children: (
        <SpecialService
          bookingData={bookingData}
          arrDeptDate={arrDeptDate}
          removeItemFlag={removeSpecialService}
          dataSource={specialServiceData}
          setDataSource={setSpecialServiceData}
          setSpecialSvcAmt={setSpecialSvcAmt}
          errorSpecialService={errorSpecialService}
          hotelId={hotelSelected}
        />
      ),
      style: panelStyle,
    },
  ];

  return (
    <>
      <MyCard title="BOOKING INFOMATION">
        <MyCollapse
          getItems={getItems}
          accordion={false}
          activeKey={activeKeys}
        />
      </MyCard>
      <ChangeInfor
        rateInfoList={rateInfoList}
        setRateInfoList={setRateInfoList}
        rateInfoSelected={rateInfoSelected}
        visible={changeInforVisible}
        onOk={() => {}}
        onCancel={() => {
          setChangeInforVisible(false);
        }}
      />
    </>
  );
};

export default BookingInfo;
