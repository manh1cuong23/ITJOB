import './style.less';
import { MyTableSumProps } from './type';
import { Table } from 'antd';
import { formatNumberMoney } from '@/utils/common';
import { useEffect } from 'react';
import TableBasic from './TableBasic';

const TableWithRowTotalSums = ({
  dataSource,
  columns,
  tableScrollY,
  tableScrollX = false,
  total,
  isEdit = false,
  ...rest
}: MyTableSumProps) => {
  return (
    <TableBasic
      columns={columns}
      dataSource={dataSource}
      tableScrollY={tableScrollY}
      tableScrollX={tableScrollX}
      className="scrollX"
      {...rest}
      summary={() => (
        <>
          <Table.Summary.Row className="row-without-border">
            {!rest.rowSelection && (
              <Table.Summary.Cell index={1} colSpan={4}></Table.Summary.Cell>
            )}
            <Table.Summary.Cell
              index={0}
              colSpan={rest.rowSelection ? (isEdit ? 8 : 7) : 3}>
              <span className="total-sum">Sum:</span>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <div>
                <span style={{ color: '#16A34A' }}>{total?.totalAdults}</span>
                <label style={{ color: '#57534E', margin: '0 5px' }}>
                  Adults
                </label>
                <span style={{ color: '#F59E0B' }}>{total?.totalChildren}</span>
                <label style={{ color: '#57534E', marginLeft: '5px' }}>
                  Childs
                </label>
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <span className="total-sum">
                {formatNumberMoney(total?.totalRate)}
              </span>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} colSpan={2}>
              <span className="total-sum">
                {formatNumberMoney(total?.specialServiceCharge)}
              </span>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4}>
              <span className="total-sum">
                {formatNumberMoney(total?.total)}
              </span>
            </Table.Summary.Cell>
            <Table.Summary.Cell
              index={1}
              colSpan={
                rest.rowSelection && !isEdit
                  ? columns && columns.length - 11
                  : columns && columns.length - 12
              }></Table.Summary.Cell>
          </Table.Summary.Row>
        </>
      )}
    />
  );
};

export default TableWithRowTotalSums;
