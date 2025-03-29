import { Table } from 'antd';
import './style.less';
import { MyTableProps } from './type';
import NoData from './TableNoData';
import { useState } from 'react';

const TableBasic = ({
  dataSource,
  columns,
  tableScrollY,
  paginationDetails,
  onPaginationChange,
  className,
  rowSelection,
  tableScrollX = false,
  isPaginationClient = false,
  ...rest
}: MyTableProps) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const autoPagination =
    dataSource && isPaginationClient && !(paginationDetails || rest.pagination)
      ? {
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: dataSource.length,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50', '100'],
          showTotal: (total: number) => `Total: ${total}`,
          onChange: (page: number, pageSize: number) => {
            setPagination({ current: page, pageSize });
          },
          onShowSizeChange: (current: number, pageSize: number) => {
            setPagination({ current: current, pageSize });
          },
        }
      : false;
  const paginationConfig =
    paginationDetails || rest.pagination
      ? {
          current: paginationDetails?.current || 1,
          pageSize: paginationDetails?.pageSize || 10,
          total: paginationDetails?.total || 0,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50', '100'],
          showTotal: (total: number) => `Total: ${total}`,
          onChange: (page: number, pageSize: number) => {
            if (onPaginationChange) {
              onPaginationChange(page, pageSize);
            }
          },
          onShowSizeChange: (current: number, size: number) => {
            if (onPaginationChange) {
              onPaginationChange(current, size);
            }
          },
        }
      : autoPagination;

  const totalWidth =
    columns &&
    columns.reduce((sum, column) => {
      const width =
        typeof column.width === 'number'
          ? column.width
          : typeof column.width === 'string'
          ? parseFloat(column.width)
          : 150; // Default value if width is not a number
      return sum + width;
    }, 0);

  const scroll =
    dataSource && dataSource.length > 6
      ? { y: 240, x: tableScrollX ? totalWidth : 0 }
      : { x: tableScrollX ? totalWidth : 0 };

  return (
    <>
      <Table
        className={`custum-table ${className} ${
          scroll ? 'custom-scroll-table' : ''
        }`}
        columns={columns}
        dataSource={dataSource}
        pagination={paginationConfig}
        rowSelection={rowSelection ? rowSelection : undefined}
        bordered
        sticky
        locale={{ emptyText: <NoData isSearched={false} /> }}
        scroll={scroll}
        {...rest}
      />
    </>
  );
};

export default TableBasic;
