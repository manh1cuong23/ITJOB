import { CardRoom } from '@/components/business/card-room';
import {
  SelectPackageWithoutBorder,
  SelectRoomTypeWithoutBorder,
  SelectSourceWithoutBorder,
} from '@/components/business/select';
import SelectHotelWithoutBorder from '@/components/business/select/SelectHotelWithoutBorder';
import { Button, Col, Divider, Form, Row } from 'antd';
import './types';
import { IListRoom, IRoomInfoProps } from './types';
import './style.less';
import { useCallback, useEffect, useState } from 'react';
import NotFoundSvg from '@/assets/icons/ic_not_found_black.svg';
import { ReactComponent as RedoSvg } from '@/assets/icons/ic_redo.svg';
import {
  apiHotelList,
  apiPackageList,
  apiRoomInfoSearch,
  apiRoomTypeByHotelId,
} from '@/api/features/myAllotment';
import { ISource } from '@/utils/formatSelectSource';
import dayjs from 'dayjs';
import { DatepickerFromToWithoutborder } from '../date-picker';
import { v4 as uuidv4 } from 'uuid';
import { useMediaQuery } from 'react-responsive';
import SelectRoom from '../modal/room-booking/SelectRoom';
import AddRoom from '../modal/room-booking/AddRoom';

