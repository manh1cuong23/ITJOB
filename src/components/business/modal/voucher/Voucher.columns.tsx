import { formatNumberMoney } from '@/utils/common';
import { formatDateTable } from '@/utils/formatDate';

interface IColumnProps {
  isGroup?: boolean;
}

export const Columns = ({ isGroup }: IColumnProps): any => [
  {
    title: 'Room Type',
    dataIndex: 'roomTypeName',
    render: (_text: any, record: any) => _text,
    width: 120,
  },
  {
    title: 'Night',
    dataIndex: 'night',
    width: 90,
  },
  {
    title: 'Guest',
    dataIndex: 'maxGuest',
    width: 150,
  },
  ...(isGroup
    ? [
        {
          title: 'Room No',
          dataIndex: 'roomNo',
          width: 90,
          render: (text: string, record: any) => text,
        },
      ]
    : []),
  {
    title: 'Start date',
    dataIndex: 'dateStart',
    width: '200px',
    render: (text: string, record: any) => formatDateTable(text),
  },
  {
    title: 'End date',
    dataIndex: 'dateEnd',
    width: '200px',
    render: (text: string, record: any) => formatDateTable(text),
  },
];
