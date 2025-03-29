import React, { useState } from 'react';
import './IndividualList.less';
import '../special-service/style.less';
import { IndividualListItem, IPackage } from './IndividualList.types';
import { ReactComponent as InforSvg } from '@/assets/icons/ic_infor.svg';
import { ReactComponent as EyeGreen } from '@/assets/icons/ic_eye_green.svg';
import { ReactComponent as CheckSvg } from '@/assets/icons/ic_badge-check.svg';
import { ReactComponent as CloseSvg } from '@/assets/icons/ic_close.svg';
import TableWithRowTotalSums from '@/components/basic/table/TableWithRowTotalSums';
import {
  IndividualListColumnsViewFirst,
  IndividualListColumnsViewLast,
  IndividualListColumnsViewMiddle,
} from './IndividualList.columns';
import { IndividualListFormatDataSource } from './IndividualList.formatData';
import { IndividualListCalculateTotals } from './IndividualList.calculateTotals';
import { Flex, Form, Popover } from 'antd';
import { formatNumberMoney } from '@/utils/common';
import ModalDetailBooking from '@/containers/booking/view-booking/component/ModalDetailBooking';
import { RenderTableServiceDetail } from '@/containers/booking/view-booking/component/RenderTableServiceDetail';
import { RenderTableRateDetail } from '@/containers/booking/view-booking/component/RenderTableRateDetail';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBookingGuestInfos,
  setBookingItems,
} from '@/stores/slices/view-group.slice';
import { MultiSelectStatus } from '../select';
import { ApproveIndividualBooking } from '../modal/individual-booking-approve';
import { RejectIndividualBooking } from '../modal/individual-booking-reject';
import { BookingRow } from '../layouts/shared-layout/type';
import { selectPackageList } from '@/stores/slices/packageList.slice';
import { ISource } from '@/utils/formatSelectSource';

interface IProps {
  individualList: IndividualListItem[];
  bookingGuestInfos: any;
  isModal?: boolean;
  setIsReload?: React.Dispatch<React.SetStateAction<boolean>>;
}

