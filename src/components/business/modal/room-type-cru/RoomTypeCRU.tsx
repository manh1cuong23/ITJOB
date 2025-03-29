import React, { useCallback, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { MyCardContent } from '@/components/basic/card-content';
import { Row, Col, Form, message } from 'antd';
import { MyModal } from '@/components/basic/modal';
import { omit, set } from 'lodash';
import { InputBasic } from '../../input';
import ProfileUpdate from '../update-profile/ProfileUpdate';
import { ISource } from '@/utils/formatSelectSource';
import {
  createNewService,
  getServiceByCode,
  getServiceItem,
  updateService,
} from '@/api/features/service';
import { optionsOverView } from '@/constants/page';
import InputValueString from '../../input/inputValueString';
import {
  formatNumberFields,
  removeDotsFromSelectedFields,
} from '@/utils/formatInput';
import { SingleSelectSearchCustom } from '@/components/basic/select';
import { MyFormItem } from '@/components/basic/form-item';
import OverviewPersonal from '../service-info-cru/components/OverviewPersonal';
import SelectBasic from '../../select/SelectBasic';
import MyInputNumber from '@/components/basic/input/InputNumber';
import { UploadBasic } from '../../uploads';

const RoomTypeCRU: React.FC<{
  id?: string;
  open: boolean;
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
  isAdd?: boolean;
  hotelList: ISource[];
  isViewMode?: boolean;
  switchEditMode?: () => void;
  setGuestSelected?: (data: any) => void;
  isShowOverView?: boolean;
  sourcePopup: 'main' | 'sharing' | 'master';
}> = ({
  id,
  open,
  onFinish,
  onCancel,
  title,
  hotelList,
  setPageData,
  nameInputed,
  phoneInputed,
  setOpen,
  isAdd,
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
  const [errCode, setErrorCode] = useState<boolean>(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const resetForm = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (!id) {
      resetForm();
    }
  }, [id]);

  const fetchById = async (id: string | undefined) => {
    if (!id) return;
    resetForm();
    try {
      setLoading(true);
      const serviceRes = await getServiceItem(id.toString());
      if (serviceRes) {
        let formatData = {
          hotel: serviceRes?.data?.hotel?.id,
          code: serviceRes?.data?.code,
          name: serviceRes?.data?.name,
          description: serviceRes?.data?.description,
          adult_price: serviceRes?.data?.adult_price,
          over_6_years_price: serviceRes?.data?.over_6_years_price,
          under_6_years_price: serviceRes?.data?.under_6_years_price,
          createdAt: serviceRes?.data?.date_created,
          modifiedAt: serviceRes?.data?.date_updated,
          username_modified: serviceRes?.data?.username_modified,
          username_created: serviceRes?.data?.username_created,
          status:
            serviceRes?.data?.status === 'published' ? 'active' : 'inactive',
        };
        // const formatData = {
        //   ...serviceRes.data,
        // };
        // console.log()
        const fields = [
          'adult_price',
          'over_6_years_price',
          'under_6_years_price',
        ];
        formatData = formatNumberFields(formatData, fields);
        form.setFieldsValue(formatData);
        setSelectedValue(formatData.status);
      }
    } catch (error) {
      console.error('Error fetching guest info:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
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

  const getTitle = (_title: string) => {
    return isShowContinues ? (
      <>
        <MyButton
          buttonType="outline"
          onClick={() => {
            setOpen(!open);
            if (onBack) onBack();
          }}
          icon={<BackSvg width={16} height={16} />}
          style={{ padding: '4px', boxShadow: 'none', marginRight: '10px' }}
        />
        {_title}
      </>
    ) : (
      _title
    );
  };

  const handleOk = async (force: boolean = false) => {
    setErrorCode(false);
    const userName = localStorage.getItem('username');
    let dataForm = await form.validateFields();
    const fields = ['adult_price', 'over_6_years_price', 'under_6_years_price'];
    dataForm = removeDotsFromSelectedFields(dataForm, fields);
    var statusIn = selectedValue == 'active' ? 'published' : 'draft';
    setShowAlert(false);

    let formatData: any = {
      ...omit(dataForm, ['createdAt', 'createdBy', 'modifiedBy', 'modifiedAt']),
      hotel: Number(dataForm.hotel),
      status: isAdd ? 'published' : statusIn,
      // username_created:isAdd '',
      sort: null,
    };
    console.log('check data form ', formatData);
    var code = formatData?.code;
    var hotelId = formatData?.hotel;
    const response = await getServiceByCode(code, hotelId);

    if (response?.data.length > 0) {
      console.log('response', response);
      console.log('id', id);
      if (id != response?.data[0].id) {
        setErrorCode(true);
        return;
      }
    }

    if (id) {
      formatData = { ...formatData, username_modified: userName };
      const updateServiceRes = await updateService(formatData, id);

      if (updateServiceRes.data) {
        message.success('Edit service successfully!');

        setOpen(!open);
        onFinish &&
          onFinish({
            formatData,
            id: id,
          });
        resetForm();
      } else {
        message.error('Edit service error!');
      }
    } else {
      formatData = { ...formatData, username_created: userName };
      const createServiceRes = await createNewService(formatData);
      console.log('createServiceRes', createServiceRes);
      if (createServiceRes.data) {
        message.success('Create service successfully!');
        setOpen(!open);
        onFinish && onFinish(formatData);
        resetForm();
      } else {
        message.error('Create service error!');
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setErrorCode(false);
    resetForm();
    setOpen(!open);
    setShowAlert(false);
    onCancel && onCancel();
  };
  const requiredPhone = () => {
    console.log(sourcePopup);
    if (sourcePopup === 'main') return true;
    if (sourcePopup === 'sharing' || sourcePopup === 'master') return false;
    return false;
  };
  return (
    <>
      <MyModal
        width={880}
        title={getTitle(title)}
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
              span={12}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <MyCardContent
              title="Introduction information"
              className="text-gray f-z-8"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <InputBasic
                  disabled={isViewMode}
                    name={'code'}
                    label="Code"
                    required
                    loading={false}
                    form={form}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <InputBasic
                    disabled={isViewMode}
                    label="Name"
                    name="name"
                    loading={false}
                    required
                    form={form}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <SelectBasic required disabled={isViewMode} name="hotel" label="Hotel" />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <InputBasic disabled={isViewMode} name="description" label="Description" />
                </Col>
              </Row>
            </MyCardContent>
            <MyCardContent
              title="Pax Setting"
              className="text-gray f-z-8"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <MyFormItem
                    name={'baseAdult'}
                    label={'Base Adult'}
                    initialValue={1}
                    disabled={isViewMode}
                  >
                    <MyInputNumber
                      min={1}
                      // max={Number(cardData?.availableRooms)}
                    />
                  </MyFormItem>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <MyFormItem
                    name={'baseChild'}
                    label={'Base Child'}
                    initialValue={1}
                    disabled={isViewMode}
                  >
                    <MyInputNumber
                      min={1}
                      // max={Number(cardData?.availableRooms)}
                    />
                  </MyFormItem>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <MyFormItem
                    name={'maxAdult'}
                    label={'Max Adult'}
                    initialValue={1}
                    disabled={isViewMode}
                  >
                    <MyInputNumber
                      min={1}
                      // max={Number(cardData?.availableRooms)}
                    />
                  </MyFormItem>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <MyFormItem
                    name={'maxChild'}
                    label={'Max Child'}
                    initialValue={1}
                    disabled={isViewMode}
                  >
                    <MyInputNumber
                      min={1}
                      // max={Number(cardData?.availableRooms)}
                    />
                  </MyFormItem>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <MyFormItem
                    name={'roomSize'}
                    label={'Room Size'}
                    initialValue={1}
                    disabled={isViewMode}
                  >
                    <MyInputNumber
                      min={1}
                      // max={Number(cardData?.availableRooms)}
                    />
                  </MyFormItem>
                </Col>
                </Row>
            </MyCardContent>
            </Col>
            <Col
            span={12}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <MyCardContent title="Image" className="text-gray f-z-12 stay-info">
              <span style={{ color: '#1C1917', fontWeight: '500' }}>
                Room Type Image
              </span>
              <Row gutter={16} style={{ height: '100%' }}>
                <Col span={8}>
                  <UploadBasic
                    name="hotelImage1"
                    label="Click to upload"
                    placeholder=""
                  />
                </Col>
                <Col span={8}>
                  <UploadBasic
                    name="hotelImage2"
                    label="Click to upload"
                    placeholder=""
                  />
                </Col>
                <Col span={8}>
                  <UploadBasic
                    name="hotelImage3"
                    label="Click to upload"
                    placeholder=""
                  />
                </Col>
                <Col span={8}>
                  <UploadBasic
                    name="hotelImage4"
                    label="Click to upload"
                    placeholder=""
                  />
                </Col>
                <Col span={8}>
                  <UploadBasic
                    name="hotelImage5"
                    label="Click to upload"
                    placeholder=""
                  />
                </Col>
                <Col span={8}>
                  <UploadBasic
                    name="hotelImage6"
                    label="Click to upload"
                    placeholder=""
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
      <ProfileUpdate
        visible={showUpdateProfile}
        onCancel={() => {
          setShowUpdateProfile(false);
        }}
        onOk={() => handleOk(true)}
        title="ID no is existed. Do you want to update information of the profile?"
      />
    </>
  );
};

export default RoomTypeCRU;
