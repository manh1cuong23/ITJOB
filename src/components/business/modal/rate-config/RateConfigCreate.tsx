import React, { CSSProperties, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { MyCardContent } from '@/components/basic/card-content';
import { Row, Col, Form, CollapseProps, message } from 'antd';
import { MyModal } from '@/components/basic/modal';
import { InputBasic } from '../../input';
import { SelectRoomType } from '../../select';
import OverviewPersonal from '../service-info-cru/components/OverviewPersonal';
import SelectBasic from '../../select/SelectBasic';
import './RateConfigCru.less';
import { MyCollapse } from '@/components/basic/collapse';
import RateSetting from '../rate-setting/RateSetting';
import RateAjustment from '../rate-adjustment/RateAjustment';
import { ISource } from '@/utils/formatSelectSource';
import { getRateCodeByHotel } from '@/api/features/rateCode';
import { getRoomTypeByHotelId2 } from '@/api/features/roomType';
import { getPackagePlanByHotelId } from '@/api/features/packagePlan';
import { CombinedData, InputData } from './type';
import { RateAjustmentNew } from '../rate-adjustment-new';
import { convertInputPost, groupData } from './convertData';
import { omit } from 'lodash';
import { createRateConfig } from '@/api/features/rateConfig';
import { dataSourceDayType, dataSourceSeason } from '../rate-adjustment/column';

function transformData(data: InputData[]): ISource[] {
  return data.map(item => ({
    label: item.rate_code ? item.rate_code : item.name || 'Unnamed', // Gán tên ưu tiên theo code, name
    value: item.code || item.rate_code, // Giá trị value dựa trên trường code
    disabled: item.status !== 'published', // Disabled nếu status khác "published"
    id: item.id, // Lấy id nếu tồn tại
    status: item?.status,
  }));
}
function combineData(
  rateCode: ISource[],
  roomType: ISource[],
  packagePlan: ISource[]
): CombinedData[] {
  const result: CombinedData[] = [];
  let counter = 1; // Biến đếm để tạo ID tăng dần

  rateCode.forEach(rate => {
    roomType.forEach(room => {
      packagePlan.forEach(plan => {
        result.push({
          id: counter++, // Gán id và tăng dần
          rateCode: rate,
          roomType: room,
          packagePlan: plan,
          cost_rate: '', // Giá trị mặc định là chuỗi rỗng
          rack_rate: '', // Giá trị mặc định là chuỗi rỗng
          distribution_rate: '', // Giá trị mặc định là chuỗi rỗng
        });
      });
    });
  });

  return result;
}

const RateConfigCreate: React.FC<{
  id?: string;
  open: boolean;
  onFinish?: (value: any) => void;
  onCancel?: () => void;
  title: string;
  setPageData?: (data: any) => void;
  isViewMode?: boolean;
  dataConfig?: any;
  switchEditMode?: () => void;
  isShowOverView?: boolean;
  hotelList: ISource[];
  selectedHotelSearch?: string | undefined | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sourcePopup: 'main' | 'sharing' | 'master';
  forceUpdate?: number;
}> = ({
  id,
  open,
  onFinish,
  onCancel,
  title,
  forceUpdate,
  setPageData,
  isViewMode = false,
  switchEditMode,
  isShowOverView = true,
  setOpen,
  dataConfig,
  selectedHotelSearch,
  hotelList,
  sourcePopup,
}) => {
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isErrorSettingRequire, setIsErrorSetting] = useState<boolean>(false);
  const [selectedValueRadio, setSelectedValueRadio] = useState<
    string | undefined
  >(undefined);
  const [isErrorPriorityOccupancy, setIsErrorPriorityOccupancy] = useState<
    boolean
  >(false);
  const [isErrorPriorityDayType, setIsErrorPriorityDayType] = useState<boolean>(
    false
  );
  const [isErrorPrioritySeason, setIsErrorPrioritySeason] = useState<boolean>(
    false
  );
  const [rateCode, setRateCode] = useState<ISource[]>([]);
  const [roomType, setRoomType] = useState<ISource[]>([]);
  const [dataSource, setdataSource] = useState<CombinedData[] | undefined>([]);
  const [packagePlan, setPackagePlan] = useState<ISource[]>([]);
  const [criteria, setCriteria] = useState<any>({
    dayType: false,
    season: false,
    occupancy: false,
  });
  const handleChangeRadio = (e: any) => {
    setSelectedValue(e.target.value);
  };
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);
  useEffect(() => {
    form.setFieldValue('hotel', selectedHotelSearch);
  }, [forceUpdate]);
  useEffect(() => {
    const fetchRateCodeByHotelId = async () => {
      if (selectedHotelSearch) {
        const res = await getRateCodeByHotel(selectedHotelSearch);
        console.log('res rateCode', res?.data);
        if (res?.data && res?.data.length > 0) {
          setRateCode(transformData(res.data));
        }
      }
    };
    const fetchRoomTypeByHotelId = async () => {
      if (selectedHotelSearch) {
        const res = await getRoomTypeByHotelId2(selectedHotelSearch);
        console.log('res setRoomType', res?.data);

        if (res?.data && res?.data.length > 0) {
          setRoomType(transformData(res.data));
        }
      }
    };

    const fetchPackagePlanByHotelId = async () => {
      if (selectedHotelSearch) {
        const res = await getPackagePlanByHotelId(selectedHotelSearch);
        console.log('res setPackagePlan', res?.data);
        if (res?.data && res?.data.length > 0) {
          setPackagePlan(transformData(res.data));
        }
      }
    };
    fetchPackagePlanByHotelId();
    fetchRateCodeByHotelId();
    fetchRoomTypeByHotelId();
  }, [selectedHotelSearch]);
  const handleChange = (e: any) => {
    setSelectedValue(e.target.value);
  };

  const options = [
    { label: 'Active', value: 'A' },
    { label: 'Inactive', value: 'I' },
  ];
  const resetCheckAjust = () => {
    setIsErrorSetting(false);
    setIsErrorPriorityOccupancy(false);
    setIsErrorPrioritySeason(false);
    setIsErrorPriorityDayType(false);
  };
  // const dataDayType=[
  //   {
  //     type:''
  //   }
  // ]
  const handleOk = async (force: boolean = false) => {
    try {
      resetCheckAjust();
      const { season, dayType, occupancy } = criteria;
      // Khởi tạo mảng với tất cả các trường cần kiểm tra
      let fieldDelete = Object.entries(criteria)
        .filter(([key, value]) => !value) // Chỉ giữ các cặp key-value có value là false
        .map(([key]) => key); // Lấy key
      const dataForm = await form.validateFields();
      console.log('validata', dataForm);
      if (dataForm) {
        setIsErrorSetting(false);
        const omitData: any = omit(groupData(dataForm), fieldDelete);
        if (!dayType) {
          omitData.dayType = dataSourceDayType;
        }
        if (!season) {
          omitData.season = dataSourceSeason;
        }
        console.log('omitData,', omitData);
        console.log('check v', convertInputPost(omitData));
        console.log('convertInputPost(omitData)', convertInputPost(omitData));

        const res = await createRateConfig(convertInputPost(omitData));

        if (res && res.data) {
          message.success('Create rate configuration successfully');
          setOpen(!open);
          onFinish && onFinish(true);
          form.resetFields();
        }
      }
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'errorFields' in error
      ) {
        const err = error as { errorFields: any[] }; // Ép kiểu chính xác hơn

        resetCheckAjust();
        err.errorFields.forEach((field: any) => {
          if (field.name[0].includes('rates')) {
            setIsErrorSetting(true);
          } else if (field.name[0].includes('priority_occupancy')) {
            setIsErrorPriorityOccupancy(true);
          } else if (field.name[0].includes('priority_season')) {
            setIsErrorPrioritySeason(true);
          } else if (field.name[0].includes('priority_day_type')) {
            setIsErrorPriorityDayType(true);
          }
        });
      }
    }

    // form.resetFields();
  };
  useEffect(() => {
    if (rateCode && roomType && packagePlan) {
      const data = combineData(rateCode, roomType, packagePlan);

      console.log('chec data', data);
      if (data) {
        setdataSource(data);
      } else {
        setdataSource([]);
      }
    }
  }, [rateCode, roomType, packagePlan, selectedHotelSearch]);
  const handleCancel = () => {
    resetCheckAjust();
    form.resetFields();
    onCancel && onCancel();
  };
  const handleGetCriteria = (arrayCheckCriteria: any) => {};
  const getItems: (
    panelStyle: CSSProperties
  ) => CollapseProps['items'] = panelStyle => [
    {
      key: '1',
      label: 'RATE SETTING',
      children: (
        <>
          {/* <RateSetting
            isViewMode={isViewMode}
            form={form}
            forceUpdate={forceUpdate}
            selectedHotel={selectedHotelSearch}
            dataSourceNew={dataSource}
          /> */}
          {/* <span style={{ color: 'red', padding: '0 8px' }}>
            {isErrorSettingRequire
              ? 'Cost Rate, Rack Rate and Distribution Rate are required for Rate Setting'
              : ''}
          </span> */}
        </>
      ),
      style: panelStyle,
    },
    {
      key: '2',
      label: 'RATE ADJUSTMENT',
      children: (
        <RateAjustmentNew
          isNotDataInOccupancy
          setIsNotDataInOccupancy={[]}
          isErrorPriorityOccupancy={isErrorPriorityOccupancy}
          isErrorPrioritySeason={isErrorPrioritySeason}
          isErrorPriorityDayType={isErrorPriorityDayType}
          setCriteria={setCriteria}
          forceUpdate={forceUpdate}
          isViewMode={isViewMode}
          form={form}
          data={[]}
        />
      ),
      style: panelStyle,
    },
  ];

  return (
    <>
      <MyModal
        width={1020}
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
        }
      >
        <Form form={form} layout="vertical" disabled={isViewMode}>
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
                      disabled={true}
                      label="Hotel"
                      name="hotel"
                      options={hotelList}
                      noInitValue
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
                    handleChangeRadio={handleChange}
                    selectedValue={selectedValue}
                    loading={loading}
                    options={options}
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

export default RateConfigCreate;
