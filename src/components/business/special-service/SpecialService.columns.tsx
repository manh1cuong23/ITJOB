import { formatNumberMoney } from '@/utils/common';

export const ColumnsView: any = [
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    width: '80px',
    render: (text: number, record: any) => text,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    className: 'text-right',
    render: (text: number) => <span>{formatNumberMoney(text)}</span>,
    width: '96px',
  },
  {
    title: 'From Date',
    dataIndex: 'fromDate',
    render: (_text: any, record: any) => _text,
    width: '124px',
  },
  {
    title: 'To Date',
    dataIndex: 'toDate',
    render: (_text: any, record: any) => _text,
    width: '124px',
  },
  {
    title: 'Total',
    dataIndex: 'totalAmount',
    className: 'text-right',
    render: (text: number) => (
      <span>{!isNaN(text) ? formatNumberMoney(text) : ''}</span>
    ),
    width: '124px',
  },
  {
    title: 'Remark',
    dataIndex: 'remark',
    width: '200px',
    render: (text: string, record: any) => text,
  },
];
