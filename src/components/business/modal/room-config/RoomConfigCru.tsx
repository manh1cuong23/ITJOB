import React, { CSSProperties, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { MyCardContent } from '@/components/basic/card-content';
import { Row, Col, Form, CollapseProps, message } from 'antd';
import { MyModal } from '@/components/basic/modal';
import OverviewPersonal from '../service-info-cru/components/OverviewPersonal';
import SelectBasic from '../../select/SelectBasic';
import './RoomConfigCru.less';
import { MyCollapse } from '@/components/basic/collapse';
import { ISource } from '@/utils/formatSelectSource';
import {
  createRoomConfig,
  getRoomConfigByHotel,
  updateRoomConfig,
} from '@/api/features/roomConfig';
import { RoomSetting } from '../room-setting';
import { RoomAdjustment } from '../room-adjustment';
import { convertDotToComma } from '@/utils/formatInput';
import dayjs from 'dayjs';
import { IError } from '../../booking-info/type';
import { generateUniqueString } from '@/utils/common';
import {
  apiMarketSegmentList,
  apiRoomTypeList,
} from '@/api/features/masterData';

const RateConfigCru: React.FC<{
  open: boolean;
  onFinish?: () => void;
  onCancel?: () => void;
  isViewMode?: boolean;
  switchEditMode?: (value: boolean) => void;
  hotelList: ISource[];
  hotelId?: string | null;
}> = ({
  open,
  onFinish,
  onCancel,
  isViewMode = false,
  switchEditMode,
  hotelId,
  hotelList,
}) => {
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowOverView, setIsShowOverView] = useState<boolean>(true);
  const [errorSetting, setErrorSetting] = useState<IError[]>([]);
  const [isErrorPriorityOccupancy, setIsErrorPriorityOccupancy] = useState<
    boolean
  >(false);
  const [isErrorPriorityDayType, setIsErrorPriorityDayType] = useState<boolean>(
    false
  );
  const [isErrorPrioritySeason, setIsErrorPrioritySeason] = useState<boolean>(
    false
  );
  const [title, setTitle] = useState<string>('New Room Configuration');
  const [roomSetting, setRoomSetting] = useState<any>([]);
  const [roomSettingToAccount, setRoomSettingToAccount] = useState<any>([]);
  const [roomAdjust, setRoomAdjust] = useState<any>();
  const [isCreate, setIsCreate] = useState<boolean | undefined>(undefined);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      form.setFieldValue('hotel', hotelId);
      if (data.length > 0) {
        if (isViewMode) {
          setTitle('View Room Configuration');
          setIsShowOverView(true);
        } else {
          setTitle('Edit Room Configuration');
          setIsShowOverView(false);
        }
        setTimeout(() => {
          form.setFieldsValue({
            hotel: hotelId,
            username_created: data[0]?.username_created,
            username_modified: data[0]?.username_modified,
            createdAt: dayjs(data[0]?.date_created).format('YYYY-MM-DD'),
            modifiedAt: dayjs(data[0]?.date_updated).format('YYYY-MM-DD'),
          });
        }, 200);
      } else {
        setTitle('New Room Configuration');
        setIsShowOverView(false);
      }
    }
  }, [open]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  }, [loading]);

  const fetchDataByHotelId = async () => {
    if (!hotelId) return;
    const [roomTypeList, marketSegmentList] = await Promise.all([
      apiRoomTypeList(hotelId),
      apiMarketSegmentList(hotelId),
    ]);

    const combinedArray = roomTypeList?.data.flatMap((roomType: any) =>
      marketSegmentList?.data.map((marketSegment: any) => ({
        id: generateUniqueString(),
        room_type: roomType.name,
        room_type_code: roomType.code,
        room_type_id: roomType.id,
        market_segment_id: marketSegment.id,
        market_segment: marketSegment.name,
        is_percent: true,
      }))
    );
    setRoomSetting(combinedArray);
  };

  useEffect(() => {
    const fetchRoomConfigByHotelId = async () => {
      if (!hotelId) return;
      const res = await getRoomConfigByHotel(hotelId);
      if (res && res.data.length > 0) {
        setData(res.data);
        switchEditMode?.(true);
        const roomSettings = res.data.flatMap(
          (item: any) =>
            item?.room_setting?.map((setting: any) => ({
              id: setting.id,
              distribution_room: 1000,
              room_type: setting?.room_type?.name,
              room_type_id: setting?.room_type?.id,
              room_type_code: setting?.room_type?.code,
              market_segment: setting?.market_segment?.name,
              market_segment_id: setting?.market_segment?.id,
              market_segment_code: setting?.market_segment?.code,
              is_percent: setting?.is_percent,
            })) || []
        );
        setRoomSetting(roomSettings);

        const roomSettingToAccount = res.data.flatMap(
          (item: any) =>
            item?.room_setting_to_account?.map((setting: any) => ({
              id: setting.id,
              distribution_room: setting.distribution_room,
              room_type: setting?.room_type?.name,
              room_type_id: setting?.room_type?.id,
              room_type_code: setting?.room_type?.code,
              market_segment_id: setting?.market_segment?.id,
              account: setting?.account,
              is_percent: setting?.is_percent,
            })) || []
        );

        setRoomSettingToAccount(roomSettingToAccount);

        const roomAdjust = res.data.flatMap(
          (item: any) =>
            item?.room_adjustment?.map((adjust: any) => ({
              id: adjust.id,
              option_adjustment: adjust.option_adjustment,
              is_occupancy: adjust.occupancy.length > 0 ? true : false,
              is_daytype: adjust.day_type.length ? true : false,
              is_season: adjust.season.length ? true : false,
              occupancy:
                adjust.occupancy?.map((occ: any) => ({
                  id: occ.id,
                  from: convertDotToComma(occ.from),
                  to: convertDotToComma(occ.to),
                  value: convertDotToComma(occ.value),
                  is_percent: occ.is_percent,
                  is_increase: occ.is_increase,
                  priority: occ.priority,
                })) || [],
              day_type:
                adjust.day_type?.map((occ: any) => ({
                  id: occ.id,
                  value: convertDotToComma(occ.value),
                  is_percent: occ.is_percent,
                  is_increase: occ.is_increase,
                  type: occ.type,
                  priority: occ.priority,
                })) || [],
              season:
                adjust.season?.map((occ: any) => ({
                  id: occ.id,
                  value: convertDotToComma(occ.value),
                  is_percent: occ.is_percent,
                  is_increase: occ.is_increase,
                  type: occ.type,
                  priority: occ.priority,
                })) || [],
            })) || []
        );

        setRoomAdjust(roomAdjust[0]);
      } else {
        fetchDataByHotelId();
        const roomAdjust = {
          occupancy: [],
          day_type: [
            {
              id: generateUniqueString(),
              type: 'Holiday',
              is_percent: true,
              is_increase: true,
            },
            {
              id: generateUniqueString(),
              type: 'Weekend',
              is_percent: true,
              is_increase: true,
            },
          ],
          season: [
            {
              id: generateUniqueString(),
              type: 'High',
              is_percent: true,
              is_increase: true,
            },
            {
              id: generateUniqueString(),
              type: 'Low',
              is_percent: true,
              is_increase: true,
            },
          ],
        };
        setData([]);
        setRoomAdjust(roomAdjust);
        switchEditMode?.(false);
      }
    };
    fetchRoomConfigByHotelId();
  }, [hotelId]);

  const handleChange = (e: any) => {
    setSelectedValue(e.target.value);
  };

  const options = [
    { label: 'active', value: 'active' },
    { label: 'inactive', value: 'inactive' },
  ];
  const resetCheckAjust = () => {
    setIsErrorPriorityOccupancy(false);
    setIsErrorPrioritySeason(false);
    setIsErrorPriorityDayType(false);
  };

  const transformData = (data: any) => {
    const formattedData: any = {};

    Object.entries(data).forEach(([key, value]) => {
      let newKey = key;

      newKey = newKey.replace(/^(.+?)\[0\](\[\d+\])/, '$1$2');
      newKey = newKey.replace(/^(.+?\[\d+\])\[0\]/, '$1');

      const match = newKey.match(/^(.+?)\[(\d+)\]\.(.+)$/);

      if (match) {
        const [, parentKey, index, childKey] = match;
        if (!Array.isArray(formattedData[parentKey])) {
          formattedData[parentKey] = [];
        }
        if (!formattedData[parentKey][index]) {
          formattedData[parentKey][index] = {};
        }

        formattedData[parentKey][index][childKey] = value;
      } else {
        formattedData[newKey] = value;
      }
    });

    return formattedData;
  };

  const handleOk = async () => {
    await form.validateFields();
    const errorsSetting: IError[] = [];
    const dataForm = transformData(form.getFieldsValue());

    dataForm.setting.forEach((item: any, index: number) => {
      if (item.distribution_room === '') {
        errorsSetting.push({ field: 'distribution_room', row: index });
      }
    });

    if (errorsSetting.length > 0) {
      setErrorSetting(errorsSetting);
      return;
    } else {
      setErrorSetting([]);
    }

    const formattedRoomSetting = Array.isArray(roomSetting)
      ? roomSetting
          .map((setting: any) => ({
            id: isNaN(Number(setting.id)) ? null : setting.id,
            hotel: Number(hotelId),
            room_type: setting.room_type_id,
            market_segment: setting.market_segment_id,
            distribution_room: setting.distribution_room,
            is_percent: setting.is_percent || false,
          }))
          .filter(Boolean)
      : [];

    const formattedRoomAdjustment = [
      {
        id: roomAdjust.id,
        option_adjustment: dataForm.occupancyRadio,
        ...(dataForm?.occupancyCheck && {
          occupancy: Array.isArray(dataForm.occupancy)
            ? dataForm.occupancy.map((occ: any) => ({
                id: isNaN(Number(occ.id)) ? null : occ.id,
                from: parseFloat(occ.from),
                to: parseFloat(occ.to),
                value: parseFloat(occ.value),
                is_increase: occ.is_increase || false,
                is_percent: occ.is_percent || false,
                priority: dataForm?.priority_occupancy,
              }))
            : [],
        }),
        ...(dataForm?.dayTypeCheck && {
          day_type: Array.isArray(dataForm.dayType)
            ? dataForm.dayType.map((day: any) => ({
                id: day.id,
                type: day.type,
                value: parseFloat(day.value),
                is_increase: day.is_increase || false,
                is_percent: day.is_percent || false,
                priority: dataForm?.priority_day_type,
              }))
            : [],
        }),
        ...(dataForm?.seasonCheck && {
          season: Array.isArray(dataForm.season)
            ? dataForm.season.map((season: any) => ({
                id: season.id,
                type: season.type,
                is_increase: season.is_increase || false,
                is_percent: season.is_percent || false,
                priority: dataForm?.priority_day_type,
                value: parseFloat(season.value),
              }))
            : [],
        }),
      },
    ];

    const room_setting_to_account = Array.isArray(roomSettingToAccount)
      ? roomSettingToAccount
          .map((setting: any) => ({
            id: isNaN(Number(setting.id)) ? null : setting.id,
            hotel: Number(hotelId),
            room_type: setting.room_type_id,
            market_segment: setting.market_segment_id,
            distribution_room: setting.distribution_room,
            is_percent: setting.is_percent || false,
          }))
          .filter(Boolean)
      : [];

    const formattedData = {
      hotel: dataForm.hotel,
      room_setting: formattedRoomSetting,
      room_adjustment: formattedRoomAdjustment,
      room_setting_to_account,
    };

    if (data.length > 0) {
      const res = await updateRoomConfig(data[0]?.id, formattedData);
      if (res && res.data) {
        message.success('Edit room configuration successfully');
        onFinish?.();
        onCancel?.();
      }
    } else {
      const res = await createRoomConfig(formattedData);
      if (res && res.data) {
        message.success('Create room configuration successfully');
        onFinish?.();
      }
    }
  };

  const handleCancel = () => {
    resetCheckAjust();
    form.resetFields();
    onCancel && onCancel();
    if (data.length > 0) {
      switchEditMode?.(true);
    }
  };

  const getItems: (
    panelStyle: CSSProperties
  ) => CollapseProps['items'] = panelStyle => [
    {
      key: '1',
      label: 'ROOM SETTING',
      children: (
        <>
          <RoomSetting
            selectedHotel={hotelId}
            isViewMode={isViewMode}
            form={form}
            isCreate={isCreate}
            setIsLoading={setLoading}
            isLoading={loading}
            dataSource={roomSetting}
            errorSetting={errorSetting}
            open={open}
            hotelList={hotelList}
            roomSettingToAccount={roomSettingToAccount}
            setRoomSettingToAccount={setRoomSettingToAccount}
            setRoomSetting={setRoomSetting}
            // forceUpdate={forceUpdate}
          />
        </>
      ),
      style: panelStyle,
    },
    {
      key: '2',
      label: 'ROOM ADJUSTMENT',
      children: (
        <RoomAdjustment
          isErrorPriorityOccupancy={isErrorPriorityOccupancy}
          isErrorPrioritySeason={isErrorPrioritySeason}
          isErrorPriorityDayType={isErrorPriorityDayType}
          isViewMode={isViewMode}
          form={form}
          data={roomAdjust}
          isLoading={loading}
          open={open}
        />
      ),
      style: panelStyle,
    },
  ];

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
              <MyButton onClick={() => switchEditMode?.(false)}>Edit</MyButton>
            ) : (
              <MyButton onClick={handleOk}>Save</MyButton>
            )}
          </>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col
              span={24}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <MyCardContent className="add-package-plan">
                <Row gutter={[16, 16]}>
                  <Col
                    xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                    sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                    md={24} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={24} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={24} // Chiếm 19/24 phần màn hình cực lớn (xl)
                  >
                    <SelectBasic
                      disabled
                      label="Hotel"
                      name="hotel"
                      options={hotelList}
                      noInitValue
                      loading={loading}
                      required
                    />
                  </Col>
                </Row>
              </MyCardContent>
              <MyCollapse
                getItems={getItems}
                accordion={false}
                activeKey={['1', '2']}
              />
              {isShowOverView && (
                <MyCardContent
                  title="OVERVIEW INFORMATION"
                  className="text-gray f-z-12"
                >
                  <OverviewPersonal
                    disabled={false}
                    handleChangeRadio={handleChange}
                    selectedValue={selectedValue}
                    loading={loading}
                    options={options}
                    showStatus={false}
                  />
                </MyCardContent>
              )}
            </Col>
          </Row>
        </Form>
      </MyModal>
    </>
  );
};

export default RateConfigCru;
