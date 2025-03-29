import React from 'react';
import { ReactComponent as ExportSvg } from '@/assets/icons/ic_export.svg';
import { ReactComponent as ReloadSvg } from '@/assets/icons/ic_reload.svg';

import { MyButton } from '@/components/basic/button';
import './style.less';
import { SharedLayoutHeaderProps } from './type';
import AdvancedSearchDrawer from './AdvancedSearchDrawer';
import { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { exportListToExcel } from '@/utils/exportExcel';
import { debounce } from 'lodash';
import { is } from '@/utils/is';

export const SharedLayoutHeader = (props: SharedLayoutHeaderProps) => {
  const {
    handleRefresh,
    customButtons,
    customBtns,
    advanceSearchOptions,
    quickSearchOptions,
    columns,
    dataSource,
    fileName,
    formatDataBeforeExport,
    clearFilter,
    isQuickSearchTop = false,
    drawerVisible,
    setDrawerVisible,
    onAdvanceSearch,
    quickSearchForm,
    advanceSearchForm,
    isShowExport = true,
    messageExportSuccess = 'Export succesfully',
    additionalInfo,
  } = props;

  const { quickSearchFields, initialValueQuickSearch } = quickSearchOptions;
  const advanceSearchFields = advanceSearchOptions?.advanceSearchFields;
  const initialValueAdvanceSearch =
    advanceSearchOptions?.initialValueAdvanceSearch;
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  // const [quickSearchForm] = Form.useForm();
  // const [advanceSearchForm] = Form.useForm();
  // Đóng drawer
  const closeDrawer = () => setDrawerVisible(false);

  // Mở drawer
  const openDrawer = () => setDrawerVisible(true);

  const debouncedSearch = debounce(() => {
    onAdvanceSearch();
  }, 1000);

  useEffect(() => {
    quickSearchForm.resetFields();
    advanceSearchForm.resetFields();
    setActiveFiltersCount(0);
    onAdvanceSearch();
  }, [clearFilter]);
  // Hàm tính active filters count dựa trên giá trị form
  const calculateActiveFilters = () => {
    const activeAdvanceSearchCount =
      initialValueAdvanceSearch &&
      Object.values(initialValueAdvanceSearch).filter(Boolean).length;
    setActiveFiltersCount(activeAdvanceSearchCount ?? 0);
  };

  useEffect(() => {
    // Tính active filters count ngay khi component mount
    calculateActiveFilters();
  }, []);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Cleanup debounce on unmount
    };
  }, []);

  // Hàm xử lý khi có thay đổi trong quick search form
  const handleQuickSearchChange = () => {
    debouncedSearch();
  };

  // Hàm xử lý sự kiện khi bấm Enter trong form
  const handleKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Ngăn form submit mặc định
      handleQuickSearchChange(); // Gọi tìm kiếm
    }
  };
  const handleExport = async () => {
    const dataExcel = dataSource;
    const header =
      columns &&
      columns.map((col: any) => ({
        title: col.textForExport || col.title,
        key: col.dataIndex,
        columnExport: col.exportValue || ((_record: any) => ''),
      }));
    if (!header) return;
    // Nếu dữ liệu trống, hiển thị thông báo và dừng quá trình xuất file
    if (!dataExcel || dataExcel.length === 0) {
      message.error('No data to export');
      return;
    }

    // Kiểm tra kích thước file
    const estimatedSize = JSON.stringify(dataExcel).length / 1024 / 1024; // Tính kích thước ước tính của file (MB)
    const maxFileSize = 5; // Giới hạn kích thước file (MB)

    if (estimatedSize > maxFileSize) {
      message.error('Error: Export failed. File size exceeds 5MB.');
      return;
    }

    // Xuất file nếu dữ liệu hợp lệ và kích thước không quá lớn
    try {
      // Nếu có formatDataBeforeExport, sử dụng nó để format dữ liệu
      const formattedData = formatDataBeforeExport
        ? formatDataBeforeExport(dataExcel)
        : dataExcel;
      if (!formattedData)
        throw new Error('Formatted data is undefined or null.');
      await exportListToExcel(
        formattedData,
        header.filter(column => column.key !== undefined),
        fileName ?? 'Report',
        additionalInfo
      );
      message.success(messageExportSuccess);
    } catch (error) {
      message.error('Error occurred during file export.' + error);
    }
  };
  return (
    <>
      <div className="header">
        <div className="content-header">
          <div className="content-header-left">
            {isShowExport && (
              <MyButton
                buttonType="outline"
                className="icon-button-fill"
                icon={<ExportSvg width={16} height={16} />}
                onClick={() => handleExport()}
              >
                Export
              </MyButton>
            )}
            {/* {!isQuickSearchTop && ( */}
            <MyButton
              buttonType="outline"
              className="icon-button"
              icon={<ReloadSvg width={16} height={16} />}
              onClick={() => handleRefresh()}
            >
              Reload
            </MyButton>
            {/* )} */}
            {customButtons && customButtons}
          </div>
          {!isQuickSearchTop && (
            <div className="content-header-right">
              {quickSearchFields && (
                <Form
                  form={quickSearchForm}
                  onKeyDown={handleKeyPress}
                  onValuesChange={handleQuickSearchChange}
                  initialValues={initialValueQuickSearch}
                >
                  {quickSearchFields}
                </Form>
              )}
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
            </div>
          )}
        </div>

        {customBtns && <div className="content-header-btn">{customBtns}</div>}
      </div>
      {advanceSearchFields && (
        <AdvancedSearchDrawer
          visible={drawerVisible}
          onClose={closeDrawer}
          onSearch={onAdvanceSearch}
          form={advanceSearchForm}
          initialValues={initialValueAdvanceSearch}
          setActiveFiltersCount={setActiveFiltersCount}
        >
          {advanceSearchFields}
        </AdvancedSearchDrawer>
      )}
    </>
  );
};