const RoomInfo = (props: IRoomInfoProps) => {
  const {
    bookingData,
    onSearch,
    arrDeptDate,
    specialServiceList,
    setSpecialServiceList,
    setRateInfoList,
    rateInfoList,
    adultNum,
    childNum,
    setPackages,
    setIndividualList,
    setHotelIdSelected,
    individualList,
    setRoomSearch,
    roomSearch,
    isGroup = false,
    setHotelSelected,
    setHotelId,
    isEdit = false,
  } = props;
  const [form] = Form.useForm();
  const [showNoData, setShowNoData] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [selectedCard, setSelectedCard] = useState<null | IListRoom>(null);
  const [isShowRoomSelect, setIsShowRoomSelect] = useState(false);
  const [roomTypeList, setRoomTypeList] = useState<ISource[]>([]);
  const [hotelList, setHotelList] = useState<ISource[]>([]);
  const [roomList, setRoomList] = useState<IListRoom[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [packageList, setPackageList] = useState<ISource[]>([]);
  const isSmallScreen = useMediaQuery({ query: '(max-width: 430px)' });
  const [fromToValue, setFromToValue] = useState<string[]>([
    dayjs().format('YYYY-MM-DD'),
    dayjs().add(30, 'day').format('YYYY-MM-DD'),
  ]);

  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[string, string] | null>([
    dayjs().format('YYYY-MM-DD'),
    dayjs().add(1, 'day').format('YYYY-MM-DD'),
  ]);

  useEffect(() => {
    if (roomSearch && roomSearch.length > 0) {
      const hotelItem = roomSearch.find(item => item.label === 'hotel');

      if (hotelItem) {
        form.setFieldsValue({
          hotelId: hotelItem.value,
        });
        setSelectedHotelId(hotelItem.value);
        setSelectedHotel(hotelItem.value);
        setHotelSelected(hotelItem.value);
      }
      const sourceItem = roomSearch.find(item => item.label === 'source');

      if (sourceItem) {
        form.setFieldsValue({
          sourceId: sourceItem.value,
        });
        setSelectedSource(sourceItem.value);
      }

      const roomTypeItem = roomSearch.find(item => item.label === 'roomType');
      if (roomTypeItem) {
        form.setFieldsValue({
          roomTypeCode: roomTypeItem.value,
        });
        setSelectedRoomType(roomTypeItem.value);
      }

      const packageItem = roomSearch.find(item => item.label === 'package');

      if (packageItem) {
        form.setFieldsValue({
          packageCode: packageItem.value,
        });
        setSelectedPackage(packageItem.value);
      }
    }
  }, [roomSearch]);

  useEffect(() => {
    if (bookingData) {
      form.setFieldsValue({
        hotelId: bookingData.hotel.hotelId,
      });
      setSelectedHotelId(bookingData.hotel.hotelId);
      setSelectedHotel(bookingData.hotel.hotelId);
      setHotelSelected(bookingData.hotel.hotelId);
    }
  }, [bookingData]);

  useEffect(() => {
    if (individualList && individualList.length > 0) {
      form.setFieldsValue({
        hotelId: individualList[0]?.hotelId,
      });
      setSelectedHotelId(individualList[0]?.hotelId);
      setSelectedHotel(individualList[0]?.hotelId);
      setHotelSelected(individualList[0]?.hotelId);
    }
  }, [individualList]);

  useEffect(() => {
    const fetchHotelList = async () => {
      try {
        const hotelListRes = await apiHotelList();
        if (hotelListRes && hotelListRes.data.length > 0) {
          const data: ISource[] = hotelListRes.data.map((item: any) => ({
            label: item.short_name,
            value: item.hotel_id,
            id: item.id,
          }));
          setHotelList(data);
        }
      } catch (error) {
        console.error('Error fetching hotel list:', error);
      }
    };
    fetchHotelList();
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedHotelId) return;
    try {
      const [roomTypeListRes, packageListRes] = await Promise.all([
        selectedHotelId
          ? apiRoomTypeByHotelId(selectedHotelId)
          : Promise.resolve({ isSuccess: false, data: [] }),
        apiPackageList(),
      ]);
      if (roomTypeListRes && roomTypeListRes.data.length > 0) {
        const roomTypes = roomTypeListRes.data.map((item: any) => ({
          label: item.name,
          value: item.code,
        }));
        setRoomTypeList(roomTypes);
      }

      if (packageListRes && packageListRes.data.length > 0) {
        const packages = packageListRes.data.map((item: any) => ({
          label: item.name,
          value: item.code,
        }));
        setPackageList(packages);
        setPackages(packageListRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [selectedHotelId, fromToValue]);

  useEffect(() => {
    setRoomSearch &&
      setRoomSearch(prevRoomSearch => [
        ...(selectedPackage
          ? [{ label: 'package', value: selectedPackage }]
          : []),
        ...(selectedSource ? [{ label: 'source', value: selectedSource }] : []),
        ...(selectedRoomType
          ? [{ label: 'roomType', value: selectedRoomType }]
          : []),
        ...(selectedHotel ? [{ label: 'hotel', value: selectedHotel }] : []),
        ...(dateRange ? [{ label: 'form-to', value: dateRange }] : []),
      ]);
  }, [
    selectedHotel,
    selectedSource,
    selectedRoomType,
    selectedPackage,
    dateRange,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onHotelChange = (hotelId: string) => {
    const matchingHotel = hotelList.find(hotel => hotel.value === hotelId);
    setHotelId && setHotelId(matchingHotel?.id ?? 0);
    if (selectedHotelId !== hotelId) {
      setSelectedHotelId(hotelId);
      setSelectedHotel(hotelId);
      setHotelIdSelected && setHotelIdSelected(hotelId);
      setHotelSelected && setHotelSelected(hotelId);
    }
  };

  const searchRoomAvailable = async (value: any) => {
    const formatedBody: API.SearchDto = {
      searchFields: [
        {
          key: 'hotelId',
          value: value['hotelId'],
        },
        {
          key: 'roomTypeCode',
          value: value['roomType'],
        },
        {
          key: 'packageCode',
          value: value['packageCode'],
        },
        {
          key: 'dateRange',
          value: value['dateRange'],
        },
      ],
    };

    try {
      const res = await apiRoomInfoSearch(formatedBody);
      if (res && res.status) {
        // Sử dụng map để format lại dữ liệu
        const formatedResult = res.result.data.map((item: any) => ({
          hotelId: item.hotelId,
          packageName: item.packageName,
          sourceName: item.sourceName,
          sourceId: item.allotmentNo,
          rate: item.rate,
          roomTypeName: item.roomTypeName,
          roomTypeId: item.roomTypeId,
          roomTypeCode: item.roomTypeCode,
          availableRooms: item.availableRooms,
          id: uuidv4(),
          ratePlanCode: item.ratePlanCode,
          packageCode: item.packageCode,
          allotmentNo: item.allotmentNo,
        }));
        // Cập nhật state với kết quả đã được định dạng
        setRoomList(formatedResult);
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const handleSearch = async () => {
    const values = {
      hotelId: selectedHotel,
      source: selectedSource,
      roomType: selectedRoomType,
      packageCode: selectedPackage,
      dateRange,
    };
    values && onSearch && onSearch(values);
    await searchRoomAvailable(values);
  };
  useEffect(() => {
    if (roomList.length === 0) {
      setShowNoData(true);
    } else {
      setShowNoData(false);
    }
  }, [roomList]);

  useEffect(() => {
    handleSearch();
  }, [
    selectedHotel,
    selectedSource,
    selectedRoomType,
    selectedPackage,
    dateRange,
  ]);
  useEffect(() => {
    if (roomList?.length === 0 && !isSearched) setShowNoData(true);
  }, []);

  const handleReset = () => {
    form.resetFields();
    setShowNoData(false);
    setIsSearched(false);
    if (roomList?.length === 0 && !isSearched) setShowNoData(true);
    onSearch && onSearch({});
    // Reset các giá trị đã lưu
    setSelectedHotel(null);
    setSelectedSource(null);
    setSelectedRoomType(null);
    setSelectedPackage(null);
    setDateRange([
      dayjs().format('YYYY-MM-DD'),
      dayjs().add(1, 'day').format('YYYY-MM-DD'),
    ]);
  };
  const showSelectedRoom = (cardData: IListRoom) => {
    setSelectedCard(cardData);
    setIsShowRoomSelect(true);
  };

  useEffect(() => {
    form.setFieldValue('from-to', arrDeptDate);
    arrDeptDate && setDateRange(arrDeptDate);
  }, [arrDeptDate]);

  const onChangeDateRange = (value: [string, string] | null) => {
    setDateRange(value);
  };

  return (
    <div className="room-wrapper">
      <div className="room-search">
        <Form form={form} layout={isSmallScreen ? 'vertical' : 'horizontal'}>
          <div className="room-search-list">
            <SelectHotelWithoutBorder
              options={hotelList}
              onChange={onHotelChange}
              isDisabled={isEdit}
            />
            <Divider type="vertical" />
            <SelectSourceWithoutBorder
              maxWidth="50px"
              onChange={setSelectedSource}
              hotelId={selectedHotelId !== 'N/A' ? selectedHotelId : null}
              form={form}
            />
            <Divider type="vertical" />
            <SelectRoomTypeWithoutBorder
              options={roomTypeList}
              maxWidth="70px"
              disabled={!selectedHotelId || selectedHotelId === 'N/A'}
              onChange={setSelectedRoomType}
              hotelId={selectedHotelId !== 'N/A' ? selectedHotelId : null}
              form={form}
            />
            <Divider type="vertical" />
            <SelectPackageWithoutBorder
              options={packageList}
              maxWidth="50px"
              disabled={!selectedHotelId || selectedHotelId === 'N/A'}
              hotelId={selectedHotelId !== 'N/A' ? selectedHotelId : null}
              onChange={setSelectedPackage}
              form={form}
            />
            <Divider type="vertical" />
            <DatepickerFromToWithoutborder
              onChange={dates => setDateRange(dates)}
              initialValue={arrDeptDate}
              arrDeptDate={arrDeptDate}
              className="date-picker"
            />
          </div>
        </Form>
      </div>
      <div className="room-result">
        {!showNoData && (
          <div className={`room-list ${showNoData ? 'hide' : ''}`}>
            <Row gutter={24}>
              {roomList &&
                roomList.map((cardData, index) => (
                  <Col key={index} md={6} style={{ margin: '5px 0' }}>
                    <CardRoom
                      key={index}
                      {...cardData}
                      onClick={() => showSelectedRoom(cardData)}
                      isActive={selectedCard?.id === cardData.id}
                    />
                  </Col>
                ))}
            </Row>
          </div>
        )}
        {showNoData && (
          <div className={`no-data-found ${showNoData ? 'show' : ''}`}>
            <img
              src={NotFoundSvg}
              alt="Not Found"
              style={{ width: '100px', marginBottom: '16px' }}
            />
            <div className="no-data-txt">No data found</div>
            {isSearched && (
              <Button
                icon={<RedoSvg width={16} height={16} />}
                type="text"
                onClick={handleReset}
                className="no-data-button">
                Set To Default
              </Button>
            )}
          </div>
        )}
      </div>
      {isGroup ? (
        <AddRoom
          adultNum={adultNum}
          childNum={childNum}
          visible={isShowRoomSelect}
          onCancel={() => setIsShowRoomSelect(!isShowRoomSelect)}
          onOk={() => setIsShowRoomSelect(!isShowRoomSelect)}
          cardData={roomList.find(item => item.id === selectedCard?.id)}
          specialServiceList={specialServiceList}
          setSpecialServiceList={setSpecialServiceList}
          fromToDate={dateRange}
          setIndividualList={setIndividualList || (() => {})}
          fromToValue={dateRange}
          hotelId={selectedHotelId || ''}
        />
      ) : (
        <SelectRoom
          adultNum={adultNum}
          childNum={childNum}
          visible={isShowRoomSelect}
          onCancel={() => setIsShowRoomSelect(!isShowRoomSelect)}
          onOk={() => setIsShowRoomSelect(!isShowRoomSelect)}
          cardData={roomList.find(item => item.id === selectedCard?.id)}
          specialServiceList={specialServiceList}
          setSpecialServiceList={setSpecialServiceList}
          fromToDate={dateRange}
          setRateInfoList={setRateInfoList || (() => {})}
          fromToValue={dateRange}
          hotelSelected={selectedHotelId}
          rateInfoList={rateInfoList}
          isEdit={isEdit}
        />
      )}
    </div>
  );
};

export default RoomInfo;
