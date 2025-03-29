export const columns: any = [
  {
    title: 'No',
    key: 'idNo',
    dataIndex: 'idNo',
    width: 50,
    render: (text: any, record: any, index: number) => index + 1,
  },
  {
    title: 'Market Segment',
    key: 'marketSegment',
    dataIndex: 'marketSegment',
    width: 120
  },
  {
    title: 'Rate Code',
    key: 'rateCode',
    dataIndex: 'rateCode',
    width: 120,
  },
  {
    title: 'Room Type',
    key: 'roomType',
    dataIndex: 'roomType',
    width: 120,
  },
	{
    title: 'Package Plan',
    key: 'packagePlan',
    dataIndex: 'packagePlan',
    width: 120,
  },
];
