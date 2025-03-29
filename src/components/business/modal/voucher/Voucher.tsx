import React, { useEffect, useState } from 'react';
import { Col, Form, message, Row } from 'antd';
import DeleteModal from '@/components/business/modal/shared-delete-confirm/SharedDeleteConfirm';
import { MyCardContent } from '@/components/basic/card-content';
import { ReactComponent as DeleteSvg } from '@/assets/icons/ic-delete.svg';
import { ReactComponent as InforSvg } from '@/assets/icons/ic_infor.svg';
import { InputBasic } from '../../input';
import { MyButton } from '@/components/basic/button';
import { MyModal } from '@/components/basic/modal';
import { TableBasic } from '@/components/basic/table';
import { Columns } from './Voucher.columns';
import { generateUniqueString } from '@/utils/common';
import ResultErrorVoucher from './ResultlErrorVoucher';
import { IError } from '../../booking-info/type';
import { useSelector } from 'react-redux';
import {
  apiBookingVoucher,
  apiBookingVoucherListDetail,
} from '@/api/features/booking';
import dayjs from 'dayjs';
import IndividualList from './../../individual-list/IndividualList';
import { IndividualListItem } from '../../individual-list/IndividualList.types';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId?: string | null;
  setVoucherCode?: React.Dispatch<React.SetStateAction<string>>;
  isView?: boolean;
  setErrorVoucher?: React.Dispatch<React.SetStateAction<IError[]>>;
  errorVoucher?: IError[];
  arrDeptDate?: [string, string] | null;
  isEdit?: boolean;
  voucherCode?: string;
  bookingStatus?: number;
  isGroup?: boolean;
  individualList?: IndividualListItem[];
}

