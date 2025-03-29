import './style.less';
import { MyTableProps } from './type';
import { Table } from 'antd';
import { formatNumberMoney } from '@/utils/common';
import TableBasic from './TableBasic';
import { useEffect } from 'react';

const TableWithRowTotal = ({
  dataSource,
  columns,
  tableScrollY,
  tableScrollX = false,
  total,
  className,
  ...rest
}: MyTableProps) => {
  return (
    <TableBasic
      columns={columns}
      dataSource={dataSource}
      tableScrollY={tableScrollY}
      tableScrollX={tableScrollX}
      {...rest}
      summary={() => (
        <>
          {dataSource.length > 0 && (
            <Table.Summary.Row className="row-without-border">
              <Table.Summary.Cell
                index={0}
                colSpan={
                  rest.rowSelection
                    ? columns && columns.length
                    : columns && columns.length - 1
                }>
                <span className="total-sum">
                  Sum:{' '}
                  {total !== undefined && !isNaN(total)
                    ? formatNumberMoney(total)
                    : 0}
                </span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={1}></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        </>
      )}
    />
  );
};

export default TableWithRowTotal;
