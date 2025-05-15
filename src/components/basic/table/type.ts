import { TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
export interface DataType<T> {
  [key: string]: T;
}

export interface PaginationType {
  current: number;
  pageSize: number;
  total: number;
}

export interface PageData {
  pageNumber: number;
  pageSize: number;
  total: number;
  data: any;
}

export interface TableFooterProps {
  onPageChange: ((page: number, pageSize: number) => void) | undefined;
  total: number;
  current: number;
  pageSize: number;
  isShowNote?: boolean;
}

export interface MyTableProps extends TableProps {
  dataSource: DataType<any>[];
  tableScrollY?: string;
  tableScrollX?: boolean;
  total?: number;
  filteredData?: any;
  paginationDetails?: PaginationType;
  onPaginationChange?: (page: number, pageSize: number) => void;
  rowSelection?: TableProps<any>['rowSelection'];
  isPaginationClient?: boolean;
  defaultScroolY?: number;
}

export interface MyTableSumProps extends TableProps {
  dataSource: DataType<any>[];
  columns: ColumnsType<any>;
  tableScrollY?: string;
  tableScrollX?: boolean;
  total?: Totals;
  filteredData?: any;
  paginationDetails?: PaginationType;
  onPaginationChange?: (page: number, pageSize: number) => void;
  isEdit?: boolean;
}

interface Totals {
  totalAdults: number;
  totalChildren: number;
  totalRate: number;
  specialServiceCharge: number;
  total: number;
}