const Voucher: React.FC<IProps> = ({
  isOpen,
  onClose,
  hotelId,
  setVoucherCode,
  errorVoucher,
  setErrorVoucher,
  isView = false,
  arrDeptDate,
  isEdit = false,
  voucherCode,
  bookingStatus,
  isGroup = false,
  individualList,
}) => {
  const [form] = Form.useForm();
  const [dataPage, setDataPage] = useState<any[]>([]);
  const [dataError, setDataError] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalError, setIsModalError] = useState(false);
  const [messageError, setMessageError] = useState<string>('');

  const handleAdd = async () => {
    setMessageError('');
    const dataForm = await form.validateFields();
    const voucherCodes = dataForm.voucher?.split(/[\s,]+/).filter(Boolean);

    if (!voucherCodes || voucherCodes.length === 0) {
      return;
    }

    for (const voucher of voucherCodes) {
      const formattedBody = {
        token: 'f0385fef831d6c6fb49a615a2c4f1ca',
        appName: 'TAPORTAL',
        tranNo: 'TAPORTAL',
        tranCode: voucher,
        hotelId: Number(hotelId),
        FromDate: arrDeptDate && arrDeptDate[0],
        ToDate: arrDeptDate && arrDeptDate[1],
      };

      const res = await apiBookingVoucher(formattedBody);

      if (res && res.isSuccess) {
        setDataPage(prevData => {
          const newItem = {
            id: generateUniqueString(),
            code: res.data.code,
            name: res.data.name,
            roomTypeId: res.data.roomTypeId,
            roomTypeName: res.data.roomTypeName,
            night: res.data.value,
            maxGuest: res.data.maxGuest,
            dateStart: dayjs(res.data.dateStart).format('YYYY-MM-DD'),
            dateEnd: dayjs(res.data.dateEnd).format('YYYY-MM-DD'),
            hotelId: hotelId,
          };

          const isDuplicate = prevData.some(
            item =>
              item.code === newItem.code &&
              item.name === newItem.name &&
              item.dateStart === newItem.dateStart &&
              item.dateEnd === newItem.dateEnd &&
              item.roomTypeId === newItem.roomTypeId
          );

          if (!isDuplicate) {
            return [...prevData, newItem];
          } else {
            setMessageError('Voucher is duplicated');
          }

          return prevData;
        });
      } else {
        setDataError(prevData => {
          const newItem = {
            id: generateUniqueString(),
            code: voucher,
            message: res.errors[0]?.message,
          };
          return [...prevData, newItem];
        });
      }
    }
    form.resetFields();
  };

  useEffect(() => {
    if (!isOpen) {
      const joinedCodes = dataPage.map(item => item.code).join(', ');
      setVoucherCode?.(joinedCodes);
    } else {
      form.resetFields();
      setDataError([]);
      setMessageError('');
    }
  }, [isOpen]);

  const onCancelDelete = () => {
    setIsModalDelete(false);
  };

  const onOkDelete = () => {
    const newDataSource = dataPage.filter(
      item => !selectedRowKeys.includes(item.id)
    );
    setDataPage(newDataSource);
    setSelectedRowKeys([]);
    setIsModalDelete(false);
    message.success('Delete successfully!');
  };

  const showDelete = () => {
    if (isEdit) {
      if (bookingStatus === 1 || bookingStatus === 3) {
        if (selectedRowKeys.length > 0) {
          setIsModalDelete(true);
        } else {
          message.error('Please select the data row to process.');
        }
      } else {
        message.error(
          "Vouchers can only be deleted for bookings with 'waiting' or 'confirmed' status."
        );
      }
    } else {
      if (selectedRowKeys.length > 0) {
        setIsModalDelete(true);
      } else {
        message.error('Please select the data row to process.');
      }
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const fetchVoucherList = async () => {
    console.log(voucherCode);
    if (voucherCode && dataPage.length === 0) {
      const formattedBody = {
        token: 'f0385fef831d6c6fb49a615a2c4f1ca',
        appName: 'TAPORTAL',
        tranNo: 'TAPORTAL',
        tranCode: voucherCode,
      };
      const res = await apiBookingVoucherListDetail(formattedBody);
      if (res && res.isSuccess) {
        const newVoucherList = res.data.map((item: any) => ({
          id: generateUniqueString(),
          code: item.code,
          name: item.name,
          roomTypeId: item.roomTypeId,
          roomTypeName: item.roomTypeName,
          night: item.value,
          maxGuest: item.maxGuest,
          dateStart: dayjs(item.dateStart).format('YYYY-MM-DD'),
          dateEnd: dayjs(item.dateEnd).format('YYYY-MM-DD'),
        }));

        const updatedVoucherList = newVoucherList.map((voucher: any) => {
          const matchingItem = individualList?.find(
            item => item.evoucherCode === voucher.code
          );
          if (matchingItem) {
            const roomIndex = (individualList || []).indexOf(matchingItem);
            return {
              ...voucher,
              roomNo: `#${roomIndex + 1}`,
            };
          }
          return voucher;
        });
        console.log(updatedVoucherList);
        setDataPage(updatedVoucherList);
      }
    }
  };

  useEffect(() => {
    fetchVoucherList();
  }, [voucherCode]);

  const checkVoucher = async () => {
    const filteredErrorRows =
      errorVoucher &&
      errorVoucher.filter(error => error.message === 'Voucher is invalid');
    setErrorVoucher?.(filteredErrorRows as any);
    const errorRows: { row: number; field: string; message: string }[] = [];

    for (const [index, row] of dataPage.entries()) {
      const formattedBody = {
        token: 'f0385fef831d6c6fb49a615a2c4f1ca',
        appName: 'TAPORTAL',
        tranNo: 'TAPORTAL',
        tranCode: row.code,
        hotelId: Number(hotelId),
      };

      try {
        const res = await apiBookingVoucher(formattedBody);
        if (res && !res.isSuccess) {
          errorRows.push({
            row: index,
            field: '',
            message: res?.errors?.[0]?.message,
          });
        }
      } catch (error) {
        console.error(`Error checking voucher at row ${index}:`, error);
      }
    }

    errorRows.length > 0 &&
      setErrorVoucher?.(prevErrors => {
        return [...prevErrors, ...errorRows];
      });
  };

  useEffect(() => {
    if (!arrDeptDate) return;

    const errorRows = dataPage
      .map((row, index) => {
        const arrivalDate = new Date(arrDeptDate[0]);
        const departureDate = new Date(arrDeptDate[1]);
        const totalNights = Math.ceil(
          (departureDate.getTime() - arrivalDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (totalNights < row.night) {
          return {
            row: index,
            field: '',
            message: 'Voucher is invalid',
          };
        }
        return null;
      })
      .filter(Boolean) as IError[];

    setErrorVoucher?.(prevErrors => {
      const filteredErrors = prevErrors.filter(
        error => error.message !== 'Voucher is invalid'
      );
      return [...filteredErrors, ...errorRows];
    });
  }, [arrDeptDate, dataPage]);

  const extendedColumn: any = [
    {
      title: 'No',
      dataIndex: 'no',
      width: 50,
      render: (text: number, record: any, index: number) => index + 1,
    },
    {
      title: 'Voucher Code',
      dataIndex: 'code',
      width: 200,
      render: (text: string, record: any, index: number) => (
        <span
          style={{
            color: errorVoucher?.some(error => error.row === index)
              ? '#DC2626'
              : '#1C1917',
          }}>
          {text}
        </span>
      ),
    },
    ...Columns({ isGroup }),
  ];

  return (
    <>
      <MyModal
        open={isOpen && !isModalError}
        title="Voucher"
        width={880}
        onCancel={onClose}
        footer={
          <MyButton onClick={onClose} buttonType="outline">
            Close
          </MyButton>
        }>
				<MyCardContent style={{ marginTop: 16 }}>
					<TableBasic
						dataSource={dataPage}
						columns={extendedColumn}
						// rowSelection={rowSelection}
						rowKey="id"
						isPaginationClient
					/>
				</MyCardContent>
      </MyModal>
    </>
  );
};

export default Voucher;
