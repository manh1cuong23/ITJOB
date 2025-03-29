import React, { useEffect, useState } from 'react';
import './IndividualList.less';
import '../special-service/style.less';
import { ReactComponent as ChangeSvg } from '@/assets/icons/ic_change_rate.svg';
import { ReactComponent as FilePlusSvg } from '@/assets/icons/ic_file-plus.svg';
import { ReactComponent as DeleteSvg } from '@/assets/icons/ic-delete.svg';
import { ReactComponent as CloseSvg } from '@/assets/icons/ic_close.svg';
import { TableNoData } from '@/components/basic/table';
import TableWithRowTotalSums from '@/components/basic/table/TableWithRowTotalSums';
import { IndividualListItem, IPackage } from './IndividualList.types';
import { ISpecialServiceList } from '../special-service/type';
import { ChangeInfor } from '../modal/individual-booking-change-info';
import DeleteModal from '@/components/business/modal/shared-delete-confirm/SharedDeleteConfirm';
import {
  AddSpecialService,
  ModalSpecialService,
} from '../modal/group-booking-special-service';
import { ModalRateInfo } from '../modal/rate-info';
import { IndividualListColumns } from './IndividualList.columns';
import { IndividualListFormatDataSource } from './IndividualList.formatData';
import { IndividualListCalculateTotals } from './IndividualList.calculateTotals';
import { useNavigate } from 'react-router-dom';
import { IGeneralInfoData } from '@/containers/booking/view-booking/type';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIndividualData,
  setGeneralInfoData,
  setGuestSelected,
  setRoomSearch,
} from '@/stores/slices/group-booking.slice';
import { Form, message } from 'antd';
import {
  setBookingGuestInfos,
  setBookingItems,
} from '@/stores/slices/view-group.slice';
import { MultiSelectStatus } from '../select';
import { CancelIndividualGroupBooking } from '../modal/group-booking-cancel-individual';
import { selectPackageList } from '@/stores/slices/packageList.slice';

interface IProps {
  individualList: IndividualListItem[];
  generalInfoData: IGeneralInfoData[];
  setTotalRoomCharge: React.Dispatch<React.SetStateAction<number>>;
  setSpecialSvcAmt: React.Dispatch<React.SetStateAction<number>>;
  arrDeptDate?: [string, string] | null;
  setIndividualList: React.Dispatch<React.SetStateAction<IndividualListItem[]>>;
  setSpecialServiceData: React.Dispatch<
    React.SetStateAction<ISpecialServiceList[]>
  >;
  childNum?: number;
  adultNum?: number;
  guestSelected?: any;
  roomSearch?: any[];
  hotelIdSelected: string | null;
  isEdit?: boolean;
}

