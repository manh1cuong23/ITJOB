import React, { CSSProperties, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { MyCardContent } from '@/components/basic/card-content';
import { Row, Col, Form, message, CollapseProps } from 'antd';
import { MyModal } from '@/components/basic/modal';
import { InputBasic } from '../../input';
import { SelectHotelSearch, SelectRoomType, SelectService } from '../../select';
import OverviewPersonal from '../service-info-cru/components/OverviewPersonal';
import { TableBasic } from '@/components/basic/table';
import { MyCollapse } from '@/components/basic/collapse';
import SelectBasic from '../../select/SelectBasic';
import './RateCodeCru.less';
import {
  createNewRateCode,
  getRateCodeByCode,
  getRateCodeItem,
  updateRateCode,
} from '@/api/features/rateCode';
import { ISource } from '@/utils/formatSelectSource';
import {
  getRoomTypeByHotelId,
  getRoomTypeByHotelId2,
} from '@/api/features/roomType';
import { getMarketSegmentByHotelId } from '@/api/features/marketSegment';
import { omit } from 'lodash';
import { optionsOverView } from '@/constants/page';
import {
  MultiSelectWithSearch,
  SingleSelectSearchCustom,
} from '@/components/basic/select';
import { MyFormItem } from '@/components/basic/form-item';

const RateCodeCru: React.FC<{
  id?: string;
  open: boolean;
  isAdd?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish?: (value: any) => void;
  onCancel?: () => void;
  title: string;
  setPageData?: (data: any) => void;
  setNewGuestWithDetail?: (data: any) => void;
  nameInputed?: any;
  phoneInputed?: string;
  setNamePhone?: (name: string, phone: string) => void;
  onBack?: () => void;
  isShowContinues?: boolean;
  isViewMode?: boolean;
  switchEditMode?: () => void;
  setGuestSelected?: (data: any) => void;
  isShowOverView?: boolean;
  selectedHotelSearch?: string;
  hotelList: any;
  sourcePopup: 'main' | 'sharing' | 'master';
}> = ({
  id,
  open,
  onFinish,
  onCancel,
  title,
  isAdd,
  setPageData,
  nameInputed,
  phoneInputed,
  hotelList,
  setOpen,
  setNamePhone,
  isShowContinues = false,
  isViewMode = false,
  switchEditMode,
  isShowOverView = true,
  onBack,
  setGuestSelected,
  setNewGuestWithDetail,
  sourcePopup,
}) => {
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [selectedHotelIds, setSelectedHotelIds] = useState<string | null>('');
  const [roomTypeList, setRoomTypeList] = useState<ISource[]>([]);
  const [marketSegmentList, setMarketSegmentList] = useState<any>([]);
  const [errCode, setErrorCode] = useState<boolean>(false);
  const userName = localStorage.getItem('username');
  const resetForm = () => {
    form.resetFields();
  };
  const resetSelect = () => {
    form.resetFields(['market_segment', 'room_Type']);
  };
  useEffect(() => {
    if (!id) {
      resetForm();
    }
  }, [id]);
  const fetchRomType = async () => {
    try {
      const roomTypeRes = await getRoomTypeByHotelId2(selectedHotelIds);
      if (roomTypeRes && roomTypeRes.data.length > 0) {
        const data: ISource[] = roomTypeRes.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setRoomTypeList(data);
      } else {
        setRoomTypeList([]);
      }
    } catch (error) {
      console.error('Error fetching hotel list:', error);
    }
  };
  useEffect(() => {
    fetchRomType();
  }, [selectedHotelIds, id]);

  const fetMarketSegment = async () => {
    try {
      const marketSegmentRes = await getMarketSegmentByHotelId(
        selectedHotelIds
      );
      if (marketSegmentRes && marketSegmentRes.data.length > 0) {
        const data: ISource[] = marketSegmentRes.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setMarketSegmentList(data);
      } else {
        setMarketSegmentList([]);
      }
    } catch (error) {
      console.error('Error fetching hotel list:', error);
    }
  };
  useEffect(() => {
    fetMarketSegment();
  }, [selectedHotelIds, id]);

  const fetchById = async (id: string | undefined) => {
    if (!id) return;
    resetForm();
    try {
      setLoading(true);
      const serviceRateCode = await getRateCodeItem(id.toString());
      const roomTypeIds =
        serviceRateCode?.data?.room_Type?.map(
          (roomTypeItem: any) => roomTypeItem?.room_type_id?.id
        ) || [];
      if (serviceRateCode) {
        const formatData = {
          hotel: serviceRateCode?.data?.hotel?.id,
          room_Type: roomTypeIds,
          market_segment: serviceRateCode?.data?.market_segment?.id,
          rate_code: serviceRateCode?.data?.rate_code,
          description: serviceRateCode?.data?.description,
          createdAt: serviceRateCode?.data?.date_created,
          modifiedAt: serviceRateCode?.data?.date_updated,
          username_modified: serviceRateCode?.data?.username_modified,
          username_created: serviceRateCode?.data?.username_created,
          status:
            serviceRateCode?.data?.status === 'published'
              ? 'active'
              : 'inactive',
        };
        // const formatData = {
        //   ...serviceRes.data,
        // };
        setSelectedValue(formatData.status);
        setSelectedHotelIds(formatData.hotel);
        setTimeout(() => {
          form.setFieldsValue(formatData);
        }, 800);
      }
    } catch (error) {
      console.error('Error fetching guest info:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };
  useEffect(() => {
    if (open && id) {
      fetchById(id);
    }
  }, [open, id]);

  const handleChange = (e: any) => {
    setSelectedValue(e.target.value);
  };
  useEffect(() => {
    if (nameInputed) {
      form.setFieldsValue({
        fullName:
          typeof nameInputed === 'object' &&
          nameInputed !== null &&
          'fullName' in nameInputed
            ? nameInputed.fullName
            : nameInputed,
      });
    }
    if (phoneInputed) {
      form.setFieldsValue({ phone: phoneInputed });
    }
  }, [nameInputed, phoneInputed]);

  const options = [
    { label: 'active', value: 'active' },
    { label: 'inactive', value: 'inactive' },
  ];

  const handleOk = async (force: boolean = false) => {
    setErrorCode(false);
    const dataForm = await form.validateFields();
    var statusIn = selectedValue == 'active' ? 'published' : 'draft';
    setShowAlert(false);
    const formatData: any = {
      ...omit(dataForm, ['createdAt', 'createdBy', 'modifiedBy', 'modifiedAt']),
      hotel: Number(dataForm.hotel),
      status: isAdd ? 'published' : statusIn,
      sort: null,
      room_Type: Array.isArray(dataForm.room_Type)
        ? dataForm.room_Type.map((id: any) => ({ room_type_id: id }))
        : [],
    };
    var rate_code = formatData?.rate_code;
    var hotelId = formatData?.hotel;
    const response = await getRateCodeByCode(rate_code, hotelId);
    if (response?.data.length > 0) {
      if (id != response?.data[0].id) {
        setErrorCode(true);
        return;
      }
    }
    if (id) {
      const updateServiceRes = await updateRateCode(
        { ...formatData, username_modified: userName },
        id
      );

      if (updateServiceRes.data) {
        message.success('Edit rate code successfully!');

        setOpen(!open);
        onFinish &&
          onFinish({
            formatData,
            id: id,
          });
        resetForm();
      } else {
        message.error('Edit rate code error!');
      }
    } else {
      const createServiceRes = await createNewRateCode({
        ...formatData,
        username_created: userName,
      });
      if (createServiceRes.data) {
        message.success('Create rate code successfully!');
        setOpen(!open);
        onFinish && onFinish(formatData);
        resetForm();
      } else {
        message.error('Create rate code error!');
      }
    }
  };
  const handleChangeSelectedHotel = (e: any) => {
    resetSelect();
    setSelectedHotelIds(e);
  };
  const handleCancel = () => {
    setErrorCode(false);
    form.resetFields();
    resetForm();
    setOpen(!open);
    setShowAlert(false);
    onCancel && onCancel();
  };
  const requiredPhone = () => {
    if (sourcePopup === 'main') return true;
    if (sourcePopup === 'sharing' || sourcePopup === 'master') return false;
    return false;
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
              <MyButton onClick={() => handleOk(false)}>Save</MyButton>
            )}
          </>
        }>
        <Form form={form} layout="vertical" disabled={isViewMode}>
          <Row gutter={16}>
            <Col
              span={24}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <MyCardContent className="add-package-plan">
                <Row gutter={[16, 16]}>
                  <Col
                    xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                    sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                    md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                  >
                    <InputBasic
                      disabled={isViewMode}
                      errorState={errCode}
                      errorMessage={'Rate code exists'}
                      label="Rate Code"
                      name="rate_code"
                      rules={[
                        {
                          pattern: /^[a-zA-Z0-9_-]+$/,
                          message: 'Invalid rate code',
                        },
                      ]}
                      isCode
                      loading={loading}
                      required
                      form={form}
                    />
                  </Col>
                  <Col
                    xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                    sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                    md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                  >
                    <MyFormItem
                      label="Hotel"
                      name="hotel"
                      // form={form}
                      required={true}
                      disabled={isViewMode}>
                      <SingleSelectSearchCustom
                        disabled={isViewMode}
                        onChange={handleChangeSelectedHotel}
                        options={hotelList}
                      />
                    </MyFormItem>
                    {/* <SelectBasic
                      noInitValue
                      loading={loading}
                      onChange={handleChangeSelectedHotel}
                      disabled={isViewMode}
                      label="Hotel"
                      name="hotel"
                      options={hotelList}
                      required
                      form={form}
                    /> */}
                  </Col>
                  <Col
                    xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                    sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                    md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                  >
                    <MyFormItem
                      label="Market Segment"
                      name="market_segment"
                      // form={form}
                      disabled={
                        selectedHotelIds == '' ||
                        selectedHotelIds == undefined ||
                        isViewMode
                      }
                      required={true}>
                      <SingleSelectSearchCustom options={marketSegmentList} />
                    </MyFormItem>
                    {/* <SelectBasic
                      noInitValue
                      loading={loading}
                      label="Market Segment"
                      name="market_segment"
                      options={marketSegmentList}
                      required
                      // form={form}
                    /> */}
                  </Col>
                  <Col
                    xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                    sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                    md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                  >
                    <SelectRoomType
                      name="room_Type"
                      isDisabled={
                        selectedHotelIds == '' ||
                        selectedHotelIds == undefined ||
                        isViewMode
                      }
                      options={roomTypeList}
                      required
                      maxWidth="300px"
                      // form={form}
                    />
                  </Col>
                  <Col
                    xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                    sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                    md={24} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={24} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={24} // Chiếm 19/24 phần màn hình cực lớn (xl)
                  >
                    <InputBasic
                      disabled={isViewMode}
                      label="Description"
                      name="description"
                      loading={loading}
                    />
                  </Col>
                </Row>
              </MyCardContent>
              {isShowOverView && (
                <MyCardContent
                  title="OVERVIEW INFORMATION"
                  className="text-gray f-z-12">
                  <OverviewPersonal
                    handleChangeRadio={handleChange}
                    disabled={isViewMode}
                    selectedValue={selectedValue}
                    loading={loading}
                    options={optionsOverView}
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

export default RateCodeCru;
