import React, { useState, useEffect } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { ReactComponent as AddSvg } from '@/assets/icons/ic_plus_room_sharing.svg';
import { MyCardContent } from '@/components/basic/card-content';
import { ReactComponent as Save } from '@/assets/icons/ic_save.svg';
import { ISource } from '@/utils/formatSelectSource';
import SelectBasic from '../../select/SelectBasic';
import InputRemark from '../../input/InputRemark';

import { Col, Row, Form, message } from 'antd';
import { MyModal } from '@/components/basic/modal';
import { DatePickerArrDeptCount } from '../../date-picker';
import {
  createNewGuestInfo,
  getGuestInfo,
  updateGuestInfo,
} from '@/api/features/guestInfo';
import InputPhone from '../../input/InputPhone';
import SelectGuestName from '../../select/SelectGuestName';
import ViewGuestRoomSharing from '../room-sharing-view-guest/ViewGuestRoomSharing';
import { GuestInfoCRU } from '../guest-info-cru';
import RadiosGuestType from '../../radios/RadiosGuestType';
import { omit } from 'lodash';
import { generateUniqueString } from '@/utils/common';

const RoomSharingCRU: React.FC<{
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  title: string;
  setPageData: (data: any) => void;
  onBack?: () => void;
  guestData?: any;
  isView?: boolean;
  arrDeptDate?: [string, string] | null;
  pageData: any[];
}> = ({
  visible,
  onOk,
  onCancel,
  title,
  setPageData,
  onBack,
  guestData,
  isView = false,
  arrDeptDate,
  pageData = [],
}) => {
  const [titl, setTitl] = useState('');
  const [isModal, setIsModal] = useState(false);
  const [isVisible, setVisible] = useState(visible);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [newGuestWithDetail, setNewGuestWithDetail] = useState<any>(null);
  const [isViewGuest, setIsViewGuest] = useState(false);
  const [disabledPhone, setDisabledPhone] = useState(false);
  const [disabledFields, setDisabledFields] = useState(false);
  const [optionsRoomNo, setOptionsRoomNo] = useState<ISource[]>([]);
  const [messageError, setMessageError] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [form] = Form.useForm();

  const showDetailRoomSharing = () => {
    setTitl('Detail Room Sharing');
    setIsModal(true);
    setTimeout(() => {
      setVisible(false);
    }, 100);
  };

  console.log('guestData', pageData);

  useEffect(() => {
    setVisible(visible);
    if (visible) {
      if (isView) {
        setOptionsRoomNo([
          { label: guestData.roomNo, value: guestData.roomNo },
        ]);
        setDisabledFields(true);
      }
      if (guestData) {
        form.setFieldsValue({
          fullName: guestData.fullName,
          phone: guestData.phone,
          guestType: guestData.guestType,
          guest: guestData.guest,
          remark: guestData.remark,
        });
        setSelectedGuest(guestData);
      }
      pageData && setData(pageData);
    } else {
      form.resetFields();
      setDisabledPhone(false);
      setMessageError('');
    }
  }, [visible]);

  const handleOk = () => {
    setIsModal(false);
    setTimeout(() => {
      setVisible(true);
    }, 100);
  };

  const handleCancel = () => {
    setIsModal(false);
    setTimeout(() => {
      setVisible(true);
    }, 100);
  };

  const showViewGuest = () => {
    setIsViewGuest(true);
    setTimeout(() => {
      setVisible(false);
    }, 100);
  };

  const handleCancelViewGuest = () => {
    setIsViewGuest(false);
    setTimeout(() => {
      setVisible(true);
    }, 100);
  };

  const handleBack = () => {
    setIsModal(false);
    setTimeout(() => {
      setVisible(true);
    }, 100);
  };

  const getTitle = (title: string) => {
    return (
      <>
        <MyButton
          buttonType="outline"
          onClick={onBack}
          icon={<BackSvg width={16} height={16} />}
          style={{
            padding: '4px',
            boxShadow: 'none',
            marginRight: '10px',
            height: ' 24px',
            width: ' 24px',
            borderRadius: '4px',
          }}
        />
        {title}
      </>
    );
  };

  const setNamePhone = (name: string, phone: string) => {
    form.setFieldsValue({ fullName: name, phone: phone });
  };

  const handleSave = async () => {
    await form.validateFields();
    const dataForm = {
      ...form.getFieldsValue(),
      fullName:
        typeof form.getFieldsValue().fullName === 'object'
          ? form.getFieldsValue().fullName.fullName
          : form.getFieldsValue().fullName,
    };

    let idGuest: string;
    if (!(selectedGuest || newGuestWithDetail)) {
      if (guestData) {
        dataForm.id = guestData.id;
        const guest = await getGuestInfo(guestData.id);

        const updateGuest = await updateGuestInfo({
          ...guest.data,
          ...dataForm,
        });
        idGuest = updateGuest.data;
      } else {
        const createGuest = await createNewGuestInfo(dataForm);
        idGuest = createGuest.data;
      }
    } else {
      idGuest = selectedGuest?.id || newGuestWithDetail.id;
    }

    const arrivalDate = new Date(dataForm?.arr_dept[0]).toISOString();
    const departureDate = new Date(dataForm?.arr_dept[1]).toISOString();

    const isDuplicate = data.some(item => {
      return (
        item.id === idGuest &&
        item.arrivalDate === arrivalDate &&
        item.departureDate === departureDate
      );
    });

    if (isDuplicate) {
      setMessageError('Duplicate Room Sharing in Booking');
      return;
    } else {
      setMessageError('');
    }

    const guest = await getGuestInfo(idGuest);
    if (guestData) {
      message.success('Edit Room Sharing successfully!');
    } else {
      message.success('Add room sharing successfully!');
    }
    const guestOmit = omit(guest.data, [
      'createdBy',
      'createdDate',
      'deleted',
      'deletedBy',
      'deletedDate',
      'modifiedBy',
      'modifiedDate',
    ]);

    const newGuest = {
      ...guestOmit,
      No: generateUniqueString(),
      arrivalDate: new Date(dataForm?.arr_dept[0]).toISOString(),
      departureDate: new Date(dataForm?.arr_dept[1]).toISOString(),
      remark: dataForm?.remark,
      idType: guest.data.idType,
      guest: dataForm?.guest,
    };

    setNewGuestWithDetail(undefined);
    if (guestData && guestData.id) {
      setPageData((prev: any) =>
        prev.map((item: any) => {
          if (item.id === guestData.id) {
            return {
              ...item,
              arrivalDate: new Date(dataForm?.arr_dept[0]).toISOString(),
              departureDate: new Date(dataForm?.arr_dept[1]).toISOString(),
              remark: dataForm?.remark,
              guest: dataForm?.guest,
            };
          }
          return item;
        })
      );
    } else {
      setPageData((prev: any) => [...prev, newGuest]);
    }
    form.resetFields();
    setSelectedGuest(null);
    onOk();
  };

  const handleCancelThis = () => {
    form.resetFields();
    onCancel();
  };

  const handleChangeGuestName = (value: any) => {
    if (typeof value === 'object' && value !== null && 'phone' in value) {
      setDisabledPhone(true);
      form.setFieldsValue({ phone: value.phone });
      setSelectedGuest(value);
    } else {
      value && setDisabledPhone(false);
      !value && setDisabledPhone(false);
      value && form.setFieldsValue({ phone: '' });
      setSelectedGuest(null);
    }
  };

  const handleSaveContinue = async () => {
    await form.validateFields();

    const dataForm = {
      ...form.getFieldsValue(),
      fullName:
        typeof form.getFieldsValue().fullName === 'object'
          ? form.getFieldsValue().fullName.fullName
          : form.getFieldsValue().fullName,
    };

    let idGuest: string;
    if (!(selectedGuest || newGuestWithDetail)) {
      const createGuest = await createNewGuestInfo(dataForm);
      idGuest = createGuest.data;
    } else {
      idGuest = selectedGuest.id || newGuestWithDetail.id;
    }

    const arrivalDate = new Date(dataForm?.arr_dept[0]).toISOString();
    const departureDate = new Date(dataForm?.arr_dept[1]).toISOString();

    const isDuplicate = data.some(item => {
      return (
        item.id === idGuest &&
        item.arrivalDate === arrivalDate &&
        item.departureDate === departureDate
      );
    });

    if (isDuplicate) {
      setMessageError('Duplicate Room Sharing in Booking');
      return;
    } else {
      setMessageError('');
    }

    const guest = await getGuestInfo(idGuest);
    message.success('Add room sharing successfully!');

    const newGuest = {
      id: idGuest,
      No: generateUniqueString(),
      birthdate: guest.data.birthdate,
      fullName: guest.data.fullName,
      address: guest.data.address,
      phone: guest.data.phone,
      idNo: guest.data.idNo,
      arrivalDate: new Date(dataForm?.arr_dept[0]).toISOString(),
      departureDate: new Date(dataForm?.arr_dept[1]).toISOString(),
      remark: dataForm?.remark,
      IDType: guest.data.idType,
      gender: guest.data.gender,
      title: guest.data.title,
      email: guest.data.email,
      salutation: guest.data.salutation,
      fullAddress: guest.data.fullAddress,
      country: guest.data.country,
      provinceCode: guest.data.provinceCode,
      districtCode: guest.data.districtCode,
      wardCode: guest.data.wardCode,
      idType: guest.data.idType,
      idIssuer: guest.data.idIssuer,
      idDate: guest.data.idDate,
      guest: dataForm?.guest,
      idExpiryDate: guest.data.idExpiryDate,
      documents: guest.data.documents,
    };

    setNewGuestWithDetail(undefined);
    setPageData((prev: any) => [
      ...prev,
      {
        ...newGuest,
      },
    ]);
    setData((prev: any) => [
      ...prev,
      {
        ...newGuest,
      },
    ]);
    form.resetFields();
    setSelectedGuest(null);
    setDisabledPhone(false);
  };

  const options = [
    { label: 'Adult', value: 'adult' },
    { label: 'Under 6 Years', value: 'under_6' },
    { label: 'Over 6 Years', value: 'over_6' },
  ];

  const optionsGuestType = [
    { label: 'Main Guest', value: 'Main Guest' },
    { label: 'Addition Guest', value: 'Addition Guest' },
  ];

  return (
    <>
      <MyModal
        title={getTitle(title)}
        width={600}
        open={isVisible}
        onOk={handleSave}
        onCancel={handleCancelThis}
        centered
        footer={
          <>
            <MyButton onClick={handleCancelThis} buttonType="outline">
              Close
            </MyButton>
            {!guestData && (
              <MyButton
                onClick={handleSaveContinue}
                buttonType="secondary"
                icon={<Save />}>
                Save continue
              </MyButton>
            )}
            <MyButton onClick={handleSave}>Save</MyButton>
          </>
        }>
        <Form layout="vertical" form={form}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Guest infomation */}
            <MyCardContent
              title="Guest infomation"
              className="text-gray f-z-12"
              moreAction={
                <MyButton
                  className="btn-detail"
                  buttonType="outline"
                  icon={<AddSvg />}
                  onClick={() =>
                    selectedGuest ? showViewGuest() : showDetailRoomSharing()
                  }>
                  Detail
                </MyButton>
              }>
              <Row
                className="row-container"
                gutter={[16, 16]}
                style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <SelectGuestName
                    name="fullName"
                    onChange={handleChangeGuestName}
                    form={form}
                    disabled={disabledFields}
                  />
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ marginTop: '2px' }}>
                  <InputPhone
                    disabled={disabledPhone ? disabledPhone : disabledFields}
                    required={false}
                    form={form}
                  />
                </Col>
              </Row>
            </MyCardContent>
            <MyCardContent
              title="Stay Information"
              className="text-gray f-z-12">
              {isView && (
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <SelectBasic
                      label="Room No"
                      disabled={disabledFields}
                      name="roomNo"
                      options={optionsRoomNo}
                      form={form}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <RadiosGuestType
                      options={optionsGuestType}
                      disabled={disabledFields}
                      name="guestType"
                      label="Guest Type"
                      className="guest-type"
                      loading={false}
                    />
                  </Col>
                </Row>
              )}
              <Row gutter={16}>
                <Col span={24}>
                  <RadiosGuestType
                    loading={false}
                    options={options}
                    disabled={disabledFields}
                    name="guest"
                    label="Guest"
                    required={isView ? false : true}
                  />
                </Col>
              </Row>
              <Col md={24} style={{ padding: 0 }}>
                <DatePickerArrDeptCount
                  value={
                    guestData
                      ? [guestData?.arrivalDate, guestData?.departureDate]
                      : [arrDeptDate?.[0], arrDeptDate?.[1]]
                  }
                  disabled={disabledFields}
                  arrDeptDate={arrDeptDate}
                  isReset={!visible}
                  className={messageError ? 'border-error' : ''}
                />
                {messageError && (
                  <div style={{ color: 'red' }}>{messageError}</div>
                )}
              </Col>
            </MyCardContent>
            <MyCardContent title="Remark">
              <InputRemark
                name="remark"
                loading={false}
                disabled={disabledFields}
              />
            </MyCardContent>
          </div>
        </Form>
      </MyModal>
      <GuestInfoCRU
        id={guestData?.id}
        isShowContinues
        setPageData={setPageData}
        nameInputed={form.getFieldValue('fullName')}
        phoneInputed={form.getFieldValue('phone')}
        setNamePhone={setNamePhone}
        setNewGuestWithDetail={setNewGuestWithDetail}
        title={'New Guest Info'}
        open={isModal}
        setOpen={setIsModal}
        onFinish={handleOk}
        onCancel={handleCancel}
        onBack={handleBack}
        sourcePopup="sharing"
      />

      <ViewGuestRoomSharing
        setNamePhone={setNamePhone}
        visible={isViewGuest}
        title="View Guest"
        guestSelected={selectedGuest}
        setGuestSelected={setSelectedGuest}
        onCancel={handleCancelViewGuest}
      />
    </>
  );
};
const checkboxStyle = {
  borderRadius: '8px',
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#000000',
  justifyContent: 'start',
  padding: '2px 6px',
  cursor: 'pointer',
  width: '100%',
  height: '32px',
};

const checkboxInputStyle = {
  appearance: 'none',
  width: '15px',
  height: '15px',
  borderRadius: '50%',
  border: '2px solid #D6D3D1',
  outline: 'none',
  cursor: 'pointer',
  position: 'relative',
};
export default RoomSharingCRU;
