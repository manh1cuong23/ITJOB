import { MyButton } from '@/components/basic/button';
import { MyModal } from '@/components/basic/modal';
import { ReactComponent as Tick } from '@/assets/icons/ic_ticks.svg';
import { MyCardContent } from '@/components/basic/card-content';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { ISpecialServiceList } from '../../special-service/type';
import { Col, Form, Row, message } from 'antd';
import { SelectRoomNo, SelectSpecialService } from '../../select';
import DatePickerSingle from '../../date-picker/DatePickerSingle';
import { MyFormItem } from '@/components/basic/form-item';
import MyInputNumber from '@/components/basic/input/InputNumber';
import { MyTextArea } from '@/components/basic/input';
import SpecialServiceTable from '../../special-service-group/SpecialServiceTable';
import { useEffect, useState } from 'react';
import { IndividualListItem } from '../../individual-list/IndividualList.types';
import { ISource } from '@/utils/formatSelectSource';
import { apiSpecialServiceList } from '@/api/features/booking';
import dayjs from 'dayjs';
import { generateUniqueString } from '@/utils/common';
import { IError } from '../../booking-info/type';
import isBetween from 'dayjs/plugin/isBetween';

interface IProps {
  visible: boolean;
  onOk?: () => void;
  onCancel: () => void;
  specialServiceList: ISpecialServiceList[];
  setSpecialServiceList: React.Dispatch<
    React.SetStateAction<ISpecialServiceList[]>
  >;
  arrDeptDate?: [string, string] | null;
  onBack?: () => void;
  isAdd?: boolean;
  individualSelected?: React.Key[];
  individualList?: IndividualListItem[];
  setIndividualList?: React.Dispatch<
    React.SetStateAction<IndividualListItem[]>
  >;
  hotelId: string | null;
}