const IndividualList = (props: IProps) => {
  const {
    individualList = [],
    generalInfoData,
    setTotalRoomCharge,
    arrDeptDate,
    setIndividualList,
    setSpecialServiceData,
    setSpecialSvcAmt,
    childNum,
    adultNum,
    guestSelected,
    roomSearch,
    hotelIdSelected,
    isEdit,
  } = props;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [mainTableSelectedRowKeys, setMainTableSelectedRowKeys] = useState<
    React.Key[]
  >([]);
  const [specialServiceList, setSpecialServiceList] = useState<
    ISpecialServiceList[]
  >([]);
  const [rateInfoList, setRateInfoList] = useState<IndividualListItem[]>([]);
  const [changeInforVisible, setChangeInforVisible] = useState<boolean>(false);
  const [isModalSpecialService, setIsModalSpecialService] = useState(false);
  const [isModalRateInfo, setIsModalRateInfo] = useState(false);
  const [isAddSpecialService, setIsAddSpecialService] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [noSelect, setNoSelect] = useState<string | ''>('');
  const [roomNo, setRoomNo] = useState<string>('');
  const packageList = useSelector(selectPackageList);
  const [selectedStatuses, setSelectedStatuses] = useState<string[] | null>(
    null
  );

  const [
    isModalCancelIndividualGroupBooking,
    setIsModalCancelIndividualGroupBooking,
  ] = useState(false);
  const [recordToCancel, setRecordToCancel] = useState<any>(null);
  const dispatch = useDispatch();

  const showAddSpecialService = () => {
    setIsAddSpecialService(true);
  };

  const handleOkAddSpecialService = () => {
    setIsAddSpecialService(false);
  };

  const handleCancelAddSpecialService = () => {
    setIsAddSpecialService(false);
  };

  const showModalSpecialService = (record: any) => {
    setRoomNo(record.roomNo);
    setSpecialServiceList(record.specialServices);
    setIsModalSpecialService(true);
  };

  const handleOkSpecialService = () => {
    setIsModalSpecialService(false);
  };

  const goToIndividualEdit = (record: any, index: number) => {
    if (isEdit) {
      if (record?.status === 1 || record?.status === 3) {
        dispatch(setBookingItems(record));
        dispatch(setBookingGuestInfos(guestSelected));
        const id = encodeURIComponent(`${record?.bookingNo}#${index + 1}`);
        navigate(`/booking/edit-group/individual-edit/${id}`);
      } else {
        message.warning('Unable to perform action');
      }
    } else {
      setDataRedux();
      const encodedId = encodeURIComponent(record.roomNo);
      navigate(`/booking/new-group/individual-edit/${encodedId}`);
    }
  };

  const goToIndividualView = (record: any) => {
    setDataRedux();
    const encodedId = encodeURIComponent(record.roomNo);
    if (isEdit) {
      navigate(`/booking/edit-group/individual-view/${encodedId}`);
    } else {
      navigate(`/booking/new-group/individual-view/${encodedId}`);
    }
  };

  const setDataRedux = () => {
    if (individualList && individualList.length > 0) {
      dispatch(setIndividualData(individualList));
    }

    if (generalInfoData) {
      dispatch(setGeneralInfoData(generalInfoData));
    }

    if (guestSelected) {
      dispatch(setGuestSelected(guestSelected));
    }

    if (roomSearch) {
      dispatch(setRoomSearch(roomSearch));
    }
  };

  const handleCancelSpecialService = () => {
    setIsModalSpecialService(false);
  };

  const showModalRateInfo = (record: IndividualListItem) => {
    setRoomNo(record.roomNo);
    setIsModalRateInfo(true);
    setRateInfoList([record]);
  };

  const handleOkRateInfo = () => {
    setIsModalRateInfo(false);
  };

  const handleCancelRateInfo = () => {
    setIsModalRateInfo(false);
  };

  const handleReset = () => {
    setMainTableSelectedRowKeys([]);
    // setRateInfoSelected([]);
  };

  const showDelete = (no?: string) => {
    no && setNoSelect(no);
    setIsModalDelete(true);
  };

  const onCancelDelete = () => {
    setIsModalDelete(false);
  };

  const handleRemoveItems = () => {
    if (noSelect) {
      const newDataSource = individualList.filter(item => item.No !== noSelect);
      setIndividualList(newDataSource);
    } else if (mainTableSelectedRowKeys.length > 0) {
      const newDataSource = individualList.filter(
        item => !mainTableSelectedRowKeys.includes(item.No)
      );
      setIndividualList(newDataSource);
      setMainTableSelectedRowKeys([]);
    }
    setIsModalDelete(false);
  };

  const handleCancel = (record?: any) => {
    setRecordToCancel(record);
    setIsModalCancelIndividualGroupBooking(true);
  };

  const handleOkCancelIndividualGroupBooking = () => {
    message.success('Cancel the individual booking(s) successfully');
    setIsModalCancelIndividualGroupBooking(false);
    navigate(0);
  };

  const handleCancelCancelIndividualGroupBooking = () => {
    setIsModalCancelIndividualGroupBooking(false);
  };

  const columns = IndividualListColumns({
    packageList,
    showModalRateInfo,
    showModalSpecialService,
    showDelete,
    goToIndividualView,
    goToIndividualEdit,
    isEdit: isEdit,
    handleCancel,
  });

  const filteredDataSource = isEdit
    ? individualList.filter(item => {
        return selectedStatuses
          ? selectedStatuses.includes(String(item.bookingStatus))
          : true;
      })
    : individualList;

  const formatedDataSource = IndividualListFormatDataSource(filteredDataSource);
  const totals = IndividualListCalculateTotals(formatedDataSource);

  useEffect(() => {
    totals.totalRate && setTotalRoomCharge(totals.totalRate);
    totals.specialServiceCharge &&
      setSpecialSvcAmt(totals.specialServiceCharge);
  }, [totals.totalRate, totals.specialServiceCharge]);

  const mainTableRowSelection = {
    selectedRowKeys: mainTableSelectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setMainTableSelectedRowKeys(selectedRowKeys);
    },
  };

  const performActionIfValid = (action: () => void) => {
    if (isEdit) {
      const validRows = individualList.filter(
        item =>
          mainTableSelectedRowKeys.includes(item.No) &&
          (item.bookingStatus === 1 || item.bookingStatus === 3)
      );

      if (validRows.length === mainTableSelectedRowKeys.length) {
        action();
      } else {
        message.warning('Unable to perform action');
      }
    } else {
      mainTableSelectedRowKeys.length > 0 && action();
    }
  };

  const getSelectedRecord = () => {
    return individualList.filter(item =>
      mainTableSelectedRowKeys.includes(item.No)
    );
  };

  return (
    <>
      {individualList.length > 0 ? (
        <>
          <div className="header">
            <div className="action">
              <div
                onClick={event => {
                  event.stopPropagation();
                  performActionIfValid(() => showAddSpecialService());
                  // handleCancel(getSelectedRecord());
                }}
              >
                <FilePlusSvg />
                <span className="ml-5">Special Service</span>
              </div>
              <div
                onClick={event => {
                  event.stopPropagation();
                  performActionIfValid(() => setChangeInforVisible(true));
                }}
              >
                <ChangeSvg />
                <span className="ml-5">Change</span>
              </div>
              {isEdit ? (
                <div
                  onClick={event => {
                    event.stopPropagation();
                    handleCancel(getSelectedRecord());
                  }}
                >
                  <CloseSvg />
                  <span className="ml-5">Cancel</span>
                </div>
              ) : (
                <div
                  onClick={event => {
                    event.stopPropagation();
                    mainTableSelectedRowKeys.length > 0 &&
                      setIsModalDelete(true);
                  }}
                >
                  <DeleteSvg />
                  <span className="ml-5">Delete</span>
                </div>
              )}
            </div>
            {isEdit && (
              <Form form={form}>
                <MultiSelectStatus onChange={setSelectedStatuses} />
              </Form>
            )}
          </div>
          <TableWithRowTotalSums
            dataSource={formatedDataSource}
            columns={columns}
            rowSelection={mainTableRowSelection}
            rowKey="No"
            total={totals}
            tableScrollX={true}
            isEdit={isEdit}
          />
        </>
      ) : (
        <TableNoData
          handleReset={handleReset}
          label="Reset"
          isSearched={false}
        />
      )}

      <ModalSpecialService
        onCancel={handleCancelSpecialService}
        onOk={handleOkSpecialService}
        visible={isModalSpecialService}
        specialServiceList={specialServiceList}
        arrDeptDate={arrDeptDate}
        setIndividualList={setIndividualList}
        setSpecialServiceList={setSpecialServiceData}
        roomNo={roomNo}
        hotelSelected={hotelIdSelected}
      />

      <ModalRateInfo
        visible={isModalRateInfo}
        onOk={handleOkRateInfo}
        onCancel={handleCancelRateInfo}
        individualList={rateInfoList}
        setIndividualList={setIndividualList}
        roomNo={roomNo}
        childNum={childNum}
        adultNum={adultNum}
        arrDeptDate={arrDeptDate}
      />

      <AddSpecialService
        visible={isAddSpecialService}
        onOk={handleOkAddSpecialService}
        onCancel={handleCancelAddSpecialService}
        specialServiceList={specialServiceList}
        setSpecialServiceList={setSpecialServiceData}
        individualSelected={mainTableSelectedRowKeys}
        individualList={individualList}
        hotelId={hotelIdSelected}
      />

      <ChangeInfor
        isGroup
        rateInfoList={individualList}
        setRateInfoList={setIndividualList}
        rateInfoSelected={mainTableSelectedRowKeys}
        visible={changeInforVisible}
        adultNum={adultNum}
        childNum={childNum}
        onOk={() => {}}
        onCancel={() => {
          setChangeInforVisible(false);
        }}
        onBack={() => {
          setChangeInforVisible(false);
        }}
      />

      <DeleteModal
        content="Are you sure to delete the record(s)?"
        visible={isModalDelete}
        onOk={handleRemoveItems}
        onCancel={onCancelDelete}
      />

      <CancelIndividualGroupBooking
        record={recordToCancel}
        visible={isModalCancelIndividualGroupBooking}
        onOk={handleOkCancelIndividualGroupBooking}
        onCancel={handleCancelCancelIndividualGroupBooking}
      />
    </>
  );
};

export default IndividualList;
