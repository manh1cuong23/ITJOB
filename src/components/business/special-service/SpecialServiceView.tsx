import './style.less';
import { ISpecialServiceList } from './type';
import { TableWithRowTotal } from '@/components/basic/table';
import { ColumnsView } from './SpecialService.columns';
import { useEffect } from 'react';
interface IProps {
  dataSource: ISpecialServiceList[];
  setSpecialSvcAmt?: React.Dispatch<React.SetStateAction<number>>;
  isGroup?: boolean;
}
const SpecialServiceView = (props: IProps) => {
  const { dataSource, setSpecialSvcAmt, isGroup = false } = props;

  const totalSum = dataSource
    .filter(item => item.totalAmount != null && !isNaN(item.totalAmount))
    .reduce((sum, item) => sum + item.totalAmount, 0);

  useEffect(() => {
    if (setSpecialSvcAmt && totalSum) {
      setSpecialSvcAmt(totalSum);
    }
  }, [totalSum]);

  const columns: any = [
    {
      title: 'Special Service',
      dataIndex: 'serviceCode',
      width: '200px',
      render: (_value: string, record: any, index: number) => (
        <span>{`${record.serviceCode} - ${record.serviceName}`}</span>
      ),
    },
    ...(isGroup
      ? [
          {
            title: 'Room no',
            dataIndex: 'roomNo',
            width: '83px',
            render: (text: string | string[], record: any) => {
              return Array.isArray(text) ? text.join(', ') : text;
            },
          },
        ]
      : []),
    ...ColumnsView,
  ];

  return (
    <TableWithRowTotal
      dataSource={dataSource}
      columns={columns}
      total={totalSum}
      rowKey="id"
    />
  );
};
export default SpecialServiceView;
