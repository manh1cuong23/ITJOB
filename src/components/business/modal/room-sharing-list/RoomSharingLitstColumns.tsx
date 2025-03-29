import dayjs from 'dayjs';

export const tableColumns: any = [
  {
    title: 'Identity no',
    key: 'idNo',
    dataIndex: 'idNo',
    width: 160,
    align: 'left',
    type: 'string',
    render: (text: any) => text || '-',
  },
  {
    title: 'Arrival Date',
    key: 'arrivalDate',
    dataIndex: 'arrivalDate',
    width: 120,
    align: 'left',
    type: 'string',
    render: (text: any) => dayjs(text).format('DD/MM/YYYY'),
  },
  {
    title: 'Departure Date',
    key: 'departureDate',
    dataIndex: 'departureDate',
    width: 120,
    align: 'left',
    type: 'string',
    render: (text: any) => dayjs(text).format('DD/MM/YYYY'),
  },
  {
    title: 'Remark',
    key: 'remark',
    dataIndex: 'remark',
    width: 120,
    align: 'left',
    type: 'string',
  },
];

export const tableColumnsGroup: any = [
  {
    title: 'Room No',
    key: 'roomNo',
    dataIndex: 'roomNo',
    width: 90,
    align: 'left',
    type: 'string',
  },
  {
    title: 'Guest Type',
    key: 'guestType',
    dataIndex: 'guestType',
    width: 120,
    align: 'left',
    type: 'string',
  },
];
