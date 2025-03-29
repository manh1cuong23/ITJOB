import React, { useCallback, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { MyCardContent } from '@/components/basic/card-content';
import { Row, Col, Form, message } from 'antd';
import { MyModal } from '@/components/basic/modal';
import {
  createNewGuestInfo,
  getGuestInfo,
  updateGuestInfo,
} from '@/api/features/guestInfo';
import { omit, set } from 'lodash';
import { InputBasic } from '../../input';
import DatepickerBasic from '../../date-picker/DatepickerBasic';
import ProfileUpdate from '../update-profile/ProfileUpdate';
import OverviewPersonal from './components/OverviewPersonal';
import { ISource } from '@/utils/formatSelectSource';
import SelectBasic from '../../select/SelectBasic';
import {
  createNewService,
  getServiceByCode,
  getServiceItem,
  updateService,
} from '@/api/features/service';
import InputBasicWithIcon from '../../input/InputBasicNumberWithIcon';
import { request } from '@/utils/request';
import { optionsOverView } from '@/constants/page';
import InputValueString from '../../input/inputValueString';
import {
  formatNumberFields,
  removeDotsFromSelectedFields,
} from '@/utils/formatInput';
import { SingleSelectSearchCustom } from '@/components/basic/select';
import { MyFormItem } from '@/components/basic/form-item';

const ServiceInfoCru: React.FC<{
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
  hotelList: any;
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
  console.log('check open', open);
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
        //   className="custom-modal modal-add"
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
              <MyCardContent className="text-gray f-z-12">
                <Row gutter={[16, 16]}>
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
                      form={form}
                      required={true}
                      disabled={isViewMode}>
                      <SingleSelectSearchCustom
                        disabled={isViewMode}
                        options={hotelList}
                      />
                    </MyFormItem>
                  </Col>
                  <Col
                    xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                    sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                    md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                  >
                    <InputBasic
                      errorState={errCode}
                      errorMessage={'Code exists'}
                      disabled={isViewMode}
                      label="Code"
                      name="code"
                      rules={[
                        {
                          pattern: /^[a-zA-Z0-9_-]+$/,
                          message: 'Invalid code',
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
                    <InputBasic
                      disabled={isViewMode}
                      label="Name"
                      name="name"
                      // isName
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
                    <InputBasic
                      disabled={isViewMode}
                      label="Description"
                      name="description"
                      loading={loading}
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
                    <InputValueString
                      isFormatDolla
                      isShowLabel={true}
                      disabled={isViewMode}
                      label="Adult Price"
                      name="adult_price"
                      isDolla
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
                    <InputValueString
                      disabled={isViewMode}
                      label="Over 6 Years Price"
                      name="over_6_years_price"
                      loading={loading}
                      isFormatDolla
                      isShowLabel={true}
                      isDolla
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
                    <InputValueString
                      isFormatDolla
                      isShowLabel={true}
                      isDolla
                      disabled={isViewMode}
                      label="Under 6 Years Price"
                      name="under_6_years_price"
                      loading={loading}
                      required
                      form={form}
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

export default ServiceInfoCru;
