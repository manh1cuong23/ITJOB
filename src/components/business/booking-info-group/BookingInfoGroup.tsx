import { MyCard } from '@/components/basic/card';
import { MyCollapse } from '@/components/basic/collapse';
import { CollapseProps } from 'antd';
import { CSSProperties, useEffect, useState } from 'react';
import RoomInfo from '../room-info/RoomInfo';
import { ReactComponent as PlusSvg } from '@/assets/icons/ic_green-plus.svg';
import { IPackage } from '../rate-info/type';
import IndividualList from '../individual-list/IndividualList';
import SpecialServiceGroup from '../special-service-group/SpecialServiceTable';
import { ISpecialServiceList } from '../special-service/type';
import {
  IGeneralInfoData,
  IRoomInfoData,
} from '@/containers/booking/view-booking/type';
import { IndividualListItem } from '../individual-list/IndividualList.types';
import { MyCardContent } from '@/components/basic/card-content';
import { MyButton } from '@/components/basic/button';
import './BookingInfoGroup.less';
import { SpecialServiceItem } from '../special-service-group';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectRoomSearch,
  setRoomSearch as setRoomSearchRedux,
} from '@/stores/slices/group-booking.slice';

interface IProps {
  bookingData?: any;
  arrDeptDate?: [string, string] | null;
  setRoomInfoData?: React.Dispatch<
    React.SetStateAction<IRoomInfoData | undefined>
  >;
  childNum?: number;
  adultNum?: number;
  setSpecialSvcAmt: React.Dispatch<React.SetStateAction<number>>;
  setTotalRoomCharge: React.Dispatch<React.SetStateAction<number>>;
  setSpecialServiceData: React.Dispatch<
    React.SetStateAction<ISpecialServiceList[]>
  >;
  specialServiceData: ISpecialServiceList[];
  setIndividualList: React.Dispatch<React.SetStateAction<IndividualListItem[]>>;
  individualList: IndividualListItem[];
  generalInfoData: IGeneralInfoData[];
  guestSelected?: any;
  isEdit?: boolean;
  setHotelId?: React.Dispatch<React.SetStateAction<number>>;
}

const BookingInfoGroup = (props: IProps) => {
  const {
    bookingData,
    arrDeptDate,
    adultNum,
    childNum,
    setSpecialSvcAmt,
    setTotalRoomCharge,
    specialServiceData,
    setSpecialServiceData,
    setIndividualList,
    individualList,
    generalInfoData,
    guestSelected,
    isEdit = false,
    setHotelId,
  } = props;
  const [packageList, setPackageList] = useState<IPackage[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [hotelIdSelected, setHotelIdSelected] = useState<string | null>(null);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [roomSearch, setRoomSearch] = useState<any[]>([]);
  const dispatch = useDispatch();
  const [specialServiceList, setSpecialServiceList] = useState<
    ISpecialServiceList[]
  >([]);
  const reduxRoomSearch = useSelector(selectRoomSearch);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 430);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const initialKeys = isEdit
      ? ['2', '3']
      : individualList.length > 0
      ? ['1', '2']
      : ['1'];

    setActiveKeys(initialKeys);
  }, [isEdit, individualList]);

  useEffect(() => {
    if (reduxRoomSearch.length > 0) {
      setRoomSearch(reduxRoomSearch);
      dispatch(setRoomSearchRedux([]));
    }
  }, [reduxRoomSearch]);

  const updateSpecialServiceData = () => {
    // Tạo danh sách dịch vụ đặc biệt mới từ individualList
    const updatedSpecialServiceData = individualList.reduce(
      (accumulatedServices: ISpecialServiceList[], individual) => {
        individual.specialServices.forEach(specialService => {
          // Tìm kiếm dịch vụ đặc biệt đã tồn tại với roomNo tương ứng
          const existingService = accumulatedServices.find(
            service =>
              service.id === specialService.id &&
              service.roomNo === individual.roomNo
          );

          if (!existingService) {
            // Thêm dịch vụ mới với roomNo cụ thể
            accumulatedServices.push({
              ...specialService,
              roomNo: individual.roomNo, // Chỉ chứa một roomNo
            });
          }
        });

        return accumulatedServices;
      },
      []
    );

    // Cập nhật danh sách dịch vụ đặc biệt hiện tại, lọc những dịch vụ không hợp lệ
    const filteredList = updatedSpecialServiceData.filter(service =>
      individualList.some(individual =>
        individual.specialServices.some(
          specialService =>
            specialService.id === service.id &&
            service.roomNo === individual.roomNo
        )
      )
    );

    setSpecialServiceList(filteredList);
  };

  useEffect(() => {
    updateSpecialServiceData();
  }, [individualList]);

  const getItems: (
    panelStyle: CSSProperties
  ) => CollapseProps['items'] = panelStyle => [
    {
      key: '1',
      label: 'ROOM INFOMATION',
      children: (
        <RoomInfo
          bookingData={bookingData}
          adultNum={adultNum}
          childNum={childNum}
          arrDeptDate={arrDeptDate}
          specialServiceList={specialServiceData}
          setSpecialServiceList={setSpecialServiceData}
          setIndividualList={setIndividualList}
          setPackages={setPackageList}
          setHotelIdSelected={setHotelIdSelected}
          setRoomSearch={setRoomSearch}
          roomSearch={roomSearch}
          isGroup
          setHotelSelected={setHotelIdSelected}
          setHotelId={setHotelId}
        />
      ),
      style: panelStyle,
      className: 'collapse-room-info',
    },
    {
      key: '2',
      label: 'INDIVIDUAL LIST',
      children: (
        <IndividualList
          roomSearch={roomSearch}
          guestSelected={guestSelected}
          generalInfoData={generalInfoData}
          individualList={individualList}
          setTotalRoomCharge={setTotalRoomCharge}
          setSpecialSvcAmt={setSpecialSvcAmt}
          arrDeptDate={arrDeptDate}
          setIndividualList={setIndividualList}
          setSpecialServiceData={setSpecialServiceData}
          adultNum={adultNum}
          childNum={childNum}
          hotelIdSelected={hotelIdSelected}
          isEdit={isEdit}
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
        <SpecialServiceItem
          hotelIdSelected={hotelIdSelected}
          arrDeptDate={arrDeptDate}
          specialServiceList={specialServiceList}
          setSpecialServiceList={setSpecialServiceList}
          individualList={individualList}
          setIndividualList={setIndividualList}
          isEdit={isEdit}
        />
      </MyCard>
    </>
  );
};

export default BookingInfoGroup;
