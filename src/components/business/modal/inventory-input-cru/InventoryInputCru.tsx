import React, { CSSProperties, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { MyCardContent } from '@/components/basic/card-content';
import { Row, Col, Form, message, Button, Divider } from 'antd';
import { MyModal } from '@/components/basic/modal';
import { SelectRoomType } from '../../select';
import OverviewPersonal from '../service-info-cru/components/OverviewPersonal';
import SelectBasic from '../../select/SelectBasic';
import './InventoryInputCru.less';
import {
  createNewRateCode,
  getRateCodeByCode,
  getRateCodeItem,
  updateRateCode,
} from '@/api/features/rateCode';
import { ISource } from '@/utils/formatSelectSource';
import { getRoomTypeByHotelId2 } from '@/api/features/roomType';
import { getMarketSegmentByHotelId } from '@/api/features/marketSegment';
import { omit } from 'lodash';
import { optionsOverView } from '@/constants/page';
import DatePickerSingle from '../../date-picker/DatePickerSingle';
import { TableBasic } from '@/components/basic/table';
import { CollapseProps } from 'antd/lib';
import { ReactComponent as DeleteSvg } from '@/assets/icons/ic-delete.svg';
import { ReactComponent as ImportSvg } from '@/assets/icons/ic_import.svg';
import { MyCollapse } from '@/components/basic/collapse';
import { DatepickerFromToWithoutborder } from '../../date-picker';
import { MultipleSelectWithoutBorder } from '@/components/basic/select';
import { getColumns } from './inventorySetting.columns';

const InventoryInputCru: React.FC<{
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
  hotelList: ISource[];
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
  const [selectedHotelIds, setSelectedHotelIds] = useState<string | null>('0');
  const [roomTypeList, setRoomTypeList] = useState<ISource[]>([]);
  const [marketSegmentList, setMarketSegmentList] = useState<ISource[]>([]);
  const [errCode, setErrorCode] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [fromTo, setFromTo] = useState<[string, string] | null>(null);
  const [roomTypeOptions, setRoomTypeOptions] = useState<ISource[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<any>([]);
  const [mainTableSelectedRowKeys, setMainTableSelectedRowKeys] = useState<React.Key[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

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
  
  useEffect(() => {
    const roomType = [
      {name: 'Delux 1', id: 1},
      {name: 'Delux 2', id: 2},
    ]
    const initialColumns = getColumns(
      roomType
    );
    setColumns(initialColumns);
  }, []);

  const fetchRomType = async () => {
    try {
      const roomTypeRes = await getRoomTypeByHotelId2(selectedHotelIds);
      console.log('chec2222222k roomTypeRes', roomTypeRes, selectedHotelIds);
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

  console.log('check selected hotel', selectedHotelIds);
  const fetMarketSegment = async () => {
    try {
      const marketSegmentRes = await getMarketSegmentByHotelId(
        selectedHotelIds
      );
      console.log(
        'chec2222222k marketSegmentRes',
        marketSegmentRes,
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
          CreatedBy: serviceRateCode?.data?.user_created,
          ModifiedBy: serviceRateCode?.data?.user_updated,
          status:
            serviceRateCode?.data?.status === 'published'
              ? 'active'
              : 'inactive',
        };
        // const formatData = {
        //   ...serviceRes.data,
        // };
        console.log('formatDataformatDataformatData', formatData);
        console.log('check marrr', formatData.market_segment);
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
  console.log('checkkroomTypeList', roomTypeList);
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
    if (isAdd) {
      var rate_code = formatData?.rate_code;
      var hotelId = formatData?.hotel;
      const response = await getRateCodeByCode(rate_code, hotelId);
      if (response?.data.length > 0) {
        setErrorCode(true);
        message.error('Service exists');
        return;
      }
    }
    if (id) {
      const updateServiceRes = await updateRateCode(formatData, id);

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
      const createServiceRes = await createNewRateCode(formatData);
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
  const handleChangeSelectedHotel = (e: any) => {
    resetSelect();
    setSelectedHotelIds(e);
    console.log('check  e select', e);
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
    console.log(sourcePopup);
    if (sourcePopup === 'main') return true;
    if (sourcePopup === 'sharing' || sourcePopup === 'master') return false;
    return false;
  };

  const mainTableRowSelection = {
		selectedRowKeys: mainTableSelectedRowKeys,
		onChange: (selectedRowKeys: React.Key[]) => {
			setMainTableSelectedRowKeys(selectedRowKeys);
		},
	};

  const getItems: (
    panelStyle: CSSProperties
  ) => CollapseProps['items'] = panelStyle => [
    {
      key: '1',
      label: 'INVENTORY SETTING',
      children: (
        <>
          <Row gutter={[16, 16]}>
            <Col
              xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
              sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
              md={24} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
              lg={24} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
              xl={24} // Chiếm 19/24 phần màn hình cực lớn (xl)
            >
              <div className="inventory-setting-header">
                <div className="inventory-setting-btns">
                  <Button
                    className="custom-btn"
                    icon={<DeleteSvg height={16} width={16} />}
                    type="text">
                    <span>Delete</span>
                  </Button>
                  <div className='divider'></div>
                  <Button
                    className="custom-btn"
                    icon={<ImportSvg height={16} width={16} />}
                    type="text">
                    <span>Import</span>
                  </Button>
                </div>
                <div className="inventory-setting-search">
                  <DatepickerFromToWithoutborder
                    arrDeptDate={dateRange}
                    onChange={setFromTo}
                  />
                  {/* <Divider type="vertical" /> */}
                  <div className='divider'></div>
                  <MultipleSelectWithoutBorder
                    options={roomTypeOptions}
                    prefix="Room Type:"
                    onChange={setSelectedRoomType}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <TableBasic dataSource={[]} columns={columns} rowSelection={mainTableRowSelection} rowKey='id'/>
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
                    md={8} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={8} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={8} // Chiếm 19/24 phần màn hình cực lớn (xl)
                  >
                    <SelectBasic
                      noInitValue
                      loading={loading}
                      onChange={handleChangeSelectedHotel}
                      disabled={isViewMode}
                      label="Hotel"
                      name="hotel"
                      options={hotelList}
                      required
                      form={form}
                    />
                  </Col>
                  <Col
                    xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                    sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                    md={8} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={8} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={8} // Chiếm 19/24 phần màn hình cực lớn (xl)
                  >
                    <SelectRoomType
                      name="room_Type"
                      isDisabled={isViewMode}
                      options={roomTypeList}
                      required
                      maxWidth="300px"
                      // form={form}
                    />
                  </Col>
                  <Col
                    xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                    sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                    md={8} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={8} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={8} // Chiếm 19/24 phần màn hình cực lớn (xl)
                  >
                    <DatePickerSingle />
                  </Col>
                </Row>
              </MyCardContent>
              <MyCollapse
                getItems={getItems}
                accordion={false}
                activeKey={['1']}
              />

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

export default InventoryInputCru;