const IndividualListView = (props: IProps) => {
  const navigate = useNavigate();
  const {
    individualList = [],
    bookingGuestInfos = [],
    isModal = false,
    setIsReload,
  } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [itemRateInfo, setItemRateInfo] = useState<any>();
  const [itemSpecialService, setItemSpecialService] = useState<any>();
  const [openModalRate, setOpenModalRate] = useState<boolean>(false);
  const [openSpecialService, setOpenService] = useState<boolean>(false);
  const [mainTableSelectedRowKeys, setMainTableSelectedRowKeys] = useState<
    React.Key[]
  >([]);
  const [roomNo, setRoomNo] = useState<number>(0);
  const [isModalReject, setIsModalReject] = useState(false);
  const [isModalApprove, setIsModalApprove] = useState(false);
  const [selectedRows, setSelectedRows] = useState<BookingRow[]>([]);
  const packageList = useSelector(selectPackageList);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const showModalRoomRateInfo = (record: any, index: number) => {
    const rateInfoWithDates = (Array.isArray(record.rateInfos)
      ? record.rateInfos
      : record.rateInfos
      ? [record.rateInfos]
      : []
    ).map((rateInfo: any) => ({
      ...rateInfo,
      arrivalDate: dayjs(record.arrivalDate).format('DD/MM/YYYY'),
      departureDate: dayjs(record.departureDate).format('DD/MM/YYYY'),
    }));
    setItemRateInfo(rateInfoWithDates);
    setRoomNo(index + 1);
    setOpenModalRate(true);
  };

  const showModalSpecialService = (record: any, index: number) => {
    setItemSpecialService(record.specialServices);
    setRoomNo(index + 1);
    setOpenService(true);
  };

  const formatedDataSource = IndividualListFormatDataSource(individualList);
  const filteredDataSource = selectedStatus
    ? formatedDataSource.filter(
        item =>
          item.bookingStatus !== undefined &&
          selectedStatus.includes(item.bookingStatus.toString())
      )
    : formatedDataSource;
  const totals = IndividualListCalculateTotals(filteredDataSource);

  const goToViewIndividual = (record: any, index: number) => {
    dispatch(setBookingItems(record));
    dispatch(setBookingGuestInfos(bookingGuestInfos));
    const id = encodeURIComponent(`${record?.bookingNo}#${index + 1}`);
    navigate(`/booking/individual-view/${id}`);
  };

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: any
  ) => {
    setSelectedRows(selectedRows);
    setMainTableSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    mainTableSelectedRowKeys,
    onChange: onSelectChange,
  };

  const showModalReject = () => {
    if (mainTableSelectedRowKeys.length > 0) {
      setIsModalReject(true);
    }
  };

  const showModalApprove = () => {
    if (mainTableSelectedRowKeys.length > 0) {
      setIsModalApprove(true);
    }
  };

  const handleOkReject = async () => {
    setIsModalReject(false);
    setIsReload?.(true);
    // navigate(0);
  };

  const handleCancelReject = () => {
    setIsModalReject(false);
  };

  const handleOkApprove = async () => {
    setIsModalApprove(false);
    setIsReload?.(true);
    // navigate(0);
  };

  const handleCancelApprove = () => {
    setIsModalApprove(false);
  };

  const columns: any = [
    {
      title: 'Room No',
      dataIndex: 'roomNo',
      key: 'roomNo',
      width: 80,
      render(value: string, record: any, index: number) {
        return (
          <div
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => goToViewIndividual(record, index)}
          >
            #{index + 1}
          </div>
        );
      },
    },
    ...IndividualListColumnsViewFirst,
    {
      title: 'Package',
      dataIndex: 'package',
      key: 'package',
      width: 120,
      render: (text: any, record: any) => {
        const packageCode = record.packageCode;
        const matchingPackage = packageList?.find(
          pkg => pkg.value === packageCode
        );

        return (
          <Flex justify="space-between" align="center">
            {text}
            <Popover
              content={
                <span>
                  Service:{' '}
                  {matchingPackage?.packages
                    ?.map((pkg: any) => pkg.package_id?.name)
                    .join(', ') || ''}
                </span>
              }
              className="popover-package"
              overlayClassName="popover-package"
            >
              {text && (
                <InforSvg height={15} width={15} className="icon-infor" />
              )}
            </Popover>
          </Flex>
        );
      },
    },
    ...IndividualListColumnsViewMiddle,
    {
      title: 'Room Charge',
      dataIndex: 'rate',
      key: 'totalRate',
      className: 'text-right',
      width: 120,
      render: (value: number, record: any, index: number) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 6,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {value ? formatNumberMoney(value) : '0'}
            <div
              style={{ display: 'flex', flexDirection: 'row' }}
              onClick={() => showModalRoomRateInfo(record, index)}
            >
              {value && (
                <EyeGreen
                  width={16}
                  height={16}
                  style={{ marginLeft: 6, cursor: 'pointer' }}
                />
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Special Service',
      dataIndex: 'specialServices',
      key: 'specialServices',
      render: (_text: string, record: any, index: number) => {
        const maxDisplay = 3;
        const specialServices = record.specialServices || [];
        const displayedServices = specialServices
          .slice(0, maxDisplay)
          .map((service: any) => service.serviceCode);
        const remainingCount = specialServices.length - maxDisplay;

        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {displayedServices.length > 0 ? displayedServices.join(', ') : '-'}
            {remainingCount > 0 && `, +${remainingCount}`}
            <EyeGreen
              onClick={() => showModalSpecialService(record, index)}
              className="edit-special-service"
              style={{ cursor: 'pointer', minWidth: '14px' }}
              width={14}
              height={14}
            />
          </div>
        );
      },
    },
    ...IndividualListColumnsViewLast,
  ];

  return (
    <>
      {!isModal && (
        <div className="header">
          <div className="action">
            <div
              onClick={event => {
                event.stopPropagation();
                showModalReject();
              }}
            >
              <CloseSvg />
              <span className="ml-5">Reject</span>
            </div>
            <div
              onClick={event => {
                event.stopPropagation();
                showModalApprove();
              }}
            >
              <CheckSvg />
              <span className="ml-5">Approve</span>
            </div>
          </div>
          <Form form={form}>
            <MultiSelectStatus onChange={value => setSelectedStatus(value)} />
          </Form>
        </div>
      )}
      <TableWithRowTotalSums
        dataSource={filteredDataSource}
        columns={columns}
        rowKey="id"
        isEdit
        rowSelection={rowSelection}
        total={totals}
        tableScrollX={true}
      />
      <ModalDetailBooking
        isOpen={openSpecialService}
        title={
          <span className="title-txt">
            Special Service:
            <span
              className="title-txt"
              style={{ color: '#ed4e6b', marginLeft: 5 }}
            >
              #{roomNo}
            </span>
          </span>
        }
        onClose={() => setOpenService(false)}
        children={<RenderTableServiceDetail dataTable={itemSpecialService} />}
        maxContentWidth={'80vw'}
        isFooter
      />
      <ModalDetailBooking
        isOpen={openModalRate}
        title={
          <span className="title-txt">
            Rate Information:
            <span
              className="title-txt"
              style={{ color: '#ed4e6b', marginLeft: 5 }}
            >
              #{roomNo}
            </span>
          </span>
        }
        onClose={() => setOpenModalRate(false)}
        children={
          <RenderTableRateDetail
            dataTable={itemRateInfo}
            packageList={[]}
            setOpenModal={setOpenModalRate}
          />
        }
        maxContentWidth={'70vw'}
        isFooter
      />
      <RejectIndividualBooking
        onCancel={handleCancelReject}
        onOk={handleOkReject}
        visible={isModalReject}
        value={selectedRows}
        isItem
      />

      <ApproveIndividualBooking
        onCancel={handleCancelApprove}
        onOk={handleOkApprove}
        visible={isModalApprove}
        value={selectedRows}
        isItem
      />
    </>
  );
};

export default IndividualListView;
