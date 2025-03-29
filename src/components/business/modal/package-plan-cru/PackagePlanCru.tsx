import React, { CSSProperties, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { MyCardContent } from '@/components/basic/card-content';
import { Row, Col, Form, message, CollapseProps } from 'antd';
import { MyModal } from '@/components/basic/modal';
import { InputBasic } from '../../input';
import { SelectRoomType, SelectService } from '../../select';
import OverviewPersonal from '../service-info-cru/components/OverviewPersonal';
import { TableBasic } from '@/components/basic/table';
import { MyCollapse } from '@/components/basic/collapse';
import SelectBasic from '../../select/SelectBasic';
import './PackagePlanCru.less';
import { ISource } from '@/utils/formatSelectSource';
import {
  createPackagePlan,
  getPackagePlanByCode,
  getPackagePlanItem,
  updatePackagePlan,
} from '@/api/features/packagePlan';
import { getServiceByHotelID } from '@/api/features/service';
import { set } from 'lodash';
import { getRoomTypeByHotelID } from '@/api/features/roomType';
import { is } from '@/utils/is';
import { optionsOverView } from '@/constants/page';
import { SingleSelectSearchCustom } from '@/components/basic/select';
import { MyFormItem } from '@/components/basic/form-item';

const PackagePlanCru: React.FC<{
  id?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish?: (value: any) => void;
  onCancel?: () => void;
  title: string;
  setPageData?: (data: any) => void;
  onBack?: () => void;
  isShowContinues?: boolean;
  isViewMode?: boolean;
  switchEditMode?: () => void;
  isShowOverView?: boolean;
  hotelList: ISource[];
  sourcePopup: 'main' | 'sharing' | 'master';
  isAdd?: boolean;
}> = ({
  id,
  open,
  hotelList,
  onFinish,
  onCancel,
  title,
  setPageData,
  setOpen,
  isShowContinues = false,
  isViewMode = false,
  switchEditMode,
  isShowOverView = true,
  onBack,
  sourcePopup,
  isAdd = false,
}) => {
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [dataTableService, setDataTableService] = useState([]);
  const [dataTableRoomType, setDataTableRoomType] = useState([]);
  const [optionsService, setOptionsService] = useState<ISource[]>([]);
  const [optionsRoomType, setOptionsRoomType] = useState<ISource[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<any>();
  const [selectedServices, setSelectedServices] = useState<any>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<any>([]);
  const [serviceList, setServiceList] = useState<any>([]);
  const [roomTypeList, setRoomTypeList] = useState<any>([]);
  const [errCode, setErrorCode] = useState<boolean>(false);
  const userName = localStorage.getItem('username');

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setSelectedHotel(null);
      setSelectedServices([]);
      setSelectedRoomTypes([]);
      setDataTableService([]);
      setDataTableRoomType([]);
    }
  }, [open]);
  const fetchById = async (id: string | undefined) => {
    if (!id) return;
    try {
      setLoading(true);
      const packagePlanRes = await getPackagePlanItem(id.toString());
      if (packagePlanRes) {
        const formatData = {
          hotel: packagePlanRes?.data?.hotel?.id,
          code: packagePlanRes?.data?.code,
          name: packagePlanRes?.data?.name,
          description: packagePlanRes?.data?.description,
          createdAt: packagePlanRes?.data?.date_created,
          modifiedAt: packagePlanRes?.data?.date_updated,
          status:
            packagePlanRes?.data?.status === 'published'
              ? 'active'
              : 'inactive',
          username_modified: packagePlanRes?.data?.username_modified,
          username_created: packagePlanRes?.data?.username_created,
        };
        const dataTablePackage = packagePlanRes.data.service.map(
          (item: any) => ({
            id: item?.service_id?.id,
            code: item?.service_id?.code,
            service: item?.service_id?.name,
            adultPrice: item?.service_id?.adult_price,
            over6YearsPrice: item?.service_id?.over_6_years_price,
            under6YearsPrice: item?.service_id?.under_6_years_price,
            description: item?.service_id?.description,
          })
        );
        const dataTableRoomType = packagePlanRes.data.room_types.map(
          (item: any) => ({
            id: item?.room_type_id?.id,
            code: item?.room_type_id?.code,
            roomType: item?.room_type_id?.name,
          })
        );
        const serviceIds = dataTablePackage.map((item: any) => item.id);
        const roomTypeIds = dataTableRoomType.map((item: any) => item.id);
        setSelectedHotel(packagePlanRes?.data?.hotel?.id);
        setDataTableRoomType(dataTableRoomType);
        setDataTableService(dataTablePackage);
        setSelectedRoomTypes(roomTypeIds);
        setSelectedServices(serviceIds);
        setTimeout(() => {
          form.setFieldsValue({
            ...formatData,
            service: serviceIds,
            roomType: roomTypeIds,
          });
        }, 10);
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

  const getSevices = async (id: any) => {
    const res = await getServiceByHotelID(id);
    if (res && res.data.length > 0) {
      const data: ISource[] = res.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
      setServiceList(res.data);
      setOptionsService(data);
    }
  };

  const getRoomTypes = async (id: any) => {
    const res = await getRoomTypeByHotelID(id);
    if (res && res.data.length > 0) {
      const data: ISource[] = res.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
      setRoomTypeList(res.data);
      setOptionsRoomType(data);
    }
  };

  useEffect(() => {
    if (selectedHotel) {
      getSevices(selectedHotel);
      getRoomTypes(selectedHotel);
    } else {
      setOptionsService([]);
      setOptionsRoomType([]);
    }
    form.resetFields(['service', 'roomType']);
  }, [selectedHotel]);

  useEffect(() => {
    if (!loading && selectedServices.length > 0) {
      const filteredServices = serviceList.filter((service: any) =>
        selectedServices.includes(service.id)
      );

      const formattedServices = filteredServices
        .map((item: any) => ({
          id: item?.id,
          code: item?.code,
          service: item?.name,
          adultPrice: item?.adult_price,
          over6YearsPrice: item?.over_6_years_price,
          under6YearsPrice: item?.under_6_years_price,
          description: item?.description,
        }))
        .sort((a: any, b: any) => a.code.localeCompare(b.code)); // Sắp xếp theo code ABC

      setDataTableService(formattedServices);
    } else {
      setDataTableService([]);
    }
  }, [selectedServices, loading]);

  useEffect(() => {
    if (!loading && selectedRoomTypes.length > 0) {
      const filteredRoomTypes = roomTypeList.filter((roomType: any) =>
        selectedRoomTypes.includes(roomType.id)
      );

      const formattedRoomTypes = filteredRoomTypes
        .map((item: any) => ({
          id: item?.id,
          code: item?.code,
          roomType: item?.name,
        }))
        .sort((a: any, b: any) => a.code.localeCompare(b.code));

      setDataTableRoomType(formattedRoomTypes);
    } else {
      setDataTableRoomType([]);
    }
  }, [selectedRoomTypes, loading]);

  const handleSave = async () => {
    setErrorCode(false);
    console.log('useName', userName);
    const dataForm = await form.validateFields();
    const roomTypes = dataForm.roomType.map((roomTypeId: number) => ({
      room_type_id: roomTypeId,
    }));

    const services = dataForm.service.map((serviceId: number) => ({
      service_id: serviceId,
    }));
    var statusIn = selectedValue == 'active' ? 'published' : 'draft';
    const dataBody = {
      ...(isAdd ? { status: 'published' } : { status: statusIn }),
      sort: null,
      code: dataForm.code,
      name: dataForm.name,
      description: dataForm.description,
      hotel: dataForm.hotel,
      room_types: roomTypes,
      service: services,
    };
    const response = await getPackagePlanByCode(dataBody.code, dataBody.hotel);

    if (response?.data.length > 0) {
      if (id != response?.data[0].id) {
        setErrorCode(true);
        return;
      }
    }

    const res = isAdd
      ? await createPackagePlan({ ...dataBody, username_created: userName })
      : id
      ? await updatePackagePlan(
          { ...dataBody, username_modified: userName },
          id
        )
      : null;
    if (res && res?.data) {
      if (isAdd) {
        message.success('Create package plan successfully!');
      } else {
        message.success('Edit package plan successfully!');
      }
      handleOk();
    }
  };

  const handleOk = () => {
    form.resetFields();
    setOpen(false);
    onFinish && onFinish(2);
  };

  const serviceColumns: any = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 86,
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Adult Price',
      dataIndex: 'adultPrice',
      key: 'adultPrice',
      render: (value: number) => {
        return value ? Number(value)?.toLocaleString() : ''; // Chuyển giá trị thành chuỗi với dấu phẩy ngăn cách
      },
    },
    {
      title: 'Over 6 Years Price',
      dataIndex: 'over6YearsPrice',
      key: 'over6YearsPrice',
      render: (value: number) => {
        return value ? Number(value)?.toLocaleString() : ''; // Chuyển giá trị thành chuỗi với dấu phẩy ngăn cách
      },
    },
    {
      title: 'Under 6 Years Price',
      dataIndex: 'under6YearsPrice',
      key: 'under6YearsPrice',
      render: (value: number) => {
        return value ? Number(value)?.toLocaleString() : ''; // Chuyển giá trị thành chuỗi với dấu phẩy ngăn cách
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const roomTypeColumns: any = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 190,
    },
    {
      title: 'Room Type',
      dataIndex: 'roomType',
      key: 'roomType',
    },
  ];

  const handleCancel = () => {
    setErrorCode(false);
    form.resetFields();
    setOpen(!open);
    onCancel && onCancel();
  };

  const getItems: (
    panelStyle: CSSProperties
  ) => CollapseProps['items'] = panelStyle => [
    {
      key: '1',
      label: 'SERVICE',
      children: (
        <>
          <Row gutter={[16, 16]}>
            <Col
              xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
              sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
              md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
              lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
              xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
            >
              <SelectService
                required
                options={optionsService}
                disabled={selectedHotel == null || isViewMode}
                onChange={setSelectedServices}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <TableBasic
              dataSource={dataTableService ? dataTableService : []}
              columns={serviceColumns}
            />
          </Row>
        </>
      ),
      style: panelStyle,
    },
    {
      key: '2',
      label: 'ROOM TYPE',
      children: (
        <>
          <Row gutter={[16, 16]}>
            <Col
              xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
              sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
              md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
              lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
              xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
            >
              <SelectRoomType
                isDisabled={selectedHotel == null || isViewMode}
                required
                options={optionsRoomType}
                name="roomType"
                onChange={setSelectedRoomTypes}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <TableBasic
              dataSource={dataTableRoomType}
              columns={roomTypeColumns}
            />
          </Row>
        </>
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
              <MyButton onClick={switchEditMode}>Edit</MyButton>
            ) : (
              <MyButton onClick={handleSave}>Save</MyButton>
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
                    <MyFormItem
                      label="Hotel"
                      name="hotel"
                      form={form}
                      required={true}
                      disabled={isViewMode}>
                      <SingleSelectSearchCustom
                        disabled={isViewMode}
                        options={hotelList}
                        onChange={setSelectedHotel}
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
                      disabled={isViewMode}
                      errorState={errCode}
                      errorMessage={'Code exists'}
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
                </Row>
              </MyCardContent>
              <MyCollapse
                className="collapse-service"
                getItems={getItems}
                accordion={false}
                activeKey={['1', '2']}
              />
              {isShowOverView && (
                <MyCardContent
                  title="OVERVIEW INFORMATION"
                  className="text-gray f-z-12">
                  <OverviewPersonal
                    form={form}
                    disabled={isViewMode}
                    handleChangeRadio={handleChange}
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

export default PackagePlanCru;
