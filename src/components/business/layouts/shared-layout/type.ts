import { TableProps, FormInstance } from 'antd';
import { ColumnsType } from 'antd/es/table';

export interface SearchApi {
  (params?: any): CORE.MyResponse<CORE.PageData<any>>;
}
export interface DataType<T> {
  [key: string]: T;
}

export interface BookingRow {
  id: string;
  bookingStatus: number;
  bookingNo: string;
  arrivalDate: string;
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

export interface DataExport {
  total: number;
  data: any;
}
export interface QuickSearchOption {
  quickSearchFields: React.ReactNode;
  initialValueQuickSearch?: InitialValues;
}
export interface AdvanceSearchOption {
  advanceSearchFields: React.ReactNode;
  initialValueAdvanceSearch: InitialValues;
}
export interface SharedLayoutProps {
  columns: ColumnsType<any>;
  dataSource?: any;
  pageApi?: any;
  forceUpdate?: boolean;
  multipleSelection?: boolean;
  isRoomAvaibility?: boolean;
  propClearSearchCustom?: string | null | undefined;
  setSelectedRowData?: React.Dispatch<React.SetStateAction<BookingRow[]>>;
	setCustomFields?: React.Dispatch<React.SetStateAction<string[]>>;
  quickSearchOptions: QuickSearchOption;
  advanceSearchOptions?: AdvanceSearchOption;
  onSearch?: () => void;
  initialSearchField?: API.searchObj[];
  isPaginationClient?: boolean;
  fileName?: string;
  formatDataBeforeExport?: (data: any) => any;
  onClearSearch?: () => void;
  isShowNote?: boolean;
  isQuickSearchTop?: boolean;
  customButtons?: React.ReactNode;
	customBtns?: React.ReactNode;
  tableScrollY?: string;
  isShowExport?: boolean;
  excludeColumns?: string[];
  externalAdvanceSearchForm?: FormInstance;
	messageExportSuccess?: string;
	resetQuickSearch?: any;
	additionalInfo?: { key: string; value: any }[]
}
export interface SharedLayoutFooterProps {
  isRoomAvaibility?: boolean;
  onPageChange: ((page: number, pageSize: number) => void) | undefined;
  total: number;
  current: number;
  pageSize: number;
  isShowNote?: boolean;
}
export interface SharedLayoutHeaderProps {
  handleRefresh: () => void;
  customButtons?: React.ReactNode;
	customBtns?: React.ReactNode;
  searchParams?: API.searchObj[];
  setSearchParams?: React.Dispatch<React.SetStateAction<API.searchObj[]>>;
  quickSearchOptions: QuickSearchOption;
  advanceSearchOptions?: AdvanceSearchOption;
  onSearch?: (value: any) => void;
  propClearSearchCustom?: string | null | undefined;
  columns?: TableProps<DataType<any>>['columns'];
  dataSource?: DataType<any>[];
  fileName?: string;
  formatDataBeforeExport?: (data: any) => any;
  clearFilter?: boolean;
  isQuickSearchTop?: boolean;
  drawerVisible: boolean;
  setDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onAdvanceSearch: () => void;
  advanceSearchForm: FormInstance;
  quickSearchForm: FormInstance;
  isShowExport?: boolean;
	messageExportSuccess?: string;
	additionalInfo?: { key: string; value: any }[]
}
export interface SharedLayoutTableProps extends TableProps {
  dataSource: DataType<any>[];
  columns: TableProps<DataType<unknown>>['columns'];
  tableScrollY?: string;
  clearFilter?: () => void;
  onSort?: (field: string, order: string) => void;
}

export interface AdvancedSearchDrawerProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  onSearch?: (values: any) => void;
  // form: FormInstance;
  form: any;
  initialValues?: {
    initialValueAdvanceSearch?: Record<string, any>;
  };
  setActiveFiltersCount?: React.Dispatch<React.SetStateAction<number>>;
}
export interface InitialValues {
  [key: string]: any;
}
