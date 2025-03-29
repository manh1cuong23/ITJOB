import SelectRoomType from '@/components/business/select/SelectRoomType';
import { ISource } from '@/utils/formatSelectSource';
import {
  MultiSelectBasic,
  SelectBookingStatus,
  SelectBookingType,
  SelectCreatedBy,
  SelectHotels,
  SelectStatus,
} from '@/components/business/select';
import { InputBasic, InputBasicWithSuffix } from '@/components/business/input';
import {
  DatePickerArrDept,
  DatePickerBooked,
  DatePickerFromTo,
} from '@/components/business/date-picker';
import { useEffect, useState } from 'react';
import { apiHotelList, apiRoomTypeByHotelId } from '@/api/features/myAllotment';
import { message } from 'antd';
import { BOOKED_BY, BOOKING_STATUS, BOOKING_TYPE } from '@/constants/booking';
import DatepickerBasic from '@/components/business/date-picker/DatepickerBasic';
import dayjs from 'dayjs';
import { apiUserList } from '@/api/features/user';

export interface IFromToValue {
  fromDate: string;
  toDate: string;
}

const AdvancedSearchForm = () => {
  const [hotelList, setHotelList] = useState<ISource[]>([]);
  const [selectedHotelIds, setSelectedHotelIds] = useState<
    string[] | undefined
  >(undefined);
  const [roomTypeList, setRoomTypeList] = useState<ISource[]>([]);
  const [userList, setUserList] = useState<ISource[]>([]);
  useEffect(() => {
    const fetchHotelList = async () => {
      try {
        const hotelListRes = await apiHotelList();
        if (hotelListRes.isSuccess && hotelListRes.data.length > 0) {
          const data: ISource[] = hotelListRes.data.map((item: any) => ({
            label: item.fullName,
            value: item.id,
          }));
          setHotelList(data);
          setSelectedHotelIds(data.map(item => item.value));
        }
      } catch (error) {
        message.error('Error fetching hotel list. Please try again later.');
      }
    };

    fetchHotelList();
  }, []); // Ensure this has an empty array to run only on mount
  const fetchAllUser = async () => {
    try {
      const res = await apiUserList();
      // Kiểm tra trạng thái trả về
      if (res?.data && res?.data.length > 0) {
        const allUser = res.data.map((item: any) => ({
          label: item?.userName,
          value: item?.userName,
        }));
        setUserList(allUser);
      } else {
        setUserList([]); // Xóa nếu không tìm thấy loại phòng
      }
    } catch (error) {
      message.error('Error fetching room type list.'); // Hiển thị thông báo lỗi
    }
  };
  useEffect(() => {
    fetchAllUser();
  }, []);
  useEffect(() => {
    const fetchRoomTypeList = async () => {
      if (selectedHotelIds && selectedHotelIds.length > 0) {
        try {
          const roomTypeListRes = await apiRoomTypeByHotelId(
            selectedHotelIds.join(',')
          ); // Gọi API với mảng hotelId

          // Kiểm tra trạng thái trả về
          if (roomTypeListRes.isSuccess && roomTypeListRes.data.length > 0) {
            const roomTypes = roomTypeListRes.data.map((item: any) => ({
              label: item.roomTypeName,
              value: item.id,
            }));
            setRoomTypeList(roomTypes);
          } else {
            setRoomTypeList([]); // Xóa nếu không tìm thấy loại phòng
          }
        } catch (error) {
          message.error('Error fetching room type list.'); // Hiển thị thông báo lỗi
        }
      } else {
        setRoomTypeList([]); // Xóa loại phòng nếu không có khách sạn nào được chọn
      }
    };

    fetchRoomTypeList();
  }, [selectedHotelIds]);

  return (
    <>
      <InputBasic label="Code" name="code" />
      <InputBasic label="Name" name="name" />
      <MultiSelectBasic
        label="Status"
        name="status"
        options={[
          {
            label: 'Active',
            value: 'published',
          },
          {
            label: 'InActive',
            value: 'inActive',
          },
        ]}
      />
      {/* <SelectStatus
        options={[
          {
            label: 'All',
            value: 'ALL',
          },
          {
            label: 'Active',
            value: 'published',
          },
          {
            label: 'InActive',
            value: 'inActive',
          },
        ]}
      /> */}
      <div style={{ display: 'flex', gap: 16 }}>
        <DatePickerFromTo
          notInitValue
          name="createdAtFromTo"
          labelFromDate="Created At From"
          labelToDate="Created At To"
          value={['', dayjs().format('YYYY-MM-DD')]}
        />
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <DatePickerFromTo
          name="modifiedAtFromTo"
          notInitValue
          labelFromDate="Modified At From"
          labelToDate="Modified At To"
          value={['', dayjs().format('YYYY-MM-DD')]}
        />
      </div>
      <SelectCreatedBy
        maxWidth="300px"
        maxTagCount={3}
        options={userList}
        name="createdBy"
        label="Created By"
      />
      <SelectCreatedBy
        maxWidth="300px"
        maxTagCount={3}
        options={userList}
        name="modifiedBy"
        label="Modified By"
      />
    </>
  );
};

export default AdvancedSearchForm;
