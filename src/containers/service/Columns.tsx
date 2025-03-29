import { ColumnsType } from 'antd/es/table';
import { DataType } from '@/components/business/layouts/shared-layout/type';
import { formatDateTable } from '@/utils/formatDate';
import { calculateTotalPrice, formatNumberMoney } from '@/utils/common';
import { TableProps } from 'antd/lib';
import { Navigate, useNavigate } from 'react-router-dom';
import { ReactComponent as AdultSvg } from '@/assets/icons/ic_adult.svg';
import { ReactComponent as ChildSvg } from '@/assets/icons/ic_child.svg';
import BookingStatus from '@/components/business/tags/BookingStatus';
import StatusRate from '@/components/business/tags/StatusRate';
import moment from 'moment';
import { Tooltip } from 'antd';

export interface DataTypeCoumn {
  id?: number;
  bookingNo: string;
  hotelId: string | number;
  guestName: string;
  guestNum: string;
  createdBy: string;
  bookingType: string;
  bookingStatus: number;
  createdDate: string;
  arrivalDate: string;
  departureDate: string;
  roomCharge: number;
  specialService: string;
  total: number;
  remark: string;
  totalAdults: number;
  totalChildren: number;
  hotel: any;
  bookingGuestInfos: any;
  bookingExtraServices: any;
  guest: any;
}

const Columns: ColumnsType<DataTypeCoumn> &
  TableProps<DataType<any>>['columns'] = [
  {
    title: 'Hotel',
    dataIndex: 'hotel',
    key: 'hotel',
    align: 'center',
    width: 180,
    render: (_value, record) => (
      <div style={{ textAlign: 'left' }}>{record?.hotel?.short_name}</div>
    ),
  },
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    width: 150,
    align: 'center',
    render: text => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Description',
    key: 'description',
    dataIndex: 'description',
    width: 150,
    align: 'center',
    ellipsis: true, // Giới hạn nội dung với dấu ba chấm
    render: (text: string) => (
      <Tooltip title={text} placement="topLeft">
        <span
          style={{
            display: 'inline-block',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {<div style={{ textAlign: 'left' }}>{text}</div>}
        </span>
      </Tooltip>
    ),
  },
  {
    title: 'Adult Price',
    key: 'adult_price',
    dataIndex: 'adult_price',
    width: 120,
    align: 'center',
    render: (value: number) => {
      return (
        <div style={{ textAlign: 'right' }}>
          {value ? Number(value)?.toLocaleString('de-DE') : ''}
        </div>
      ); // Chuyển giá trị thành chuỗi với dấu phẩy ngăn cách
    },
  },
  {
    title: 'Over 6 Years Price',
    key: 'over_6_years_price',
    dataIndex: 'over_6_years_price',
    width: 150,
    align: 'center',
    render: (value: number) => {
      return (
        <div style={{ textAlign: 'right' }}>
          {value ? Number(value)?.toLocaleString('de-DE') : ''}
        </div>
      ); // Chuyển giá trị thành chuỗi với dấu phẩy ngăn cách
    },
  },
  {
    title: 'Under 6 Years Price',
    key: 'under_6_years_price',
    dataIndex: 'under_6_years_price',
    align: 'center',
    width: 150,
    render: (value: number) => {
      return (
        <div style={{ textAlign: 'right' }}>
          {value ? Number(value)?.toLocaleString('de-DE') : ''}
        </div>
      );
    },
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    width: 120,
    align: 'center',
    render: (status: any) => {
      return (
        <span style={{ textAlign: 'left' }}>
          <StatusRate status={status} />
        </span>
      );
    },
  },
  {
    title: 'Created At',
    key: 'date_created',
    dataIndex: 'date_created',
    width: 130,
    align: 'center',
    render: (date: string | null) => {
      return date ? moment(date).format('DD/MM/YYYY HH:mm') : '';
    },
  },
  {
    title: 'Created By',
    key: 'username_created',
    dataIndex: 'username_created',
    width: 140,
    align: 'center',
    render: text => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Modified At',
    key: 'date_updated',
    dataIndex: 'date_updated',
    width: 130,
    align: 'center',
    render: (date: string | null) => {
      return date ? moment(date).format('DD/MM/YYYY HH:mm') : '';
    },
  },
  {
    title: 'Modified By',
    key: 'username_modified',
    dataIndex: 'username_modified',
    width: 140,
    align: 'center',
    render: text => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
];

export default Columns;
