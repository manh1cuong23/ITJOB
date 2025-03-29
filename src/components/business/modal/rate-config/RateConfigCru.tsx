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
import {
  getRateCodeByHotel,
  getRateSettingByHotel,
} from '@/api/features/rateCode';
import { getRoomTypeByHotelId2 } from '@/api/features/roomType';
import { getPackagePlanByHotelId } from '@/api/features/packagePlan';
import { CombinedData, InputData } from './type';
import {
  convertData,
  convertDataRateSetting,
} from '@/containers/rate-code/hook';
import InputValue from '../../input/inputValue';
import {
  compareMap,
  convertInput,
  convertInputPost,
  groupData,
  transformDataIsource,
  transformDataRateSetting,
} from './convertData';
import {
  createRateConfig,
  getRateConfigByHotel,
  updateRateConfig,
} from '@/api/features/rateConfig';
import { RateAjustmentNew } from '../rate-adjustment-new';
import { omit } from 'lodash';
import { dataSourceDayType, dataSourceSeason } from '../rate-adjustment/column';

function combineData(
  rateCode: ISource[],
  roomType: ISource[],
  packagePlan: ISource[]
): CombinedData[] {
  const result: CombinedData[] = [];
  rateCode.forEach(rate => {
    roomType.forEach(room => {
      packagePlan.forEach(plan => {
        result.push({
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

const RateConfigCru: React.FC<{
  id?: string;
  open: boolean;
  setViewModeConfig: (e: boolean) => void;
  onFinish?: (value: any) => void;
  onCancel?: () => void;
  title: string;
  setPageData?: (data: any) => void;
  isViewMode?: boolean;
  switchEditMode?: () => void;
  forceUpdate?: any;
  isShowOverView?: boolean;
  hotelList: ISource[];
  selectedHotelSearch?: string | undefined | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sourcePopup: 'main' | 'sharing' | 'master';
}> = ({
  id,
  open,
  setViewModeConfig,
  onFinish,
  onCancel,
  title,
  setPageData,
  forceUpdate,
  isViewMode = false,
  switchEditMode,
  isShowOverView = true,
  setOpen,
  selectedHotelSearch,
  hotelList,
  sourcePopup,
}) => {
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState('');
  const [selectOcccupancyDeletes, setSelectOcccupancyDeletes] = useState<any>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
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
  const [rateCode, setRateCode] = useState<ISource[]>();
  const [roomType, setRoomType] = useState<ISource[]>();
  const [packagePlan, setPackagePlan] = useState<ISource[]>();
  const [dataSource, setdataSource] = useState<CombinedData[] | undefined>([]);
  const [rateAjust, setRateAjust] = useState([]);
  const [rateSetting, setRateSetting] = useState([]);
  const [rateSettingNew, setRateSettingNew] = useState<any>([]);
  const [dataConfig, setDataConfig] = useState<any>([]);
  const [isCreate, setIsCreate] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotDataInOccupancy, setIsNotDataInOccupancy] = useState<boolean>(
    false
  );

  useEffect(() => {
    if (open) {
      setIsNotDataInOccupancy(false);
      // form.resetFields();
    }
  }, [open]);
  const [criteria, setCriteria] = useState<any>({
    dayType: false,
    season: false,
    occupancy: false,
  });
  useEffect(() => {
    const fetchRateConfigByHotel = async () => {
      setIsLoading(true);
      if (selectedHotelSearch) {
        const res = await getRateConfigByHotel(selectedHotelSearch);
        if (res?.data && res?.data.length > 0) {
          const dataRes = res.data;
          const dataConVert = convertData(res.data);
          console.log('dataConVert', dataConVert);
          setDataConfig(dataConVert);
          setRateSetting(convertDataRateSetting(dataConVert[0]?.rate_settings));

          setSelectedValueRadio(
            dataConVert[0]?.rate_adjustement[0]
              ?.rate_configuration_adjustement_id?.occupancy
          );
          setRateAjust(
            dataConVert[0]?.rate_adjustement[0]
              ?.rate_configuration_adjustement_id
          );
          form.setFieldsValue(dataConVert[0]);
          form.setFieldValue(
            'id_rate_ajust',
            dataConVert[0]?.rate_adjustement[0]?.id
          );
          form.setFieldValue(
            'username_modified',
            dataConVert[0]?.username_modified
          );
          form.setFieldValue(
            'username_created',
            dataConVert[0]?.username_created
          );
          form.setFieldValue(
            'id_rate_ajust_child',
            dataConVert[0]?.rate_adjustement[0]
              ?.id_rate_configuration_adjustement_id
          );
          setSelectedValue(dataConVert[0]?.status);
          console.log('vo day', false);
          setIsCreate(false);
          // setIsLoading(false);
        } else {
          setViewModeConfig(false);
          console.log('vo day', true);

          setIsCreate(true);
        }
        form.setFieldValue('hotel', selectedHotelSearch);
      }
    };
    const fetchRateSettingByHotelId = async () => {
      if (selectedHotelSearch) {
        setIsLoading(true);
        const res = await getRateSettingByHotel(selectedHotelSearch);
        if (res && res?.length > 0) {
          setdataSource(transformDataRateSetting(res));
          // setIsLoading(false);
          // setRateCode(transformDataIsource(res.data));
        }
      }
    };
    if (open) {
      fetchRateSettingByHotelId();
    }
    if (open) {
      fetchRateConfigByHotel();
    }
  }, [open]);

  // useEffect(() => {}, [isCreate, dataConfig, open, isViewMode]);

  // useEffect(() => {
  //   const fetchRateSettingByHotelId = async () => {
  //     if (selectedHotelSearch) {
  //       setIsLoading(true);
  //       console.log('check setting tren');
  //       const res = await getRateSettingByHotel(selectedHotelSearch);
  //       console.log('check setting', res);
  //       if (res && res?.length > 0) {
  //         console.log('check ', transformDataRateSetting(res));
  //         setdataSource(transformDataRateSetting(res));
  //         // setIsLoading(false);
  //         // setRateCode(transformDataIsource(res.data));
  //       }
  //     }
  //   };
  //   if (open) {
  //     console.log('vo day2');
  //     fetchRateSettingByHotelId();
  //   }
  // }, [open, isCreate]);
  console.log('check is create', isCreate);
  useEffect(() => {
    if (
      dataSource &&
      dataSource?.length > 0 &&
      rateSetting.length > 0 &&
      !isCreate
    ) {
      const dataAdd = compareMap(dataSource, rateSetting);
      setRateSettingNew([...rateSetting, ...dataAdd]);
      console.log();
    }
  }, [dataSource, rateSetting, isCreate]);

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
  const handleOk = async (force: boolean = false) => {
    const userName = localStorage.getItem('username');
    try {
      resetCheckAjust();
      const dataForm = await form.validateFields();
      const group_data = groupData(dataForm);
      if (
        group_data &&
        group_data.is_occupancy &&
        group_data.occupancy.length == 0
      ) {
        setIsNotDataInOccupancy(true);
        return;
      }
      console.log('dataForm', dataForm);
      if (!isCreate) {
        const body = convertInput(group_data, selectOcccupancyDeletes);
        console.log('check body', body);
        console.log('check dataForm', dataForm);
        console.log('check groupData(dataForm)', groupData(dataForm));
        const res = await updateRateConfig(
          { ...body, username_modified: userName },
          dataConfig[0].id
        );
        if (res.data) {
          resetCheckAjust();
          message.success('Edit config successfully!');
          setSelectOcccupancyDeletes(null);
          setOpen(!open);
          onFinish && onFinish(true);
          form.resetFields();
        } else {
          message.error('Edit config error!');
        }
      } else {
        const { season, dayType, occupancy } = criteria;
        // Khởi tạo mảng với tất cả các trường cần kiểm tra
        let fieldDelete = Object.entries(criteria)
          .filter(([key, value]) => !value) // Chỉ giữ các cặp key-value có value là false
          .map(([key]) => key); // Lấy key
        const dataForm = await form.validateFields();
        if (dataForm) {
          const omitData: any = omit(groupData(dataForm), fieldDelete);
          if (!dayType) {
            omitData.dayType = dataSourceDayType;
          }
          if (!season) {
            omitData.season = dataSourceSeason;
          }
          const res = await createRateConfig({
            ...convertInputPost(omitData),
            username_created: userName,
          });

          if (res && res.data) {
            message.success('Create rate configuration successfully');
            setOpen(!open);
            onFinish && onFinish(true);
            form.resetFields();
          }
        }
      }
    } catch (error) {
      console.log('error', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'errorFields' in error
      ) {
        const err = error as { errorFields: { name: string[] }[] };

        resetCheckAjust();
        err.errorFields.forEach(field => {
          if (field.name[0].includes('priority_occupancy')) {
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
  // useEffect(() => {
  //   if (rateCode && roomType && packagePlan) {
  //     const data = combineData(rateCode, roomType, packagePlan);
  //     if (data) {
  //       setdataSource(data);
  //     }
  //   }
  // }, [rateCode, roomType, packagePlan]);
  const handleCancel = () => {
    onCancel && onCancel();
    setIsCreate(undefined);
    resetCheckAjust();
    setdataSource([]);
    setRateSetting([]);
    form.resetFields();
  };

  const optionsAjustment = [
    {
      label: 'Max rate',
      value: 'max_rate',
    },
    {
      label: 'Min rate',
      value: 'min_rate',
    },
    {
      label: 'Parallel',
      value: 'parallel',
    },
    {
      label: 'Sequence',
      value: 'sequence',
    },
  ];

  const getItems: (
    panelStyle: CSSProperties
  ) => CollapseProps['items'] = panelStyle => [
    {
      key: '1',
      label: 'RATE SETTING',
      children: (
        <>
          <RateSetting
            selectedHotel={selectedHotelSearch}
            isViewMode={isViewMode}
            form={form}
            isCreate={isCreate}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            dataSource={isCreate ? dataSource : rateSettingNew}
            forceUpdate={forceUpdate}
          />
          {/* <span style={{ color: 'red', padding: '0 8px' }}>
            {isErrorSetting
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
      children:
        isCreate == false ? (
          <RateAjustment
            setIsNotDataInOccupancy={setIsNotDataInOccupancy}
            isNotDataInOccupancy={isNotDataInOccupancy}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            isErrorPriorityOccupancy={isErrorPriorityOccupancy}
            isErrorPrioritySeason={isErrorPrioritySeason}
            isErrorPriorityDayType={isErrorPriorityDayType}
            setSelectOcccupancyDeletes={setSelectOcccupancyDeletes}
            isViewMode={isViewMode}
            form={form}
            data={rateAjust}
            options={optionsAjustment}
          />
        ) : (
          <RateAjustmentNew
            setIsNotDataInOccupancy={setIsNotDataInOccupancy}
            isNotDataInOccupancy={isNotDataInOccupancy}
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
        title={isCreate ? 'New Rate Configuration' : title}
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
                    <InputValue
                      placeholder="-"
                      hidden
                      disabled={isViewMode}
                      form={form}
                      name="id_rate_ajust"
                    />
                    <InputValue
                      placeholder="-"
                      hidden
                      disabled={isViewMode}
                      form={form}
                      name="id_rate_ajust_child"
                    />
                  </Col>
                </Row>
              </MyCardContent>
              <MyCollapse
                getItems={getItems}
                accordion={false}
                activeKey={['1', '2']}
              />
              {!isCreate && (
                <MyCardContent
                  title="OVERVIEW INFORMATION"
                  className="text-gray f-z-12"
                >
                  <OverviewPersonal
                    disabled={isViewMode}
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

export default RateConfigCru;
