import React, { useState, useEffect } from 'react';
import { MyModal } from '@/components/basic/modal';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as Tick } from '@/assets/icons/ic_ticks.svg';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { Col, Row, Form, message } from 'antd';
import { MyCardContent } from '@/components/basic/card-content';
import dayjs from 'dayjs';
import './ChangeInfo.less';
import {
  MultiSelectWithSearch,
  SelectCompact,
  SingleSelectSearchCustom,
} from '@/components/basic/select';
import SelectRoomTypeSingle from '../../select/SelectRoomTypeSingle';
import { MyTextArea } from '@/components/basic/input';
import { MyFormItem } from '@/components/basic/form-item';
import { InputAdult, InputChild } from '../../input';
import SelectAllPackageSingle from '../../select/SelectAllPackageSingle';
import { formatNumberMoney } from '@/utils/common';
import { ISource } from '@/utils/formatSelectSource';
import { apiRoomInfoSearch } from '@/api/features/myAllotment';
const ChangeInfor: React.FC<{
  setRateInfoList: any;
  rateInfoList: any[];
  rateInfoSelected: React.Key[];
  arrDeptDate?: [string, string] | null;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  onBack?: () => void;
  adultNum?: number;
  childNum?: number;
  isGroup?: boolean;
}> = ({
  visible,
  onOk,
  onCancel,
  onBack,
  adultNum,
  childNum,
  setRateInfoList,
  rateInfoList,
  rateInfoSelected,
  arrDeptDate,
  isGroup = false,
}) => {
  const [form] = Form.useForm();
  const [changeFields, setChangeFields] = useState<string[]>([]);
  const [disabledID, setDisabledID] = useState<boolean>(true);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [hotelId, setHotelId] = useState<string>('');
  const [rate, setRate] = useState<number>(0);
  const [optionSource, setOptionSource] = useState<ISource[]>([]);

  useEffect(() => {
    if (rateInfoSelected?.length === 1) {
      const sources = rateInfoList.map(rateInfo => ({
        label: rateInfo.sourceId,
        value: rateInfo.sourceId,
      }));
      const uniqueSources = Array.from(
        new Map(sources.map(source => [source.value, source])).values()
      );
      setOptionSource(uniqueSources);
      const selectedItem = rateInfoList.filter(
        item => item.No === rateInfoSelected[0]
      )[0];
      setHotelId(selectedItem?.hotelId);

      if (isGroup) {
        form.setFieldsValue({
          ...selectedItem,
          sourceName: selectedItem?.rateInfos[0].sourceName,
          sourceId: selectedItem?.rateInfos[0].sourceId,
          totalAdults: selectedItem?.adults ? Number(selectedItem?.adults) : 1,
          totalChildren: selectedItem?.numChildren
            ? Number(selectedItem?.numChildren)
            : 0,
        });
        setRate(selectedItem?.rate);
        setSelectedRoomType(selectedItem?.rateInfos[0].roomType);
        setSelectedSource(selectedItem?.rateInfos[0].sourceName);
        if (selectedItem?.rateInfos[0].sourceName === 'Allotment') {
          setDisabledID(false);
        } else {
          setDisabledID(true);
        }
      } else {
        form.setFieldsValue({
          ...selectedItem,
          totalAdults: selectedItem?.adults ? Number(selectedItem?.adults) : 1,
          totalChildren: selectedItem?.children
            ? Number(selectedItem?.children)
            : 0,
        });
        setRate(selectedItem?.rate);
        setSelectedRoomType(selectedItem?.roomType);
        setSelectedSource(selectedItem?.sourceName);
        if (selectedItem?.sourceName === 'Allotment') {
          setDisabledID(false);
        } else {
          setDisabledID(true);
        }
      }
    } else {
      form.resetFields();
    }

    if (!visible) {
      form.resetFields();
      setSelectedRoomType(null);
      setSelectedSource(null);
      setChangeFields([]);
      setDisabledID(true);
      setRate(0);
    }
  }, [visible]);

  const handleOk = async () => {
    const dataForm = await form.validateFields();
    const formatedBody: API.SearchDto = {
      searchFields: [
        {
          key: 'hotelId',
          value: hotelId,
        },
        {
          key: 'roomTypeCode',
          value: '',
        },
        {
          key: 'packageCode',
          value: dataForm.package,
        },
        {
          key: 'allotmentNo',
          value: dataForm.sourceName,
        },
        {
          key: 'dateRange',
          value: arrDeptDate,
        },
      ],
    };
    try {
      const res = await apiRoomInfoSearch(formatedBody);
      if (res?.result && res?.result?.data[0]?.availableRooms > 0) {
        if (isGroup) {
          setRateInfoList((prev: any) => {
            return prev.map((item: any) => {
              if (rateInfoSelected.includes(item.No)) {
                const updatedItem = {
                  ...item,
                  adults: dataForm.totalAdults || item.adults,
                  numChildren: dataForm.totalChildren || item.numChildren,
                  remark: dataForm.remark || item.remark,
                  roomType: dataForm.roomType || item.roomType,
                  sourceId: dataForm.sourceId || item.sourceId,
                  sourceName: dataForm.sourceName || item.sourceName,
                  packageId: dataForm.packageId || item.packageId,
                };

                if (item.rateInfos && item.rateInfos.length > 0) {
                  updatedItem.rateInfos = item.rateInfos.map(
                    (rateInfo: any) => ({
                      ...rateInfo,
                      adults: dataForm.totalAdults || rateInfo.adults,
                      children: dataForm.totalChildren || rateInfo.children,
                      remark: dataForm.remark || rateInfo.remark,
                      roomType: dataForm.roomType || rateInfo.roomType,
                      sourceId: dataForm.sourceId || rateInfo.sourceId,
                      sourceName: dataForm.sourceName || rateInfo.sourceName,
                      packageId: dataForm.packageId || rateInfo.packageId,
                    })
                  );
                }

                return updatedItem;
              }
              return item;
            });
          });
        } else {
          setRateInfoList((prev: any) => {
            return prev.map((item: any) => {
              if (rateInfoSelected.includes(item.No)) {
                const updatedItem = {
                  ...item,
                  adults: dataForm.totalAdults || item.adults,
                  children: dataForm.totalChildren || item.children,
                  remark: dataForm.remark || item.remark,
                  roomType: dataForm.roomType || item.roomType,
                  sourceId: dataForm.sourceId || item.sourceId,
                  sourceName: dataForm.sourceName || item.sourceName,
                  packageId: dataForm.packageId || item.packageId,
                };
                return updatedItem;
              }
              return item;
            });
          });
        }

        onOk();
        message.success('Change information successfully!');
        form.resetFields();
        onCancel();
      } else {
        message.error('There is no available room to apply');
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const getTitle = () => {
    const selectedRooms =
      rateInfoList && rateInfoSelected
        ? rateInfoList
            .filter(item => rateInfoSelected.includes(item.No))
            .map(item => (item.roomNo ? `${item.roomNo}` : ''))
        : [];

    const roomNos = selectedRooms.length > 0 ? selectedRooms.join(', ') : '';
    return (
      <>
        {onBack && (
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
        )}
        Change Info
        {roomNos && isGroup && (
          <span
            style={{ color: '#ED4E6B', fontSize: '18px', fontWeight: '600' }}>
            {' '}
            {roomNos}
          </span>
        )}
      </>
    );
  };

  return (
    <MyModal
      width={550}
      title={getTitle()}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="change-info-modal"
      footer={
        <div>
          <MyButton onClick={handleCancel} buttonType="outline">
            Close
          </MyButton>
          <MyButton
            onClick={handleOk}
            icon={<Tick />}
            style={{ marginRight: '0px' }}>
            Save
          </MyButton>
        </div>
      }>
      <Form form={form} layout="vertical">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <MyCardContent title="Date">
            {rateInfoList?.map((item, index) => {
              if (rateInfoSelected?.includes(item.No)) {
                if (isGroup) {
                  return (
                    <span
                      key={index}
                      style={{
                        padding: '2px 3px',
                        border: '1px solid #D9D9D9',
                        borderRadius: '6px',
                        marginRight: '5px',
                      }}>
                      {dayjs(item?.arrivalDate, 'YYYY-MM-DD').format(
                        'DD/MM/YYYY'
                      )}
                    </span>
                  );
                } else {
                  return (
                    <span
                      key={index}
                      style={{
                        padding: '2px 3px',
                        border: '1px solid #D9D9D9',
                        borderRadius: '6px',
                        marginRight: '5px',
                      }}>
                      {dayjs(item.date).format('DD/MM/YYYY')}
                    </span>
                  );
                }
              }
            })}
          </MyCardContent>

          <MyCardContent hasHeader={false}>
            <MyFormItem name="changeFields" label="Change Field" required>
              <MultiSelectWithSearch
                className="change-field"
                maxTagCount={3}
                value={changeFields}
                onChange={value => setChangeFields(value as string[])}
                options={[
                  {
                    label: 'Stay Info',
                    value: 'stayInfo',
                  },
                  {
                    label: 'Room Info',
                    value: 'roomInfo',
                  },
                  {
                    label: 'Remark',
                    value: 'remark',
                  },
                ]}
              />
            </MyFormItem>
          </MyCardContent>

          {changeFields.includes('stayInfo') && (
            <MyCardContent title="Stay Information">
              <Row gutter={16} className="row-container">
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <InputAdult
                    name="totalAdults"
                    label="Adult(s)"
                    loading={false}
                    form={form}
                    max={Number(adultNum) || 1}
                  />
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ marginTop: 2 }}>
                  <InputChild
                    name="totalChildren"
                    label="Child(s)"
                    loading={false}
                    max={Number(childNum) || 0}
                  />
                </Col>
              </Row>
            </MyCardContent>
          )}

          {changeFields.includes('roomInfo') && (
            <MyCardContent
              className="room-info"
              title={
                <>
                  Room Infomation
                  <label>
                    Rate: <span>{rate > 0 && formatNumberMoney(rate)}</span>
                  </label>
                </>
              }>
              <Row gutter={16} className="row-container">
                <Col span={12} style={{ marginTop: disabledID ? 0 : 3 }}>
                  <MyFormItem name="sourceName" label="Source">
                    <SelectCompact
                      showSearch
                      onChange={value => {
                        setDisabledID(value === 'Other' || !value);
                        setSelectedSource(value);
                      }}
                      options={[
                        {
                          value: 'Allotment',
                          label: 'Allotment',
                        },
                        {
                          value: 'Other',
                          label: 'Other',
                        },
                      ]}
                    />
                  </MyFormItem>
                </Col>
                <Col span={12}>
                  <MyFormItem
                    name="sourceId"
                    label="Source ID"
                    form={form}
                    required={!disabledID}
                    disabled={disabledID}>
                    <SingleSelectSearchCustom
                      disabled={disabledID}
                      value="null"
                      options={optionSource}
                    />
                  </MyFormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <SelectRoomTypeSingle
                    hotelId={hotelId}
                    required={!disabledID}
                    disabled={!selectedSource}
                    onChange={value => setSelectedRoomType(value)}
                  />
                </Col>
                <Col span={12}>
                  <SelectAllPackageSingle
                    hotelId={hotelId}
                    required={!disabledID}
                    disabled={selectedSource && selectedRoomType ? false : true}
                  />
                </Col>
              </Row>
            </MyCardContent>
          )}

          {changeFields.includes('remark') && (
            <MyCardContent title="Remark">
              <MyFormItem name={'remark'} isShowLabel={false}>
                <MyTextArea />
              </MyFormItem>
            </MyCardContent>
          )}
        </div>
      </Form>
    </MyModal>
  );
};

export default ChangeInfor;
