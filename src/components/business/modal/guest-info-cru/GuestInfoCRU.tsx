import React, { useCallback, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { ReactComponent as AlertSvg } from '@/assets/icons/ic_circle_alert.svg';
import { MyCardContent } from '@/components/basic/card-content';
import { Row, Col, Form, message } from 'antd';
import { MyRadio } from '@/components/basic/radio';
import { MyModal } from '@/components/basic/modal';
import InputPhone from '../../input/InputPhone';
import InputEmail from '../../input/InputEmail';
import SelectSalutation from '../../select/SelectSalutation';
import SelectCountry from '../../select/SelectCountry';
import SelectProvince from '../../select/SelectProvince';
import SelectDistrict from '../../select/SelectDistrict';
import SelectIdType from '../../select/SelectIdType';
import {
  createNewGuestInfo,
  getGuestInfo,
  updateGuestInfo,
} from '@/api/features/guestInfo';
import dayjs, { Dayjs } from 'dayjs';
import {
  getCountry,
  getDistrict,
  getProvince,
  getWards,
} from '@/api/features/masterData';
import SelectCommune from '../../select/SelectCommue';
import RadiosStatus from '../../radios/RadiosStatus';
import { MyFormItem } from '@/components/basic/form-item';
import { UploadBasic } from '../../uploads';
import { omit, set } from 'lodash';
import { InputBasic } from '../../input';
import DatepickerBasic from '../../date-picker/DatepickerBasic';
import InputRemark from '../../input/InputRemark';
import { isValidText } from '@/utils/common';
import ProfileUpdate from '../update-profile/ProfileUpdate';

const GuestInfoCRU: React.FC<{
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
  isViewMode?: boolean;
  switchEditMode?: () => void;
  setGuestSelected?: (data: any) => void;
  sourcePopup: 'main' | 'sharing' | 'master';
}> = ({
  id,
  open,
  onFinish,
  onCancel,
  title,
  setPageData,
  nameInputed,
  phoneInputed,
  setOpen,
  setNamePhone,
  isShowContinues = false,
  isViewMode = false,
  switchEditMode,
  onBack,
  setGuestSelected,
  setNewGuestWithDetail,
  sourcePopup,
}) => {
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState('');
  const [identityNo, setIdentityNo] = useState('');
  const [issueDate, setIssueDate] = useState<string | null>(null);
  const [expiredDate, setExpiredDate] = useState<string | null>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [countryLabel, setCountryLabel] = useState('');
  const [provinceLabel, setProvinceLabel] = useState('');
  const [districtLabel, setDistrictLabel] = useState('');
  const [wardLabel, setWardLabel] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(d => d.value === selectedCountry);
      setCountryLabel(country ? country.label : '');
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedProvince && selectedCountry) {
      const provice = provinces.find(p => p.value === selectedProvince);
      setProvinceLabel(provice ? provice.label : '');
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCountry && selectedDistrict && selectedProvince) {
      const district = districts.find(d => d.value === selectedDistrict);
      setDistrictLabel(district ? district.label : '');
    }
  }, [selectedDistrict, selectedProvince]);
  useEffect(() => {
    if (
      selectedCountry &&
      selectedDistrict &&
      selectedProvince &&
      selectedWard
    ) {
      const ward = wards.find(p => p.value === selectedWard);
      setWardLabel(ward ? ward.label : '');
    }
  }, [selectedWard]);

  useEffect(() => {
    const addressComponents = [
      address,
      wardLabel,
      districtLabel,
      provinceLabel,
      countryLabel,
    ];
    setFullAddress(addressComponents.filter(Boolean).join(', '));
    form.setFieldsValue({ fullAddress });
  }, [
    wardLabel,
    districtLabel,
    provinceLabel,
    countryLabel,
    address,
    fullAddress,
  ]);

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
      const guestRes = await getGuestInfo(id.toString());
      if (guestRes) {
        const documents = guestRes.data.documents
          ? JSON.parse(guestRes.data.documents)
          : null;

        const formatData = {
          ...guestRes.data,
          imgFront: documents?.[0]?.file_url,
          imgBack: documents?.[1]?.file_url,
        };

        if (formatData.gender) {
          setSelectedValue(formatData.gender);
        }

        if (formatData.idDate) {
          setIssueDate(formatData.idDate);
        }
        if (formatData.country) {
          const res = await getProvince(formatData.country);
          setProvinces(
            res.data.map((item: any) => ({
              label: item.name,
              value: item.code,
            }))
          );
        }
        if (formatData.provinceCode) {
          const res = await getDistrict(formatData.provinceCode);
          setDistricts(
            res.data.map((item: any) => ({
              label: item.name,
              value: item.code,
            }))
          );
        }
        if (formatData.districtCode) {
          const res = await getWards(formatData.districtCode);
          setWards(
            res.data.map((item: any) => ({
              label: item.name,
              value: item.code,
            }))
          );
        }

        setSelectedCountry(formatData.country);
        setSelectedDistrict(formatData.districtCode);
        setSelectedProvince(formatData.provinceCode);
        setSelectedWard(formatData.wardCode);
        setAddress(formatData.address);
        setExpiredDate(formatData.idExpiryDate);
        form.setFieldsValue(formatData);
        setPhone(formatData.phone);
        setIdentityNo(formatData.idNo);
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
  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      const res = await getCountry();
      setCountries(
        res.data.map((item: any) => ({ label: item.name, value: item.code }))
      );
    };
    fetchCountries();
  }, []);

  // Fetch provinces when selectedCountry changes
  useEffect(() => {
    if (selectedCountry) {
      setSelectedCountry(selectedCountry);
      const fetchProvinces = async () => {
        const res = await getProvince(selectedCountry);
        setProvinces(
          res.data.map((item: any) => ({ label: item.name, value: item.code }))
        );
        setDistricts([]); // Clear districts when country changes
        setWards([]); // Clear wards when country changes
      };
      fetchProvinces();
    } else {
      setProvinces([]);
      setDistricts([]);
      setWards([]);
    }
  }, [selectedCountry]);
  // Fetch districts when selectedProvince changes
  useEffect(() => {
    if (selectedProvince) {
      setSelectedProvince(selectedProvince);
      const fetchDistricts = async () => {
        const res = await getDistrict(selectedProvince);
        setDistricts(
          res.data.map((item: any) => ({ label: item.name, value: item.code }))
        );

        setWards([]); // Clear wards when province changes
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  // Fetch wards when selectedDistrict changes
  useEffect(() => {
    if (selectedDistrict) {
      setSelectedDistrict(selectedDistrict);
      const fetchWards = async () => {
        const res = await getWards(selectedDistrict);
        setWards(
          res.data.map((item: any) => ({ label: item.name, value: item.code }))
        );
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);
  const handleChangeProvince = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict(null);
    form.setFieldsValue({ districtCode: null, wardCode: null });
  };
  const handleChangeDistrict = (value: string) => {
    setSelectedDistrict(value);
    form.setFieldsValue({ wardCode: null });
  };
  const handleChangeCountry = (value: string) => {
    setSelectedCountry(value);
    setSelectedProvince(null);
    setSelectedDistrict(null);
    form.setFieldsValue({
      provinceCode: null,
      districtCode: null,
      wardCode: null,
    });
  };
  const handleChangeWard = (value: string) => {
    setSelectedWard(value);
  };
  const handleIdentityNoChange = (value: string) => {
    setIdentityNo(value);
    setShowAlert(false);
  };
  const handleChangePhone = (value: string) => {
    setPhone(value);
    setShowAlert(false);
  };
  const handleIssueDateChange = (date: string | null) => {
    setIssueDate(date);
  };

  const handleExpireDateChange = (date: string | null) => {
    setExpiredDate(date);
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
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
  ];

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
    if (
      !isValidText(phone) &&
      !isValidText(identityNo) &&
      sourcePopup === 'master'
    ) {
      setShowAlert(true);
      await form.validateFields();
      return;
    }
    const dataForm = await form.validateFields();
    setShowAlert(false);
    const formatData = {
      ...dataForm,
      birthdate: dataForm.birthdate === '' ? null : dataForm.birthdate,
      idDate: dataForm.idDate === '' ? null : dataForm.idDate,
      idExpiryDate: dataForm.idExpiryDate === '' ? null : dataForm.idExpiryDate,
      title: dataForm.salutation,
      documents: JSON.stringify([
        {
          doc_name: 'ImageFront',
          file_url: dataForm.imgFront,
          description: '',
        },
        { doc_name: 'ImageBack', file_url: dataForm.imgBack, description: '' },
      ]),
    };
    if (id) {
      const updateGuest = await updateGuestInfo({
        ...omit(formatData, ['imgFront', 'imgBack']),
        id: id,
        isNotValidatePhone: force,
      });

      if (updateGuest.isSuccess) {
        message.success('Edit guest successfully!');
        if (setGuestSelected) {
          setGuestSelected((pre: any) => ({ ...pre, ...formatData }));
        }
        setNamePhone && setNamePhone(dataForm.fullName, dataForm.phone);
        setPageData &&
          setPageData((prev: any) =>
            prev.map((item: any) => {
              if (item.id == id) {
                return { ...item, ...formatData, id: id };
              }
              return item;
            })
          );
        setOpen(!open);
        onFinish &&
          onFinish({
            ...omit(formatData, ['imgFront', 'imgBack']),
            id: id,
          });
        resetForm();
      } else if (updateGuest.errors[0].code === 499) {
        setShowUpdateProfile(true);
      }
    } else {
      const createGuest = await createNewGuestInfo(
        omit(formatData, ['imgFront', 'imgBack'])
      );
      if (createGuest.isSuccess) {
        message.success('Save guest information successfully!');
        setNamePhone && setNamePhone(formatData.fullName, formatData.phone);
        setNewGuestWithDetail &&
          setNewGuestWithDetail({ ...formatData, id: createGuest.data });
        setOpen(!open);
        onFinish &&
          onFinish({
            ...omit(formatData, ['imgFront', 'imgBack']),
            id: createGuest?.data,
          });
        resetForm();
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    resetForm();
    setIdentityNo('');
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
              span={12}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <MyCardContent
                title="Personal information"
                className="text-gray f-z-12">
                <Row gutter={[16, 16]}>
                  <Col
                    xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                    sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                    md={8} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={8} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={8} // Chiếm 19/24 phần màn hình cực lớn (xl)
                  >
                    <SelectSalutation disabled={isViewMode} loading={loading} />
                  </Col>
                  <Col
                    xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                    sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                    md={16} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={16} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={16} // Chiếm 19/24 phần màn hình cực lớn (xl)
                  >
                    <InputBasic
                      disabled={isViewMode}
                      label="Guest Name"
                      name="fullName"
                      loading={loading}
                      required
                      form={form}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col
                    xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                    sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                    md={24} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={24} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={24} // Chiếm 19/24 phần màn hình cực lớn (xl)
                    className="custom-radio">
                    <Row
                      gutter={16}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Col>
                        <span style={{ color: '#1C1917', fontWeight: 500 }}>
                          Gender
                        </span>
                      </Col>
                      <Col style={{ paddingRight: 0 }}>
                        <MyFormItem
                          name={'gender'}
                          isShowLabel={false}
                          disabled={isViewMode}>
                          <MyRadio
                            options={options}
                            value={selectedValue}
                            onChange={handleChange}
                            loading={loading}
                          />
                        </MyFormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <DatepickerBasic
                      name="birthdate"
                      label="Birthday"
                      disabled={isViewMode}
                      loading={loading}
                      disabledDate={current =>
                        current && current.isAfter(dayjs(), 'day')
                      }
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <InputPhone
                      form={form}
                      placeholder="Enter"
                      disabled={isViewMode}
                      required={requiredPhone()}
                      onChange={handleChangePhone}
                      status={showAlert ? 'error' : ''}
                      loading={loading}
                    />

                    {showAlert ? ( // Hiển thị thông báo nếu cần
                      <div
                        className="h-center gap-5"
                        style={{ justifyContent: 'flex-start' }}>
                        {/* <AlertSvg width={14} height={14} /> */}
                        <p
                          style={{
                            marginLeft: '5px',
                            color: '#ff4d4f',
                            fontSize: '13px',
                          }}>
                          Phone or ID No is required
                        </p>
                      </div>
                    ) : (
                      sourcePopup === 'master' && (
                        <div
                          className="h-center gap-5"
                          style={{ justifyContent: 'flex-start' }}>
                          <AlertSvg width={14} height={14} />
                          <p
                            style={{
                              marginLeft: '5px',
                              fontSize: '13px',
                            }}>
                            Phone or ID No is required
                          </p>
                        </div>
                      )
                    )}
                  </Col>
                  <Col span={12}>
                    <InputEmail
                      form={form}
                      disabled={isViewMode}
                      loading={loading}
                    />
                  </Col>
                </Row>
              </MyCardContent>
              <MyCardContent
                title="address information"
                className="text-gray f-z-12">
                <Row gutter={16}>
                  <Col span={12}>
                    <SelectCountry
                      name="country"
                      options={countries}
                      onChange={handleChangeCountry}
                      disabled={isViewMode}
                      loading={loading}
                    />
                  </Col>
                  <Col span={12}>
                    <SelectProvince
                      name="provinceCode"
                      options={provinces}
                      disabled={!selectedCountry || isViewMode}
                      onChange={handleChangeProvince}
                      loading={loading}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <SelectDistrict
                      options={districts}
                      disabled={!selectedProvince || isViewMode}
                      onChange={handleChangeDistrict}
                      loading={loading}
                    />
                  </Col>
                  <Col span={12}>
                    <SelectCommune
                      name="wardCode"
                      options={wards}
                      disabled={!selectedDistrict || isViewMode}
                      onChange={handleChangeWard}
                      loading={loading}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <InputBasic
                      name="address"
                      label="Detail Address"
                      disabled={isViewMode}
                      onChange={value => setAddress(value)}
                      loading={loading}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <InputBasic
                      name="fullAddress"
                      label="Full Address"
                      disabled={true}
                      loading={loading}
                    />
                  </Col>
                </Row>
              </MyCardContent>
            </Col>
            <Col
              span={12}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <MyCardContent
                title="Document information"
                className="text-gray f-z-12 stay-info">
                <Row gutter={16}>
                  <Col span={12}>
                    <SelectIdType
                      // required={!!identityNo}
                      disabled={isViewMode}
                      loading={loading}
                    />
                  </Col>
                  <Col span={12}>
                    <InputBasic
                      name="idNo"
                      label="ID No"
                      required={requiredPhone()}
                      loading={loading}
                      onChange={handleIdentityNoChange}
                      disabled={isViewMode}
                      status={showAlert ? 'error' : ''}
                    />
                    {showAlert ? ( // Hiển thị thông báo nếu cần
                      <div
                        className="h-center gap-5"
                        style={{ justifyContent: 'flex-start' }}>
                        <p
                          style={{
                            marginLeft: '5px',
                            color: '#ff4d4f',
                            fontSize: '13px',
                          }}>
                          Phone or ID No is required
                        </p>
                      </div>
                    ) : (
                      sourcePopup === 'master' && (
                        <div
                          className="h-center gap-5"
                          style={{ justifyContent: 'flex-start' }}>
                          <AlertSvg width={14} height={14} />
                          <p
                            style={{
                              marginLeft: '5px',
                              fontSize: '13px',
                            }}>
                            Phone or ID No is required
                          </p>
                        </div>
                      )
                    )}
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <InputBasic
                      name="idIssuer"
                      label="Issue Place"
                      loading={loading}
                      disabled={isViewMode}
                      // required={!!identityNo}
                      form={form}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <DatepickerBasic
                      name="idDate"
                      label="Issue Date"
                      // required={!!identityNo}
                      onChange={handleIssueDateChange}
                      loading={loading}
                      disabled={isViewMode}
                      form={form}
                      disabledDate={(current: Dayjs) => {
                        const parsedExpireDate = expiredDate
                          ? dayjs(expiredDate, 'YYYY-MM-DD')
                          : null;
                        const currentDate = dayjs();

                        return (
                          (parsedExpireDate &&
                            (current.isAfter(parsedExpireDate, 'day') ||
                              current.isSame(parsedExpireDate, 'day'))) ||
                          current.isAfter(currentDate, 'day')
                        );
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <DatepickerBasic
                      name="idExpiryDate"
                      label="Expiry Date"
                      // required={!!identityNo}
                      onChange={handleExpireDateChange}
                      loading={loading}
                      disabled={isViewMode}
                      disabledDate={(current: Dayjs) => {
                        const parsedIssueDate = issueDate
                          ? dayjs(issueDate, 'YYYY-MM-DD')
                          : null;
                        return parsedIssueDate
                          ? current.isBefore(parsedIssueDate, 'day') ||
                              current.isSame(parsedIssueDate, 'day')
                          : false;
                      }}
                      form={form}
                    />
                  </Col>
                </Row>
                <span style={{ color: '#1C1917', fontWeight: '500' }}>
                  ID Image
                </span>
                <Row gutter={16} style={{ height: '125px' }}>
                  <Col span={12}>
                    <UploadBasic name="imgFront" disabled={isViewMode} />
                  </Col>
                  <Col span={12}>
                    <UploadBasic name="imgBack" disabled={isViewMode} />
                  </Col>
                </Row>
              </MyCardContent>
              <MyCardContent title="Remark" className="remark text-gray f-z-12">
                <InputRemark
                  name="remark"
                  disabled={isViewMode}
                  loading={loading}
                />
              </MyCardContent>
              {isViewMode && (
                <MyCardContent
                  title="Overvire infomation"
                  className="remark text-gray f-z-12">
                  <Row gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <DatepickerBasic
                        name="createdDate"
                        disabled
                        label="Created Date"
                        loading={loading}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <InputBasic
                        name="createdBy"
                        label="Created By"
                        disabled
                        loading={loading}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <DatepickerBasic
                        name="modifiedDate"
                        disabled
                        label="Modified Date"
                        loading={loading}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <InputBasic
                        name="modifiedBy"
                        label="Modified By"
                        disabled
                        loading={loading}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <RadiosStatus
                        name="status"
                        loading={loading}
                        disabled
                        options={[
                          {
                            label: 'Active',
                            value: 'A',
                          },
                          {
                            label: 'InActive',
                            value: 'I',
                          },
                        ]}
                      />
                    </Col>
                  </Row>
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

export default GuestInfoCRU;
