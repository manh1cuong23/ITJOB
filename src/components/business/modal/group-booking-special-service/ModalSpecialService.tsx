import { MyButton } from '@/components/basic/button';
import { MyModal } from '@/components/basic/modal';
import { ReactComponent as Tick } from '@/assets/icons/ic_ticks.svg';
import { MyCardContent } from '@/components/basic/card-content';
import { generateUniqueString } from '@/utils/common';
import { useEffect, useState } from 'react';
import { ReactComponent as DeleteSvg } from '@/assets/icons/ic-delete.svg';
import dayjs from 'dayjs';
import { checkAndformatDate } from '@/utils/formatDate';
import { Form } from 'antd';
import { IListRoom } from '../../room-info/types';
import { ISpecialServiceList } from '../../special-service/type';
import { IRateInfoItem } from '../../rate-info/type';
import SpecialService from '../../special-service/SpecialService';
import { IndividualListItem } from '../../individual-list/IndividualList.types';

interface IProps {
  visible: boolean;
  onOk?: () => void;
  onCancel: () => void;
  specialServiceList: ISpecialServiceList[];
  setIndividualList: React.Dispatch<React.SetStateAction<IndividualListItem[]>>;
  setSpecialServiceList: React.Dispatch<
    React.SetStateAction<ISpecialServiceList[]>
  >;
  arrDeptDate?: [string, string] | null;
  hotelSelected: string | null;
  roomNo?: string;
}

const ModalSpecialService = (props: IProps) => {
  const {
    visible,
    onOk,
    onCancel,
    specialServiceList,
    setIndividualList,
    setSpecialServiceList,
    arrDeptDate,
    roomNo,
    hotelSelected,
  } = props;

  const [specialServiceData, setSpecialServiceData] =
    useState<ISpecialServiceList[]>(specialServiceList);

  const handleSave = () => {
    setIndividualList((prevList: IndividualListItem[]) => {
      return prevList.map(item => {
        if (item.roomNo === roomNo) {
          // Cập nhật dịch vụ có `id` trùng trong `specialServiceData`, thêm `roomNo` nếu chưa có
          const updatedServices = item.specialServices
            .map((specialService: any) => {
              const matchingService = specialServiceData.find(
                service => service.id === specialService.id
              );
              return matchingService
                ? {
                    ...specialService,
                    ...matchingService,
                    roomNo: specialService.roomNo || roomNo,
                  }
                : null;
            })
            .filter(service => service !== null);

          // Thêm các dịch vụ mới từ `specialServiceData` vào `specialServices`, thêm `roomNo`
          const newServices = specialServiceData
            .filter(
              newService =>
                !item.specialServices.find(
                  existingService => existingService.id === newService.id
                )
            )
            .map(newService => ({
              ...newService,
              roomNo: Array.isArray(newService.roomNo)
                ? [...newService.roomNo, roomNo]
                : [newService.roomNo || roomNo],
            }));

          // Danh sách các dịch vụ sau khi cập nhật và thêm mới
          const updatedSpecialServiceData = [
            ...updatedServices,
            ...newServices,
          ];

          // Cập nhật `specialServiceList`, thêm `roomNo` cho các dịch vụ chưa có
          setSpecialServiceList(prevSpecialServiceList => {
            const filteredSpecialServiceList = prevSpecialServiceList.filter(
              service =>
                updatedSpecialServiceData.some(
                  updatedService => updatedService.id === service.id
                )
            );
            const newSpecialServiceItems = updatedSpecialServiceData.filter(
              updatedService =>
                !filteredSpecialServiceList.some(
                  service => service.id === updatedService.id
                )
            );
            return [
              ...filteredSpecialServiceList,
              ...newSpecialServiceItems.map(service => ({
                ...service,
                roomNo: service.roomNo || roomNo,
              })),
            ];
          });

          return {
            ...item,
            specialServices: updatedSpecialServiceData,
          };
        }

        return item;
      });
    });

    onOk && onOk();
  };

  useEffect(() => {
    setSpecialServiceData(specialServiceList);
  }, [visible]);

  return (
    <MyModal
      width={880}
      title={
        <>
          Special Service:{' '}
          <span
            style={{ color: '#ED4E6B', fontSize: '18px', fontWeight: '600' }}>
            {roomNo}
          </span>
        </>
      }
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={
        <>
          <MyButton onClick={onCancel} buttonType="outline">
            Close
          </MyButton>
          <MyButton onClick={handleSave} icon={<Tick />}>
            Save
          </MyButton>
        </>
      }>
      <div className="special-service">
        <MyCardContent hasHeader={false}>
          <SpecialService
            dataSource={specialServiceData}
            setDataSource={setSpecialServiceData}
            arrDeptDate={arrDeptDate}
            hotelId={hotelSelected}
          />
        </MyCardContent>
      </div>
    </MyModal>
  );
};

export default ModalSpecialService;
