/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { ReactComponent as AddSvg } from '@/assets/icons/ic_add.svg';
import { ReactComponent as MinusSvg } from '@/assets/icons/ic_minus.svg';
import { ReactComponent as InforSvg } from '@/assets/icons/ic_infor.svg';
import { ReactComponent as DeleteSvg } from '@/assets/icons/ic-delete.svg';
import { MyTextArea } from '@/components/basic/input';
import './style.less';
import { formatNumberMoney } from '@/utils/common';
import { MyDatePicker } from '@/components/basic/datepicker';
import { ReactComponent as PenSvg } from '@/assets/icons/ic_pen.svg';
import { apiSpecialServiceList } from '@/api/features/booking';
import { ISpecialServiceList } from './type';
import dayjs, { Dayjs } from 'dayjs';
import TableWithRowTotalAndRowAdd from '@/components/basic/table/TableWithRowTotalAndRowAdd';
import DeleteModal from '@/components/business/modal/shared-delete-confirm/SharedDeleteConfirm';
import { message, Popover } from 'antd';
import { IError } from '../booking-info/type';
interface IProps {
  bookingData?: any;
  arrDeptDate?: [string, string] | null;
  removeItemFlag?: boolean;
  dataSource: ISpecialServiceList[];
  setSpecialSvcAmt?: React.Dispatch<React.SetStateAction<number>>;
  setDataSource: React.Dispatch<React.SetStateAction<ISpecialServiceList[]>>;
  errorSpecialService?: IError[];
  hotelId: string | null;
}
const SpecialService = (props: IProps) => {
  const {
    bookingData,
    removeItemFlag,
    dataSource,
    setDataSource,
    setSpecialSvcAmt,
    arrDeptDate,
    errorSpecialService,
    hotelId,
  } = props;
  const [specialServiceList, setSpecialServiceList] = useState<
    ISpecialServiceList[]
  >([]);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [remarkValue, setRemarkValue] = useState<string | null>(null);

  useEffect(() => {
    const newData = dataSource.map(row => {
      const dayDifference =
        Math.ceil(
          (dayjs(row.toDate, 'DD/MM/YYYY').toDate().getTime() -
            dayjs(row.fromDate, 'DD/MM/YYYY').toDate().getTime()) /
            (1000 * 3600 * 24)
        ) + 1;
      if (!dayDifference) return { ...row };
      const totalAmount = row.quantity * row.price * dayDifference;
      return { ...row, totalAmount: totalAmount };
    });
    setDataSource(newData);
  }, [bookingData]);

  const [popoverVisible, setPopoverVisible] = useState<number | null>(null);
  const [mainTableSelectedRowKeys, setMainTableSelectedRowKeys] = useState<
    React.Key[]
  >([]);
  function parseDate(date: string | [string, string]): {
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
  useEffect(() => {
    handleRemoveSpecialService();
  }, [removeItemFlag]);

  const handleSave = (row: any) => {
    const newData = [...dataSource];
    const { fromDate, toDate } = parseDate([row.fromDate, row.toDate]);

    const dayDifference =
      Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) +
      1;
    const totalAmount = row.quantity * row.price * dayDifference;

    const duplicateIndex = newData.findIndex(
      item =>
        item.no === row.no &&
        row.fromDate &&
        row.toDate &&
        item.fromDate === row.fromDate &&
        item.toDate === row.toDate &&
        item.serviceCode === row.serviceCode &&
        item.id !== row.id
    );

    if (duplicateIndex !== -1) {
      newData[duplicateIndex].quantity += row.quantity;
      newData[duplicateIndex].totalAmount =
        newData[duplicateIndex].quantity *
        newData[duplicateIndex].price *
        dayDifference;

      // Xóa dòng hiện tại nếu trùng lặp
      const currentIndex = newData.findIndex(item => item.id === row.id);
      if (currentIndex !== -1) {
        newData.splice(currentIndex, 1); // Xóa dòng hiện tại bằng id
      }
    } else {
      // Nếu không trùng, thêm mới hoặc cập nhật dòng
      const index = newData.findIndex(item => item.id === row.id);
      if (index !== -1) {
        newData.splice(index, 1, {
          ...newData[index],
          ...row,
          totalAmount: totalAmount,
        });
      } else {
        newData.push({ ...row, totalAmount });
      }
    }

    setDataSource(newData);
  };
  const handleQuantityChange = (
    record: any,
    change: number,
    max: number = 1000
  ) => {
    const newQuantity = record.quantity + change;
    if (newQuantity >= 1 && newQuantity <= max) {
      handleSave({ ...record, quantity: newQuantity });
    }
  };
  const handleRemarkChange = (record: any, value: string) => {
    handleSave({ ...record, remark: value });
    setPopoverVisible(null); // Đóng Popover sau khi nhấn Enter
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    record: any
  ) => {
    if (e.key === 'Enter' && e.altKey) {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const cursorPosition = textarea.selectionStart;

      const newValue =
        textarea.value.slice(0, cursorPosition) +
        '\n' +
        textarea.value.slice(cursorPosition);

      textarea.value = newValue;
      textarea.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleRemarkChange(record, (e.target as HTMLTextAreaElement).value);
    }
  };

  const getDisabledDate = (
    currentDate: Dayjs | null,
    value: [string, string] | null,
    fromDate: string | null,
    toDate: string | null,
    format: string = 'YYYY-MM-DD'
  ) => {
    const startDate = value && value[0] ? dayjs(value[0], 'YYYY-MM-DD') : null;
    const endDate = value && value[1] ? dayjs(value[1], 'YYYY-MM-DD') : null;
    const parsedFromDate = fromDate ? dayjs(fromDate, format) : null;
    const parsedToDate = toDate ? dayjs(toDate, format) : null;

    if (!currentDate) return false;

    const isBeforeStart = startDate
      ? currentDate.isBefore(startDate, 'day')
      : false;
    const isAfterEnd = endDate ? currentDate.isAfter(endDate, 'day') : false;
    const isBeforeFromDate = parsedFromDate
      ? currentDate.isBefore(parsedFromDate, 'day')
      : false;
    const isAfterToDate = parsedToDate
      ? currentDate.isAfter(parsedToDate, 'day')
      : false;

    return isBeforeStart || isAfterEnd || isBeforeFromDate || isAfterToDate;
  };

  const columns = [
    {
      title: 'Service',
      dataIndex: 'serviceCode',
      width: 200,
      render: (_value: string, record: any, index: number) => (
        <span
          style={{
            color: errorSpecialService?.some(error => error.row === index)
              ? '#DC2626'
              : '#1C1917',
          }}>{`${record.serviceCode} - ${record.serviceName}`}</span>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 100,
      render: (text: number, record: any) => (
        <div className="quantity-row">
          <MinusSvg
            onClick={() => handleQuantityChange(record, -1)}
            className="minus-quantity-btn"
          />
          <span style={{ margin: '0 0px' }}>{text}</span>
          <AddSvg
            onClick={() => handleQuantityChange(record, 1)}
            className="add-quantity-btn"
          />
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      className: 'text-right',
      render: (text: number) => <span>{formatNumberMoney(text)}</span>, // Không cho phép edit
      width: 110,
    },
    {
      title: 'From Date',
      dataIndex: 'fromDate',
      render: (_text: any, record: any) => (
        <div css={dateCellStyles}>
          <MyDatePicker
            value={_text}
            defaultDate={arrDeptDate?.[0]}
            onChange={date => handleSave({ ...record, fromDate: date })}
            disabledDate={currentDate =>
              getDisabledDate(
                currentDate,
                arrDeptDate ?? null,
                null,
                record.toDate
              )
            }
          />
        </div>
      ),
      width: 150,
    },
    {
      title: 'To Date',
      dataIndex: 'toDate',
      render: (_text: any, record: any) => (
        <div css={dateCellStyles}>
          <MyDatePicker
            value={_text}
            onChange={date => handleSave({ ...record, toDate: date })}
            placeholder="Select"
            defaultDate={arrDeptDate?.[1]}
            disabledDate={currentDate =>
              getDisabledDate(
                currentDate,
                arrDeptDate ?? null,
                record.fromDate,
                null
              )
            }
          />
        </div>
      ),
      width: 150,
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      className: 'text-right',
      render: (text: number) => (
        <span>{!isNaN(text) ? formatNumberMoney(text) : ''}</span>
      ),
      width: 110,
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      width: 200,
      render: (text: string, record: any) => (
        <Popover
          content={
            <div>
              <span className="remark-txt">Remark</span>
              <MyTextArea
                value={remarkValue !== null ? remarkValue : text}
                autoSize={{ minRows: 3, maxRows: 5 }}
                onKeyDown={e => handleKeyPress(e, record)}
                onChange={e => setRemarkValue(e.target.value)}
                onBlur={e => handleRemarkChange(record, e.target.value)}
              />
            </div>
          }
          trigger="click"
          open={popoverVisible === record.id}
          onOpenChange={visible => {
            if (visible) {
              setRemarkValue(record.remark);
            } else {
              setRemarkValue(null);
            }
            setPopoverVisible(visible ? record.id : null);
          }}>
          <div className="remark-wrapper">
            <span style={{ cursor: 'pointer' }}>{text || '-'}</span>
            <PenSvg width={14} height={14} className="pen-icon" />
          </div>
        </Popover>
      ),
    },
  ];

  const totalSum = dataSource
    .filter(item => item.totalAmount != null && !isNaN(item.totalAmount))
    .reduce((sum, item) => sum + item.totalAmount, 0);

  useEffect(() => {
    if (totalSum && setSpecialSvcAmt) {
      setSpecialSvcAmt(totalSum);
    }
  }, [totalSum]);

  const handleRemoveSpecialService = () => {
    const newDataSource = dataSource.filter(
      item => !mainTableSelectedRowKeys.includes(item.id)
    );
    setDataSource(newDataSource);
    setMainTableSelectedRowKeys([]);
    setIsModalDelete(false);
  };

  const fetchSpecialService = async () => {
    try {
      const response = await apiSpecialServiceList(hotelId);
      if (response && response.status) {
        const updatedData = response.result.data.map(item => ({
          ...item,
          quantity: 1,
        }));
        setSpecialServiceList(updatedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchSpecialService();
  }, [hotelId]);

  const mainTableRowSelection = {
    selectedRowKeys: mainTableSelectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setMainTableSelectedRowKeys(selectedRowKeys);
    },
  };

  const errorMessages = Array.from(
    new Set(errorSpecialService?.map(error => error.field))
  ).join(', ');

  const showDelete = () => {
    if (mainTableSelectedRowKeys.length > 0) {
      setIsModalDelete(true);
    } else {
      message.error('Please select the data row to process.');
    }
  };

  const onCancelDelete = () => {
    setIsModalDelete(false);
  };

  return (
    <>
      {dataSource.length > 0 ? (
        <>
          <div className="action">
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={event => {
                event.stopPropagation();
                showDelete();
              }}>
              <DeleteSvg />
              <span style={{ marginLeft: '5px' }}>Delete</span>
            </div>
          </div>
          <TableWithRowTotalAndRowAdd
            dataSource={dataSource}
            columns={columns}
            specialServiceList={specialServiceList}
            setSpecialServiceData={setDataSource}
            total={totalSum}
            rowSelection={mainTableRowSelection}
            rowKey="id"
            hotelId={hotelId}
          />
          {errorMessages && (
            <div
              style={{
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '5px',
              }}>
              <InforSvg width={15} height={15} className="icon-infor-error" />
              {errorMessages} are required for each day!
            </div>
          )}
        </>
      ) : (
        <TableWithRowTotalAndRowAdd
          dataSource={[]}
          columns={columns}
          specialServiceList={specialServiceList}
          setSpecialServiceData={setDataSource}
          rowSelection={mainTableRowSelection}
          rowKey="id"
          hotelId={hotelId}
        />
      )}
      <DeleteModal
        content="Are you sure to delete the record(s)?"
        visible={isModalDelete}
        onOk={handleRemoveSpecialService}
        onCancel={onCancelDelete}
      />
    </>
  );
};
const dateCellStyles = css`
  .ant-picker {
    transition: border 0.3s ease;
    border: 1px solid transparent;
  }
  &:hover .ant-picker {
    border: 1px solid #ed4e6b;
  }
`;
export default SpecialService;