const AddSpecialService = (props: IProps) => {
  const {
    visible,
    onOk,
    onCancel,
    onBack,
    specialServiceList,
    setSpecialServiceList,
    individualSelected,
    individualList,
    arrDeptDate,
    isAdd = false,
    setIndividualList,
    hotelId,
  } = props;

  const [form] = Form.useForm();
  dayjs.extend(isBetween);
  const [specialServiceData, setSpecialServiceData] = useState<
    ISpecialServiceList[]
  >([]);
  const [optionSpecialService, setOptionSpecialService] = useState<ISource[]>(
    []
  );
  const [optionRoomNo, setOptionRoomNo] = useState<ISource[]>([]);
  const [originalServiceList, setOriginalServiceList] = useState<any[]>([]);
  const [messageError, setMessageError] = useState<IError[]>([]);

  const fetchSpecialService = async () => {
    try {
      const response = await apiSpecialServiceList(hotelId);
      if (response && response.status) {
        setOriginalServiceList(response.result.data);

        const data: ISource[] = response.result.data.map((item: any) => ({
          label: item.serviceCode + ' - ' + item.serviceName,
          value: item.id,
        }));
        setOptionSpecialService(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (individualList && individualSelected) {
      const services = individualList
        .filter(item => individualSelected.includes(item.No))
        .map(item => item.specialServices)
        .flat();
      setSpecialServiceData(services);
    }
  }, [visible]);

  function parseDate(
    date: string | [string, string]
  ): {
    fromDate: Date;
    toDate: Date;
  } {
    if (Array.isArray(date)) {
      const fromDate = dayjs(date[0], 'YYYY-MM-DD').toDate();
      const toDate = dayjs(date[1], 'YYYY-MM-DD').toDate();
      return { fromDate, toDate };
    } else {
      const parsedDate = dayjs(date, 'YYYY-MM-DD').toDate();
      return { fromDate: parsedDate, toDate: parsedDate };
    }
  }

  const handleAddService = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldValue('special-service');
      const from_to_data = form.getFieldValue('from_to_date');
      const { fromDate, toDate } = parseDate([
        from_to_data[0],
        from_to_data[1],
      ]);
      const quantity = form.getFieldValue('quantity');
      const remark = form.getFieldValue('remark');
      const roomNos = form.getFieldValue('room-no') || [];

      if (!Array.isArray(roomNos)) {
        console.error('room-no is not an array');
        return;
      }

      if (originalServiceList.length > 0) {
        const existingServices = originalServiceList
          .filter(item => values.includes(item.id))
          .flatMap(service => {
            const dayDifference =
              Math.ceil(
                (toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)
              ) + 1;
            const numericQuantity = Number(quantity) || 0;
            const totalAmount = numericQuantity * service.price * dayDifference;

            return roomNos.map((room: any) => {
              const roomValue = typeof room === 'string' ? room : room.value;

              if (!roomValue) {
                console.error('Invalid room value:', room);
                return null;
              }

              // Tìm Arrival Date và Departure Date của phòng hiện tại
              const individual = individualList?.find(
                ind => ind.roomNo === roomValue
              );
              const arrivalDate = individual
                ? dayjs(individual.arrivalDate, 'YYYY-MM-DD').toDate()
                : null;
              const departureDate = individual
                ? dayjs(individual.departureDate, 'YYYY-MM-DD').toDate()
                : null;

              // Kiểm tra nếu fromDate hoặc toDate nằm ngoài khoảng Arrival - Departure Date
              const isOutsideRange =
                arrivalDate &&
                departureDate &&
                (fromDate < arrivalDate || toDate > departureDate);

              // Chỉ thiết lập fromDate, toDate là trống cho item mới được thêm vào
              return {
                ...service,
                no: service.id,
                id: generateUniqueString(),
                roomNo: roomValue,
                fromDate: isOutsideRange
                  ? ''
                  : dayjs(fromDate).format('YYYY-MM-DD'),
                toDate: isOutsideRange
                  ? ''
                  : dayjs(toDate).format('YYYY-MM-DD'),
                quantity: numericQuantity,
                totalAmount: isOutsideRange ? 0 : totalAmount,
                remark: remark || '',
              };
            });
          })
          .filter(Boolean);

        setSpecialServiceData(prevData => {
          const updatedData = [...prevData];

          existingServices.forEach(newService => {
            const existingIndex = updatedData.findIndex(
              item =>
                item.serviceCode === newService.serviceCode &&
                item.serviceName === newService.serviceName &&
                item.fromDate === newService.fromDate &&
                item.toDate === newService.toDate &&
                item.roomNo === newService.roomNo
            );

            if (existingIndex !== -1) {
              updatedData[existingIndex].quantity += newService.quantity;
              updatedData[existingIndex].totalAmount += newService.totalAmount;
            } else {
              updatedData.push(newService);
            }
          });

          return updatedData;
        });

        form.resetFields();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleSave = () => {
    try {
      const errors: IError[] = [];
      const duplicateRecords: Set<number> = new Set();

      specialServiceData.forEach((item, index) => {
        if (!item.fromDate) {
          errors.push({ field: 'From Date', row: index });
        }

        if (!item.toDate) {
          errors.push({ field: 'To Date', row: index });
        }
      });

      if (errors.length > 0) {
        setMessageError(errors);

        setSpecialServiceData(prevData =>
          prevData.map((item, index) => ({
            ...item,
            isError: errors.some(error => error.row === index),
          }))
        );
        return;
      } else {
        setMessageError([]);
      }

      for (let i = 0; i < specialServiceData.length; i++) {
        for (let j = i + 1; j < specialServiceData.length; j++) {
          const itemA = specialServiceData[i];
          const itemB = specialServiceData[j];

          if (
            itemA.roomNo === itemB.roomNo &&
            itemA.serviceCode === itemB.serviceCode &&
            itemA.serviceName === itemB.serviceName &&
            (dayjs(itemA.fromDate).isBetween(
              itemB.fromDate,
              itemB.toDate,
              null,
              '[]'
            ) ||
              dayjs(itemA.toDate).isBetween(
                itemB.fromDate,
                itemB.toDate,
                null,
                '[]'
              ) ||
              dayjs(itemB.fromDate).isBetween(
                itemA.fromDate,
                itemA.toDate,
                null,
                '[]'
              ) ||
              dayjs(itemB.toDate).isBetween(
                itemA.fromDate,
                itemA.toDate,
                null,
                '[]'
              ))
          ) {
            duplicateRecords.add(j);
            errors.push({
              field: `[${itemA.serviceCode} - ${itemA.serviceName}]`,
              row: j,
              message: 'Duplicate data',
            });
          }
        }
      }

      if (errors.length > 0) {
        setMessageError(errors);

        setSpecialServiceData(prevData =>
          prevData.map((item, index) => ({
            ...item,
            isError:
              duplicateRecords.has(index) ||
              errors.some(error => error.row === index),
          }))
        );
        return;
      } else {
        setMessageError([]);
      }

      if (setIndividualList && individualList) {
        const updatedIndividualList = individualList.map(individualItem => {
          const matchingServices = specialServiceData.filter(serviceItem => {
            return Array.isArray(serviceItem.roomNo)
              ? serviceItem.roomNo.includes(individualItem.roomNo)
              : serviceItem.roomNo === individualItem.roomNo;
          });

          return {
            ...individualItem,
            specialServices:
              matchingServices.length > 0 ? matchingServices : [],
          };
        });

        setIndividualList(updatedIndividualList);
      }

      setSpecialServiceList(prevList => {
        const existingItemsMap = new Map(prevList.map(item => [item.id, item]));

        const updatedList = specialServiceData
          .filter(item => item.id)
          .map(newItem => {
            if (existingItemsMap.has(newItem.id)) {
              return {
                ...existingItemsMap.get(newItem.id),
                ...newItem,
              };
            }
            return newItem;
          });

        return updatedList;
      });

      onCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const getTitle = () => {
    const selectedRooms =
      individualList && individualSelected
        ? individualList
            .filter(item => individualSelected.includes(item.No))
            .map(item => (item.roomNo ? `${item.roomNo}` : ''))
        : [];

    const roomNos = selectedRooms.length > 0 ? selectedRooms.join(', ') : '';

    return (
      <>
        Special Service
        {roomNos && (
          <span
            style={{ color: '#ED4E6B', fontSize: '18px', fontWeight: '600' }}
          >
            {' '}
            {roomNos}
          </span>
        )}
      </>
    );
  };

  useEffect(() => {
    if (visible) {
      fetchSpecialService();
      specialServiceList.length > 0 &&
        setSpecialServiceData(specialServiceList);
    } else {
      form.resetFields();
    }

    if (isAdd) {
      const data: ISource[] = [
        {
          label: 'All',
          value: 'All',
        },
      ];
      setOptionRoomNo(data);
    } else {
      if (individualList && individualList.length > 0) {
        const filteredRooms = individualList.filter(
          (item: any) => item.status !== 1 && item.status !== 3
        );
        const data: ISource[] = filteredRooms.map((item: any) => ({
          label: item.roomNo,
          value: item.roomNo,
        }));
        setOptionRoomNo(data);
      }
    }

    if (individualSelected?.length === 1 && props.individualList) {
      const selectedIndividual = props.individualList.find(
        (item: IndividualListItem) => item.No === individualSelected[0]
      );
      if (selectedIndividual) {
        form.setFieldsValue(selectedIndividual);
      }
    } else {
      form.resetFields();
    }
  }, [visible, individualSelected, individualList]);

  const handleCancel = () => {
    onCancel();
  };

  return (
    <MyModal
      width={1100}
      title={getTitle()}
      open={visible}
      onOk={onOk}
      onCancel={handleCancel}
      footer={
        <>
          <MyButton onClick={handleCancel} buttonType="outline">
            Close
          </MyButton>
          <MyButton onClick={handleSave} icon={<Tick />}>
            Save
          </MyButton>
        </>
      }
    >
      <div className="special-service">
        <MyCardContent hasHeader={false}>
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                <SelectSpecialService required options={optionSpecialService} />
              </Col>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                <DatePickerSingle
                  value={arrDeptDate}
                  arrDeptDate={arrDeptDate}
                />
              </Col>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                <SelectRoomNo
                  required
                  isReset={visible}
                  options={optionRoomNo}
                  disabled={isAdd ? true : false}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                <MyFormItem
                  name={'quantity'}
                  label={'Quantity'}
                  required={isAdd ? true : false}
                  initialValue={1}
                >
                  <MyInputNumber min={1} />
                </MyFormItem>
              </Col>
              <Col xs={12} sm={12} md={16} lg={16} xl={16}>
                <MyFormItem name="remark" initialValue={''} label="Remark">
                  <MyTextArea placeholder="Enter value" />
                </MyFormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <MyButton
                  style={{ float: 'right', marginTop: '5px' }}
                  onClick={handleAddService}
                >
                  Add
                </MyButton>
              </Col>
            </Row>
          </Form>
        </MyCardContent>
        <div style={{ marginTop: '16px' }}>
          <MyCardContent title="SPECIAL SERVICE">
            <SpecialServiceTable
              dataSource={specialServiceData}
              setDataSource={setSpecialServiceData}
              isModalOpen={visible}
              messageError={messageError}
              individualList={individualList}
              arrDeptDate={arrDeptDate}
            />
          </MyCardContent>
        </div>
      </div>
    </MyModal>
  );
};

export default AddSpecialService;
