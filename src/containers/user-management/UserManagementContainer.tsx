import { SharedLayout } from '@/components/business/layouts/shared-layout';
import { useCallback } from 'react';
import Columns from './Columns';
import { QuickSearchForm } from './QuickSearchForm';
import { apiUserSearch } from '@/api/features/user';

const UserManagementContainer = () => {
  const handleAdvanceSearch = useCallback(() => {
    // Xử lý logic tìm kiếm nâng cao tại đây
  }, []);

  const quickSearchOptions = {
    quickSearchFields: <QuickSearchForm />,
  };

  const fileName = `RoomType`;

  const formatDataBeforeExport = (data: any[]) => {
    return data.map(row => {
      const formattedRow: Record<string, any> = {};

      Columns.forEach((col: any) => {
        if (!col.dataIndex) return;

        formattedRow[col.dataIndex] = row[col.dataIndex];
      });

      return formattedRow;
    });
  };

  return (
    <>
      <SharedLayout
        columns={Columns}
        pageApi={apiUserSearch}
        quickSearchOptions={quickSearchOptions}
        onSearch={handleAdvanceSearch}
        fileName={fileName}
        isQuickSearchTop={true}
        multipleSelection={false}
        formatDataBeforeExport={formatDataBeforeExport}
        tableScrollY={`calc(100vh - ${60}px)`}
      />
    </>
  );
};

export default UserManagementContainer;
