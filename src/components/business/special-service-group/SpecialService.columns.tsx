// SpecialServiceColumns.tsx
import React from 'react';
import { Popover, Tooltip } from 'antd';
import { formatNumberMoney } from '@/utils/common';
import { MyDatePicker } from '@/components/basic/datepicker';
import { MyTextArea } from '@/components/basic/input';
import { ReactComponent as AddSvg } from '@/assets/icons/ic_add.svg';
import { ReactComponent as MinusSvg } from '@/assets/icons/ic_minus.svg';
import { ReactComponent as ListCollapseSvg } from '@/assets/icons/ic_list-collapse.svg';
import { ReactComponent as ListCheckSvg } from '@/assets/icons/ic_list-check.svg';
import { ReactComponent as PenSvg } from '@/assets/icons/ic_pen.svg';
import { css } from '@emotion/react';
import { ColumnsType } from 'antd/es/table';
import { DataTypeCoumn } from '@/containers/booking/Columns';
import dayjs, { Dayjs } from 'dayjs';
import { IError } from '../booking-info/type';

export const dateCellStyles = css`
  .ant-picker {
    transition: border 0.3s ease;
    border: 1px solid transparent;
  }
  &:hover .ant-picker {
    border: 1px solid #ed4e6b;
  }
`;

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

interface SortState {
  field: string;
  direction: 'ascend' | 'descend' | null;
}

interface IColumnProps {
  handleSave: (row: any) => void;
  handleQuantityChange: (record: any, change: number) => void;
  handleRemarkChange: (record: any, value: string) => void;
  handleKeyPress: (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    record: any
  ) => void;
  arrDeptDate?: [string, string] | null;
  popoverVisible: number | null;
  setPopoverVisible: (visible: number | null) => void;
  isGrouped: boolean;
  toggleGroup: () => void;
  messageError?: IError[];
  sortState: SortState;
  onSort: (field: string) => void;
  setRemarkValue: (value: string | null) => void;
  remarkValue: string | null;
  hasRestrictedRoomNo: (record: any) => boolean;
}

export const SpecialServiceColumns = (
  props: IColumnProps
): ColumnsType<DataTypeCoumn> => {
  const compareRoomNumbers = (a: any, b: any) => {
    if (!a.roomNo && !b.roomNo) return 0;
    if (!a.roomNo) return 1;
    if (!b.roomNo) return -1;

    const aStr = a.roomNo.map((room: any) => room.value).join(', ');
    const bStr = b.roomNo.map((room: any) => room.value).join(', ');

    return aStr.localeCompare(bStr);
  };

  return [
    {
      title: (
        <div className="group-title">
          {!props.isGrouped ? (
            <ListCollapseSvg
              className="group-icon"
              onClick={props.toggleGroup}
            />
          ) : (
            <ListCheckSvg className="group-icon" onClick={props.toggleGroup} />
          )}
          Special Service
        </div>
      ),
      dataIndex: 'serviceCode',
      width: 200,
      render: (_value: string, record: any, index: number) => (
        <span
          style={{
            color: props.messageError?.some(error => error.row === index)
              ? '#DC2626'
              : '#1C1917',
          }}>{`${record.serviceCode} - ${record.serviceName}`}</span>
      ),
    },
    {
      title: 'Room No',
      dataIndex: 'roomNo',
      width: 110,
      sortOrder:
        props.sortState.field === 'roomNo' ? props.sortState.direction : null,
      sorter: {
        compare: (a, b) => {
          const compareResult = compareRoomNumbers(a, b);
          return props.sortState.direction === 'ascend'
            ? compareResult
            : -compareResult;
        },
      },
      onHeaderCell: () => ({
        onClick: () => props.onSort('roomNo'),
      }),
      render: (text: string, record: any) => {
        return text;
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 100,
      render: (text: number, record: any) =>
        text && (
          <div className="quantity-row">
            <MinusSvg
              onClick={() =>
                props.hasRestrictedRoomNo(record)
                  ? {}
                  : props.handleQuantityChange(record, -1)
              }
              className="minus-quantity-btn"
              style={{
                opacity: props.hasRestrictedRoomNo(record) ? 0.5 : 1,
                cursor: props.hasRestrictedRoomNo(record) ? 'auto' : 'pointer',
              }}
            />
            <span style={{ margin: '0 0px' }}>{text}</span>
            <AddSvg
              onClick={() =>
                props.hasRestrictedRoomNo(record)
                  ? {}
                  : props.handleQuantityChange(record, 1)
              }
              className="add-quantity-btn"
              style={{
                opacity: props.hasRestrictedRoomNo(record) ? 0.5 : 1,
                cursor: props.hasRestrictedRoomNo(record) ? 'auto' : 'pointer',
              }}
            />
          </div>
        ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      className: 'text-right',
      render: (text: number) => text && <span>{formatNumberMoney(text)}</span>,
      width: 110,
    },
    {
      title: 'From Date',
      dataIndex: 'fromDate',
      width: 150,
      render: (_text: string, record: any) =>
        _text !== '-' && (
          <div css={dateCellStyles}>
            <MyDatePicker
              value={_text}
              disabled={props.hasRestrictedRoomNo(record)}
              onChange={date => props.handleSave({ ...record, fromDate: date })}
              disabledDate={currentDate =>
                getDisabledDate(
                  currentDate,
                  props.arrDeptDate ?? null,
                  null,
                  record.toDate
                )
              }
            />
          </div>
        ),
    },
    {
      title: 'To Date',
      dataIndex: 'toDate',
      render: (_text: string, record: any) =>
        _text !== '-' && (
          <div css={dateCellStyles}>
            <MyDatePicker
              value={_text}
              disabled={props.hasRestrictedRoomNo(record)}
              onChange={date => props.handleSave({ ...record, toDate: date })}
              placeholder="Select"
              disabledDate={currentDate =>
                getDisabledDate(
                  currentDate,
                  props.arrDeptDate ?? null,
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
        <span>
          {text && !isNaN(Number(text)) ? formatNumberMoney(text) : ''}
        </span>
      ),
      width: 150,
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      render: (text: string, record: any) =>
        record.price &&
        record.quantity && (
          <Popover
            content={
              <div>
                <span className="remark-txt">Remark</span>
                <MyTextArea
                  value={props.remarkValue !== null ? props.remarkValue : text}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  onChange={e => props.setRemarkValue(e.target.value)}
                  onKeyDown={e => props.handleKeyPress(e, record)}
                  onBlur={e => props.handleRemarkChange(record, e.target.value)}
                />
              </div>
            }
            trigger="click"
            open={props.popoverVisible === record.id}
            onOpenChange={visible => {
              if (visible) {
                props.setRemarkValue(record.remark);
              } else {
                props.setRemarkValue(null);
              }
              !props.hasRestrictedRoomNo(record) &&
                props.setPopoverVisible(visible ? record.id : null);
            }}>
            <div className="remark-wrapper">
              <Tooltip title={text}>
                <span style={{ cursor: 'pointer' }}>{text || '-'}</span>
              </Tooltip>
              <PenSvg width={14} height={14} className="pen-icon" />
            </div>
          </Popover>
        ),
      width: 150,
    },
  ];
};
