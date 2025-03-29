import { MyButton } from '@/components/basic/button';
import { MyCardContent } from '@/components/basic/card-content';
import { MyModal } from '@/components/basic/modal';
import { Col, Form, Input, message, Popover, Row } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { MyFormItem } from '@/components/basic/form-item';
import { IFormViewHotel } from './HotelCRU.types';
import InputBasic from '../../input/InputBasic';
import SelectCountry from '../../select/SelectCountry';
import SelectProvince from '../../select/SelectProvince';
import { UploadBasic } from '../../uploads';
import SelectBasic from '../../select/SelectBasic';
import MyInputNumber from '@/components/basic/input/InputNumber';
import SelectCommune from '../../select/SelectCommue';
import SelectDistrict from '../../select/SelectDistrict';
import { ReactComponent as PlusSvg } from '@/assets/icons/ic_plus_circle.svg';
import { ReactComponent as PencilSvg } from '@/assets/icons/ic_pencil.svg';
import { ReactComponent as DeleteSvg } from '@/assets/icons/ic-delete.svg';
import OverviewPersonal from '../service-info-cru/components/OverviewPersonal';
import { optionsOverView } from '@/constants/page';
import './HotelCRU.less';
import { MyInput } from '@/components/basic/input';
import InputValue from '../../input/inputValue';
import { UploadFile } from 'antd/lib';
import {
  createHotel,
  getCountry,
  getDistrict,
  getHotelByID,
  getProvince,
  getWards,
  updateHotel,
} from '@/api/features/masterData';

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel?: () => void;
  formData: IFormViewHotel;
  isViewMode?: boolean;
  switchEditMode?: () => void;
  isShowOverView?: boolean;
  id?: string;
}
const HotelCRU = (props: IProps) => {
  const {
    id,
    open,
    onCancel,
    setOpen,
    formData,
    isViewMode = false,
    switchEditMode,
    isShowOverView,
  } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('New Hotel');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [customFields, setCustomFields] = useState<string[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState<string>('');
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [popoverEdit, setPopoverEdit] = useState<boolean>(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [countryLabel, setCountryLabel] = useState('');
  const [provinceLabel, setProvinceLabel] = useState('');
  const [districtLabel, setDistrictLabel] = useState('');
  const [wardLabel, setWardLabel] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [address, setAddress] = useState('');
  const [imgs, setImgs] = useState<any>();

  const handleUploadSuccess = (fileUrl: string) => {
    setUploadedImages(prev => [...prev, fileUrl]);
  };

  const handleUpload = (value: string) => {
    setFileList(prev => [...prev, value]);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await getCountry();
      setCountries(
        res.data.map((item: any) => ({
          label: item.name,
          value: item.code,
          id: item.id,
        }))
      );
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setSelectedCountry(selectedCountry);
      const fetchProvinces = async () => {
        const res = await getProvince(selectedCountry);
        setProvinces(
          res.data.map((item: any) => ({
            label: item.name,
            value: item.code,
            id: item.id,
          }))
        );
        setDistricts([]);
        setWards([]);
      };
      fetchProvinces();
    } else {
      setProvinces([]);
      setDistricts([]);
      setWards([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedProvince) {
      setSelectedProvince(selectedProvince);
      const fetchDistricts = async () => {
        const res = await getDistrict(selectedProvince);
        setDistricts(
          res.data.map((item: any) => ({
            label: item.name,
            value: item.code,
            id: item.id,
          }))
        );

        setWards([]);
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      setSelectedDistrict(selectedDistrict);
      const fetchWards = async () => {
        const res = await getWards(selectedDistrict);
        setWards(
          res.data.map((item: any) => ({
            label: item.name,
            value: item.code,
            id: item.id,
          }))
        );
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const handleCancel = () => {
    setOpen(!open);
    form.resetFields();
    onCancel && onCancel();
  };

  useEffect(() => {
    formData && form.setFieldsValue(formData);
  }, [formData]);

  const fetchHotelByID = async () => {
    if (!id) return;
    setLoading(true);
    const res = await getHotelByID(id);
    if (res && res.data) {
      setSelectedCountry(res.data?.country?.code);
      setSelectedProvince(res.data?.province?.code);
      setSelectedDistrict(res.data?.district?.code);
      setSelectedWard(res.data?.ward?.code);
      setImgs(res.data?.images);
      const imageFields = res.data?.images?.reduce(
        (acc: any, image: any, index: number) => {
          acc[`hotelImage${index}`] = image.directus_files_id;
          return acc;
        },
        {}
      );

      const fields =
        res.data?.contact_extend.map((item: any) => item?.label) || [];
      setCustomFields(fields);

      const customFieldsObject = res.data?.contact_extend.reduce(
        (acc: any, item: any) => {
          if (item?.label) {
            acc[item.label] = item.value;
          }
          return acc;
        },
        {} as Record<string, any>
      );

      const data = {
        ...res.data,
        ...imageFields,
        ...customFieldsObject,
        country: res.data?.country?.code,
        provinceCode: res.data?.province?.code,
        districtCode: res.data?.district?.code,
        wardCode: res.data?.ward?.code,
        logo: res.data?.thumbnail_image?.id,
      };
      form.setFieldsValue(data);
    }
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  useEffect(() => {
    if (open) {
      if (id) {
        if (isViewMode) {
          setTitle('View Hotel');
        } else {
          setTitle('Edit Hotel');
        }
        fetchHotelByID();
      } else {
        setTitle('New Hotel');
      }
    } else {
      setUploadedImages([]);
      setCustomFields([]);
      setFileList([]);
      form.resetFields();
    }
  }, [open]);

  useEffect(() => {
    console.log(fileList);
  }, [fileList]);

  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(d => d.value === selectedCountry);
      setCountryLabel(country ? country.label : '');
    } else {
      setCountryLabel('');
      setProvinceLabel('');
      setDistrictLabel('');
      setWardLabel('');
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedProvince && selectedCountry) {
      const provice = provinces.find(p => p.value === selectedProvince);
      setProvinceLabel(provice ? provice.label : '');
    } else {
      setProvinceLabel('');
      setDistrictLabel('');
      setWardLabel('');
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCountry && selectedDistrict && selectedProvince) {
      const district = districts.find(d => d.value === selectedDistrict);
      setDistrictLabel(district ? district.label : '');
    } else {
      setDistrictLabel('');
      setWardLabel('');
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
    } else {
      setWardLabel('');
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
  }, [wardLabel, districtLabel, provinceLabel, countryLabel, address]);

  useEffect(() => {
    form.setFieldsValue({ fullAddress });
  }, [fullAddress]);

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

  const handleChangeProvince = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict(null);
    form.setFieldsValue({ districtCode: null, wardCode: null });
  };
  const handleChangeDistrict = (value: string) => {
    setSelectedDistrict(value);
    form.setFieldsValue({ wardCode: null });
  };

  const handleOk = async () => {
    const dataForm = await form.validateFields();
    const countryData = countries.find(
      country => country.value === dataForm.country
    );
    const country = countryData ? countryData.id : null;
    const provinceData = provinces.find(
      country => country.value === dataForm.provinceCode
    );
    const province = provinceData ? provinceData.id : null;
    const districtData = districts.find(
      country => country.value === dataForm.districtCode
    );
    const district = districtData ? districtData.id : null;
    const wardData = wards.find(country => country.value === dataForm.wardCode);
    const ward = wardData ? wardData.id : null;
    const newImageIds = Object.keys(dataForm)
      .filter(key => key.startsWith('hotelImage'))
      .map(key => dataForm[key]);

    const images: {
      create: { directus_files_id: string; hotel_id?: string }[];
      update: { directus_files_id: string; hotel_id: string; id: number }[];
      delete: { id: number }[];
    } = {
      create: [],
      update: [],
      delete: [],
    };
    const validNewImageIds = fileList.filter(id => id && id.trim());
    const imagesCreate = newImageIds.filter((item: any) =>
      validNewImageIds.includes(item)
    );
    images.create = imagesCreate.map(item =>
      id
        ? { directus_files_id: item, hotel_id: id }
        : { directus_files_id: item }
    );

    if (id) {
      const validNewImageIds = newImageIds.filter(id => id && id.trim());
      images.delete = imgs.filter(
        (item: any) => !validNewImageIds.includes(item.directus_files_id)
      );
    }

    const contact_extend = Object.keys(dataForm)
      .filter(key => key.startsWith('field'))
      .map(label => {
        const field_label = dataForm[label];
        return {
          label: field_label,
          value: dataForm[field_label],
        };
      })
      .filter(item => item.value !== undefined);

    const formateData = {
      code: dataForm.code,
      short_name: dataForm.short_name,
      full_name: dataForm.full_name,
      hotel_type: dataForm.hotel_type,
      star_rating: dataForm.star_rating,
      tax_code: dataForm.tax_code,
      checkin_time: dataForm.checkin_time,
      checkout_time: dataForm.checkout_time,
      room_size: dataForm.room_size,
      description: dataForm.description,
      contact_phone: dataForm.contact_phone,
      email: dataForm.email,
      website: dataForm.website,
      bank_account: dataForm.bank_account,
      bank_name: dataForm.bank_name,
      address: dataForm.address,
      full_address: dataForm.full_address,
      thumbnail_image: dataForm?.logo ? dataForm?.logo : null,
      country,
      province,
      district,
      ward,
      images,
      contact_extend,
      status: 'published',
    };
    if (id) {
      const res = await updateHotel(id, formateData);
      if (res && res.data) {
        message.success('Edit hotel successfully');
        onCancel?.();
      }
    } else {
      const res = await createHotel(formateData);
      if (res && res.data) {
        message.success('Create hotel successfully');
        onCancel?.();
      }
    }
  };

  const renderUpload = useMemo(() => {
    return (
      <Row gutter={16} style={{ height: 'auto' }}>
        {uploadedImages.map((image, index) => (
          <Col span={8} key={index}>
            <UploadBasic
              name={`hotelImage${index}`}
              label="Click to upload"
              placeholder=""
              disabled={isViewMode}
            />
          </Col>
        ))}

        {uploadedImages.length < 6 && (
          <Col span={8}>
            <UploadBasic
              name={`hotelImage${uploadedImages.length}`}
              label="Click to upload"
              placeholder=""
              disabled={isViewMode}
              onChange={fileUrl => handleUploadSuccess(fileUrl)}
              onUpload={handleUpload}
            />
          </Col>
        )}
      </Row>
    );
  }, [uploadedImages, open]);

  const isFieldNameDuplicate = (fieldName: string, excludeField?: string) => {
    const allFields = [
      ...customFields
        .filter(field => field !== excludeField)
        .map(field => field.toLowerCase()),
      ...Object.keys(formData).map(field => field.toLowerCase()),
    ];
    return allFields.includes(fieldName.toLowerCase());
  };

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    if (isFieldNameDuplicate(newFieldName)) {
      return message.error('Name field already exists');
    }
    setCustomFields([...customFields, newFieldName.trim()]);
    setNewFieldName('');
    setPopoverVisible(false);
  };

  const handleUpdateField = () => {
    if (!newFieldName.trim()) return;
    if (isFieldNameDuplicate(newFieldName, editingField!)) {
      return message.error('Name field already exists');
    }
    setCustomFields(prev =>
      prev.map(field => (field === editingField ? newFieldName : field))
    );
    setPopoverEdit(false);
    setEditingField(null);
  };

  const handleEditField = (oldField: string) => {
    setEditingField(oldField);
    setNewFieldName(oldField);
    setPopoverEdit(true);
  };

  const handleDeleteField = (fieldToDelete: string) => {
    setCustomFields(prev => prev.filter(field => field !== fieldToDelete));
  };

  return (
    <MyModal
      width={900}
      title={title}
      open={open}
      onCancel={handleCancel}
      footer={
        <>
          <MyButton onClick={handleCancel} buttonType="outline">
            Close
          </MyButton>
          {isViewMode ? (
            <MyButton onClick={switchEditMode}>Edit</MyButton>
          ) : (
            <MyButton onClick={() => handleOk()} loading={loading}>
              Save
            </MyButton>
          )}
        </>
      }
    >
      <Form form={form} layout="vertical" disabled={isViewMode}>
        <Row gutter={16}>
          <Col
            span={12}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <MyCardContent
              title="General information"
              className="text-gray f-z-12"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <InputBasic
                    name={'code'}
                    label="Code"
                    required
                    isName
                    regex={/[~!@$%^&(){}\[\]|'";<>]/}
                    disabled={isViewMode}
                    loading={loading}
                    form={form}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <InputBasic
                    disabled={isViewMode}
                    label="Short Name"
                    name="short_name"
                    loading={loading}
                    required
                    form={form}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <InputBasic
                    disabled={isViewMode}
                    label="Full Name"
                    name="full_name"
                    loading={loading}
                    required
                    form={form}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <SelectBasic
                    name="hotel_type"
                    label="Hotel Type"
                    disabled={isViewMode}
                    options={[
                      {
                        label: 'Luxury Hotel: Khách sạn sang trọng 5 sao',
                        value: 'luxury_hotel',
                      },
                      {
                        label: 'Upscale Hotel: Khách sạn cao cấp 4 sao',
                        value: 'upscale_hotel',
                      },
                      {
                        label: 'Midscale Hotel: Khách sạn tầm trung 3 sao',
                        value: 'midscale_hotel',
                      },
                      {
                        label: 'Budget Hotel: Khách sạn bình dân 1-2 sao',
                        value: 'budget_hotel',
                      },
                    ]}
                    loading={loading}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <InputBasic
                    disabled={isViewMode}
                    label="Star Rate"
                    name="star_rating"
                    regex={/[^0-9.]/}
                    loading={loading}
                    form={form}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <InputBasic
                    disabled={isViewMode}
                    label="Tax Code"
                    name="tax_code"
                    loading={loading}
                    form={form}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <InputBasic
                    disabled={isViewMode}
                    label="Check-in Time"
                    name="checkin_time"
                    loading={loading}
                    form={form}
                    placeholder="Hh:mm"
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <InputBasic
                    disabled={isViewMode}
                    label="Check-out Time"
                    name="checkout_time"
                    loading={loading}
                    form={form}
                    isTime
                    placeholder="Hh:mm"
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <MyFormItem
                    name="room_size"
                    label="Room Size"
                    initialValue={1}
                    disabled={isViewMode}
                  >
                    <MyInputNumber
                      min={1}
                      disabled={isViewMode}
                      // max={Number(cardData?.availableRooms)}
                    />
                  </MyFormItem>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <InputBasic
                    name="description"
                    label="Description"
                    disabled={isViewMode}
                    loading={loading}
                  />
                </Col>
              </Row>
            </MyCardContent>

            <MyCardContent
              title="contact information"
              className="text-gray f-z-12"
            >
              <Row gutter={16}>
                <Col span={24}>
                  <InputBasic
                    name="contact_phone"
                    label="FO Phone"
                    disabled={isViewMode}
                    loading={loading}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <InputBasic
                    name="email"
                    label="Email"
                    disabled={isViewMode}
                    loading={loading}
                  />
                </Col>
                <Col span={12}>
                  <InputBasic
                    name="website"
                    label="Website"
                    disabled={isViewMode}
                    loading={loading}
                  />
                </Col>
              </Row>
              {customFields.map((field, index) => {
                const name = field.toLowerCase().replace(/\s+/g, '_');
                return (
                  <Row gutter={16} key={index} align="middle">
                    <Col span={24}>
                      <Popover
                        content={
                          <div>
                            <span style={{ fontWeight: 500, display: 'block' }}>
                              Field Label
                            </span>
                            <Input
                              value={newFieldName}
                              onChange={e => setNewFieldName(e.target.value)}
                              onPressEnter={handleUpdateField}
                            />
                          </div>
                        }
                        trigger="click"
                        open={popoverEdit && editingField === field}
                        onOpenChange={visible => {
                          if (!visible) {
                            setPopoverVisible(false);
                            setEditingField(null);
                          }
                        }}
                      >
                        <MyFormItem name={name} label={field}>
                          <MyInput
                            value={newFieldName}
                            onChange={e => setNewFieldName(e.target.value)}
                            onPressEnter={handleAddField}
                          />
                        </MyFormItem>
                        <InputValue
                          isHideErrorMessage={true}
                          placeholder="-"
                          hidden
                          defaultValue={field}
                          disabled={isViewMode}
                          form={form}
                          name={`field[${index}].label`}
                        />
                      </Popover>
                    </Col>
                    <Col span={4} className="custom-field">
                      <PencilSvg
                        className="btn-edit"
                        width={15}
                        height={15}
                        onClick={() => handleEditField(field)}
                      />
                      <DeleteSvg
                        className="btn-delete"
                        width={15}
                        height={15}
                        onClick={() => handleDeleteField(field)}
                      />
                    </Col>
                  </Row>
                );
              })}
              <Row gutter={16}>
                <Col span={24} style={{ paddingTop: '12px' }}>
                  <Popover
                    content={
                      <div>
                        <span
                          style={{
                            fontWeight: 500,
                            marginBottom: 4,
                            display: 'block',
                          }}
                        >
                          Field Label
                        </span>
                        <MyInput
                          value={newFieldName}
                          onChange={e => setNewFieldName(e.target.value)}
                          onPressEnter={handleAddField}
                        />
                      </div>
                    }
                    trigger="click"
                    open={popoverVisible}
                    onOpenChange={visible => {
                      setPopoverVisible(visible);
                      if (visible) setNewFieldName('');
                    }}
                  >
                    <MyButton
                      buttonType="outline"
                      className="btn-add-field"
                      disabled={isViewMode}
                      icon={<PlusSvg width={14} height={14} />}
                    >
                      Add
                    </MyButton>
                  </Popover>
                </Col>
              </Row>
            </MyCardContent>

            <MyCardContent
              title="PAYMENT information "
              className="text-gray f-z-10"
            >
              <Row gutter={16}>
                <Col span={24}>
                  <InputBasic
                    name="bank_account"
                    label="Bank Account"
                    form={form}
                    disabled={isViewMode}
                    loading={loading}
                  />
                </Col>
                <Col span={24}>
                  <InputBasic
                    name="bank_name"
                    label="Bank Name"
                    disabled={isViewMode}
                    loading={loading}
                  />
                </Col>
              </Row>
            </MyCardContent>
          </Col>

          <Col
            span={12}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <MyCardContent
              title="address information"
              className="text-gray f-z-12"
            >
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
                    // disabled={isViewMode}
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
                    onChange={setSelectedWard}
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
                    onChange={setAddress}
                    loading={loading}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <InputBasic
                    placeholder=""
                    name="fullAddress"
                    label="Full Address"
                    disabled={true}
                    loading={loading}
                  />
                </Col>
              </Row>
            </MyCardContent>
            <MyCardContent title="Image" className="text-gray f-z-12 stay-info">
              <span style={{ color: '#1C1917', fontWeight: '500' }}>Logo</span>
              <Row gutter={16} style={{ height: '125px' }}>
                <Col span={24}>
                  <UploadBasic
                    name="logo"
                    label="Click to upload"
                    placeholder="SVG, PNG, JPG, file max 5MB"
                    disabled={isViewMode}
                    onUpload={handleUpload}
                  />
                </Col>
              </Row>
              <span style={{ color: '#1C1917', fontWeight: '500' }}>
                Hotel Image
              </span>
              {renderUpload}
            </MyCardContent>
            {isShowOverView && (
              <MyCardContent
                title="OVERVIEW INFORMATION"
                className="text-gray f-z-12"
              >
                <OverviewPersonal
                  handleChangeRadio={() => {}}
                  disabled={isViewMode}
                  // selectedValue={selectedValue}
                  loading={loading}
                  options={optionsOverView}
                />
              </MyCardContent>
            )}
          </Col>
        </Row>
      </Form>
    </MyModal>
  );
};

export default HotelCRU;
