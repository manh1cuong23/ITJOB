import { Table, TablePaginationConfig } from 'antd';
import './style.less';
import { SharedLayoutTableProps } from './type';
import { TableCurrentDataSource } from 'antd/es/table/interface';

export const SharedLayoutTable = ({
  dataSource,
  columns,
  tableScrollY,
  clearFilter,
  onSort,
  ...rest
}: SharedLayoutTableProps) => {
  // Tính toán tổng chiều rộng các cột
  const totalWidth =
    columns &&
    columns.reduce((sum, column) => {
      const width =
        typeof column.width === 'number'
          ? column.width
          : typeof column.width === 'string'
            ? parseFloat(column.width)
            : 150; // Gán giá trị mặc định nếu không phải số
      return sum + width;
    }, 0);

  const handleTableChange = (
    _pagination: TablePaginationConfig,
    _filters: Record<string, any>,
    sorter: any,
    _extra: TableCurrentDataSource<any>
  ) => {
    const sortField = sorter.field;
    const sortOrder = sorter.order === 'ascend' ? 'ASC' : 'DESC';
    onSort && onSort(sortField, sortOrder);
  };
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      scroll={{ x: totalWidth, y: tableScrollY }}
      bordered
      sticky
      // locale={{
      //   emptyText: emptyText,
      // }}
      onChange={handleTableChange}
      {...rest}
    />
  );
};
