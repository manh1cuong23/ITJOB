import './style.less';
import { SharedLayoutHeader } from './SharedLayoutHeader';
import { SharedLayoutTable } from './SharedLayoutTable';
import { SharedLayoutFooter } from './SharedLayoutFooter';
import { DataExport, PageData, SharedLayoutProps } from './type';
import { useStates } from '@/utils/use-states';
import { useCallback, useEffect, useRef, useState } from 'react';
import SharedTableNotFoundData from './SharedTableNotFoundData';
import SharedTableLoading from './SharedTableLoading';
import { debounce } from 'lodash';
import { Button, Form } from 'antd';
import { MyButton } from '@/components/basic/button';
import { ReloadOutlined, UpOutlined } from '@ant-design/icons';
import { ReactComponent as SearchSvg } from '@/assets/icons/ic_search_quick.svg';

const SharedLayout = (props: SharedLayoutProps) => {
  const {
    columns,
    pageApi,
    dataSource,
    forceUpdate = false,
    multipleSelection,
    setSelectedRowData,
    setCustomFields,
    quickSearchOptions,
    advanceSearchOptions,
    onSearch,
    initialSearchField,
    isPaginationClient = false,
    fileName,
    propClearSearchCustom,
    formatDataBeforeExport,
    onClearSearch,
    isShowNote,
    isQuickSearchTop = false,
    customButtons,
    customBtns,
    tableScrollY = `calc(100vh - ${290}px)`,
    isShowExport = true,
    excludeColumns,
    isRoomAvaibility = false,
    externalAdvanceSearchForm,
    messageExportSuccess,
    resetQuickSearch,
    additionalInfo,
  } = props;
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] = useState<API.searchObj[]>([]);
  const [initialPageData, setInitialPageData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);
  const renderCount = useRef(0);

  const [pageData, setPageData] = useStates<PageData>({
    pageSize: 15,
    pageNumber: 1,
    total: 0,
    data: [],
  });
  const [dataExport, setDataExport] = useStates<DataExport>({
    total: 0,
    data: [],
  });
  const [clearFilter, setClearFilter] = useState<boolean>(false);
  useEffect(() => {
    if (initialSearchField && initialSearchField.length > 0) {
      getPageDataDebounced();
    }
  }, [initialSearchField]);
  const getPageData = useCallback(
    async (pageParams: Record<string, any> = {}) => {
      try {
        if (pageApi) {
          let timeout: NodeJS.Timeout;
          setLoading(true);
          setProgress(0);

          const finalSearchFields =
            Array.isArray(searchParams) && searchParams.length > 0
              ? // && searchParams.every(item => item.value !== '')
                searchParams
              : initialSearchField;

          const obj = {
            ...pageParams,
            searchFields: pageParams.searchFields ?? finalSearchFields,
            sortFields: {
              sortFields: sortField || pageParams.sortFields,
              sortOrder: sortOrder || pageParams.sortOrder,
            },
            pagination: {
              pageNum: pageParams.pageNumber || pageData.pageNumber,
              pageSize: pageParams.pageSize || pageData.pageSize,
            },
          };
          const res = await pageApi(obj);
          if (res && res.status) {
            setInitialPageData(res.result.data);
            if (isPaginationClient) {
              const { pageNumber, pageSize } = pageData;
              const startIndex = (pageNumber - 1) * pageSize;
              const endIndex = startIndex + pageSize;
              // Lấy dữ liệu theo phân trang từ pageData
              const paginatedData = res.result.data.slice(startIndex, endIndex);
              setPageData({
                total: res.result.data.length,
                data: paginatedData,
              });
              setDataExport({
                total: res.result.data.length,
                data: paginatedData,
              });
              setProgress(100);
              // Giữ loading ít nhất 500ms
              timeout = setTimeout(() => {
                setLoading(false); // Kết thúc trạng thái loading
              }, 300);
              return;
            } else {
              const fields: string[] = Array.from(
                new Set(
                  res.result.data?.flatMap(
                    (item: any) =>
                      item.contact_extend?.map(
                        (extend: any) => extend.label as string
                      ) || []
                  ) || []
                )
              );
              setCustomFields?.(fields);
              setPageData({
                total: res.result.total,
                data: res.result.data,
              });
            }
            setProgress(100);
            // Giữ loading ít nhất 500ms
            timeout = setTimeout(() => {
              setLoading(false); // Kết thúc trạng thái loading
            }, 500);
            const resExport = await pageApi(obj, true);
            if (resExport && resExport.status) {
              setDataExport({
                total: resExport.result.total,
                data: resExport.result.data,
              });
            }
          }
        }
      } catch (error) {
        // setLoading(false);
        console.error('Error fetching page data:', error);
      }
    },
    [
      pageApi,
      searchParams,
      sortField,
      sortOrder,
      initialSearchField,
      pageData.pageNumber,
      pageData.pageSize,
    ]
  );
  const getPageDataDebounced = useCallback(
    debounce(async (pageParams: Record<string, any> = {}) => {
      await getPageData(pageParams);
    }, 300),
    [getPageData]
  );
  const onSort = (field: string, order: string) => {
    setSortField(field);
    setSortOrder(order);
    getPageData({ sortFields: field, sortOrder: order });
  };
  const getPageDataClient = useCallback(
    async (pageParams: Record<string, any> = {}, allPageData) => {
      try {
        let timeout: NodeJS.Timeout;
        setLoading(true);
        // Kiểm tra nếu là phân trang client
        if (isPaginationClient) {
          const { pageNumber, pageSize } = pageParams;
          const startIndex = (pageNumber - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          // Lấy dữ liệu theo phân trang từ pageData
          const paginatedData = allPageData.slice(startIndex, endIndex);
          setPageData({ pageNumber: pageNumber, data: paginatedData });
          timeout = setTimeout(() => {
            setLoading(false); // Kết thúc trạng thái loading
          }, 200);
          return;
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching page data:', error);
      }
    },
    [
      pageApi,
      initialSearchField,
      isPaginationClient, // Thêm isPaginationClient vào dependencies
    ]
  );
  const onPageChange = (pageNumber: number, pageSize?: number) => {
    if (!isPaginationClient) {
      // Nếu không phải phân trang client, gọi getPageData
      setPageData({ pageNumber });
      if (pageSize) {
        setPageData({ pageSize });
      }
      // Truyền các điều kiện filter, sort hiện có vào getPageData
      getPageData({
        pageNumber,
        pageSize: pageSize || pageData.pageSize,
        searchFields: searchParams, // Điều kiện filter
        sortFields: sortField,
        sortOrder: sortOrder,
      });
    } else {
      setPageData({ pageNumber, pageSize });
      getPageDataClient({ pageNumber, pageSize }, initialPageData);
    }
  };

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      setPageData({ data: dataSource });
    }
  }, [dataSource]);

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: any
  ) => {
    setSelectedRowData && setSelectedRowData(selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleRefresh = () => {
    getPageData();
  };
  const onClearFilter = useCallback(() => {
    setClearFilter(!clearFilter);
    onClearSearch && onClearSearch();
    handleQuickSearchReset();
    // getPageData();
  }, [clearFilter, propClearSearchCustom]);
  useEffect(() => {
    setSelectedRowKeys([]);
    getPageDataDebounced();
  }, [forceUpdate]);

  const dataExportWithKeys = dataExport?.data.map(
    (item: any, index: number) => ({
      ...item,
      id: item.id,
    })
  );

  const dataWithKeys = pageData?.data.map((item: any, index: number) => ({
    ...item,
    id: item.id,
  }));
  const handleSearch = (values: any) => {
    const formattedBody: API.searchObj[] = Object.entries(values).map(
      ([key, value]) => {
        let formattedValue: string | number | string[] | null; // Định nghĩa kiểu cho formattedValue
        if (key === 'phone') {
          formattedValue = String(value); // Nếu key là "phone", chuyển value thành chuỗi
        } else if (Array.isArray(value) && value.length === 0) {
          formattedValue = ''; // Nếu value là mảng rỗng, đặt giá trị là null
        } else if (Array.isArray(value)) {
          formattedValue = value.join(','); // Nếu value là mảng, nối các phần tử bằng dấu phẩy
        } else if (value === '') {
          formattedValue = '';
        } else if (typeof value === 'string') {
          formattedValue = value;
        } else if (typeof value === 'number') {
          formattedValue = Number(value);
        } else {
          formattedValue = '';
        }
        return { key, value: formattedValue }; // Trả về đối tượng với key và value
      }
    );

    setSearchParams(formattedBody);
    getPageData({ searchFields: formattedBody });
    onSearch && onSearch();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let startTime = Date.now(); // Ghi lại thời gian bắt đầu
      interval = setInterval(() => {
        let elapsed = (Date.now() - startTime) / 1000; // Tính thời gian đã trôi qua
        setProgress(oldProgress => {
          if (elapsed < 5 && oldProgress < 80) {
            return oldProgress + 3;
          } else if (elapsed >= 5 && oldProgress < 95) {
            return oldProgress + 1; // Tăng chậm dần sau 5 giây
          }
          return oldProgress;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [loading]);
  const loadingContainerClass = loading
    ? 'shared-loading-overlay visible'
    : 'shared-loading-overlay';
  const isNotFound = pageData.data.length === 0 && !loading;
  const { quickSearchFields, initialValueQuickSearch } = quickSearchOptions;
  const [quickSearchForm] = Form.useForm();

  const [internaladvanceSearchForm] = Form.useForm();
  const advanceSearchForm =
    externalAdvanceSearchForm || internaladvanceSearchForm;

  const [quickSearchTopForm] = Form.useForm();
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [showGoTop, setShowGoTop] = useState(false);
  // Mở drawer
  const openDrawer = () => setDrawerVisible(true);
  const handleQuickSearchReset = () => {
    quickSearchTopForm.resetFields();
  };

  useEffect(() => {
    if (resetQuickSearch && resetQuickSearch.reset) {
      quickSearchForm.setFieldsValue(resetQuickSearch);
    }
  }, [resetQuickSearch]);

  // Hàm xử lý sự kiện khi bấm Enter trong form
  const handleKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Ngăn form submit mặc định
      onAdvanceSearch(); // Gọi tìm kiếm
    }
  };

  const onAdvanceSearch = async () => {
    let quickSearchValues;
    if (quickSearchForm.getFieldValue('keyword')) {
      quickSearchForm.setFieldValue(
        'keyword',
        quickSearchForm.getFieldValue('keyword').trim()
      );
    }
    if (isQuickSearchTop) {
      quickSearchValues = await quickSearchTopForm.getFieldsValue();
    } else {
      quickSearchValues = await quickSearchForm.getFieldsValue();
    }

    const advanceSearchValues = advanceSearchForm.getFieldsValue();
    const searchFieldsArray = { ...quickSearchValues, ...advanceSearchValues };
    setSearchParams && setSearchParams(searchFieldsArray);
    handleSearch && handleSearch(searchFieldsArray);
  };
  const initialValueAdvanceSearch = advanceSearchForm.getFieldsValue();
  const calculateActiveFilters = () => {
    const activeAdvanceSearchCount =
      initialValueAdvanceSearch &&
      Object.values(initialValueAdvanceSearch).filter(
        value =>
          Boolean(value) &&
          (!Array.isArray(value) || value.some(item => item !== ''))
      ).length;
    setActiveFiltersCount(activeAdvanceSearchCount ?? 0);
  };

  useEffect(() => {
    calculateActiveFilters();
  }, [searchParams]);

  useEffect(() => {
    calculateActiveFilters();
  }, []);

  const filteredColumns = columns.filter(
    (column: any) => !excludeColumns?.includes(column.dataIndex)
  );

  return (
    <div className="shared-layout-container">
      {isQuickSearchTop && (
        <div className="content">
          <div className="content-filter">
            {quickSearchFields && (
              <Form
                form={quickSearchTopForm}
                initialValues={initialValueQuickSearch}
                onKeyDown={handleKeyPress}
                layout="vertical"
              >
                {quickSearchFields}
              </Form>
            )}
            <div className="filter-action">
              <Button
                type="link"
                onClick={handleQuickSearchReset}
                style={{ marginRight: 8 }}
                icon={<ReloadOutlined />}
              >
                Set To Default
              </Button>
              <div className="h-center">
                {typeof advanceSearchOptions !== 'undefined' && (
                  <MyButton
                    buttonType="outline"
                    style={{ height: '36px', width: '36px' }}
                    icon={
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 0.666667C0 0.298477 0.298477 0 0.666667 0H11.3333C11.7015 0 12 0.298477 12 0.666667V2.11467C11.9999 2.64502 11.7891 3.15376 11.4141 3.52874C11.414 3.52876 11.4141 3.52871 11.4141 3.52874L8.66667 6.27614V8C8.66667 8.36819 8.36819 8.66667 8 8.66667C7.63181 8.66667 7.33333 8.36819 7.33333 8V6C7.33333 5.82319 7.40357 5.65362 7.52859 5.5286L10.4713 2.58593C10.5963 2.46097 10.6666 2.29141 10.6667 2.11467C10.6667 2.11462 10.6667 2.11471 10.6667 2.11467V1.33333H1.33333V2.15126C1.33333 2.15124 1.33333 2.15129 1.33333 2.15126C1.33337 2.31702 1.39515 2.47688 1.50663 2.59955C1.50661 2.59954 1.50664 2.59957 1.50663 2.59955L4.49329 5.88488C4.60485 6.0076 4.66667 6.16749 4.66667 6.33333V11.075L5.78918 10.7009C6.13848 10.5844 6.51602 10.7732 6.63246 11.1225C6.74889 11.4718 6.56011 11.8494 6.21082 11.9658L4.21082 12.6325C4.00752 12.7002 3.78404 12.6661 3.61019 12.5408C3.43635 12.4155 3.33333 12.2143 3.33333 12V6.59107L0.52004 3.49645C0.185487 3.12837 5.31673e-05 2.6488 0 2.1514V0.666667ZM10.6667 8C11.0349 8 11.3333 8.29848 11.3333 8.66667V10H12.6667C13.0349 10 13.3333 10.2985 13.3333 10.6667C13.3333 11.0349 13.0349 11.3333 12.6667 11.3333H11.3333V12.6667C11.3333 13.0349 11.0349 13.3333 10.6667 13.3333C10.2985 13.3333 10 13.0349 10 12.6667V11.3333H8.66667C8.29848 11.3333 8 11.0349 8 10.6667C8 10.2985 8.29848 10 8.66667 10H10V8.66667C10 8.29848 10.2985 8 10.6667 8Z"
                          fill="#292524"
                        />
                      </svg>
                    }
                    onClick={openDrawer}
                    className="filter"
                  >
                    {activeFiltersCount > 0 && (
                      <div className="filter-count">
                        <span>{activeFiltersCount}</span>
                      </div>
                    )}
                  </MyButton>
                )}
                <MyButton onClick={() => onAdvanceSearch()}>Search</MyButton>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="content">
        <div className={loadingContainerClass}>
          <SharedTableLoading progress={progress} />
        </div>
        {loading && <div style={{ height: 200 }}></div>}

        <SharedLayoutHeader
          propClearSearchCustom={propClearSearchCustom}
          handleRefresh={handleRefresh}
          quickSearchOptions={quickSearchOptions}
          advanceSearchOptions={advanceSearchOptions}
          onSearch={handleSearch}
          setSearchParams={setSearchParams}
          searchParams={searchParams}
          columns={columns}
          dataSource={dataExportWithKeys}
          customBtns={customBtns}
          fileName={fileName}
          formatDataBeforeExport={formatDataBeforeExport}
          clearFilter={clearFilter}
          isQuickSearchTop={isQuickSearchTop}
          customButtons={customButtons}
          drawerVisible={drawerVisible}
          setDrawerVisible={setDrawerVisible}
          onAdvanceSearch={onAdvanceSearch}
          advanceSearchForm={advanceSearchForm}
          quickSearchForm={quickSearchForm}
          isShowExport={isShowExport}
          messageExportSuccess={messageExportSuccess}
          additionalInfo={additionalInfo}
        />
        <div className={`shared-layout-content ${loading ? 'loading' : ''}`}>
          <div className={`content-table ${isNotFound ? 'is-not-found' : ''}`}>
            <SharedLayoutTable
              dataSource={dataWithKeys}
              tableScrollY={tableScrollY}
              // loading={loading}
              rowKey="id"
              columns={filteredColumns}
              rowSelection={multipleSelection ? rowSelection : undefined}
              clearFilter={onClearFilter}
              onSort={onSort}
            />
            <SharedLayoutFooter
              isRoomAvaibility={isRoomAvaibility}
              onPageChange={onPageChange}
              total={pageData?.total}
              current={pageData.pageNumber}
              pageSize={pageData.pageSize}
              isShowNote={isShowNote}
            />
          </div>
          <div
            className={`shared-not-found-content ${
              isNotFound ? 'visible' : ''
            } ${loading ? 'loading' : ''}`}
          >
            <SharedTableNotFoundData onClearFilter={onClearFilter} />
          </div>
        </div>
      </div>
      {/* {showGoTop && (
        <Button
          type="primary"
          shape="circle"
          className="go-top-button"
          icon={<UpOutlined />}
          size="large"
          onClick={scrollToTop}
        />
      )} */}
    </div>
  );
};

export default SharedLayout;
