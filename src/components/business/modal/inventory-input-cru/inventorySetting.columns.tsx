import { TableProps, Tag } from 'antd';
import { DataType } from '@/components/business/layouts/shared-layout/type';
import { MyAllotment } from '@/containers/my-allotment/type';

// Hàm để tạo các cột theo khoảng thời gian
const generateRoomTypeColumns = (roomTypes: any[]) => {
  const columns: Array<{ 
    title: JSX.Element; 
    dataIndex: string | number;
    key: string | number; 
    align: 'center'; 
    width: number; 
    render: (value: any) => JSX.Element; 
  }> = [];

  roomTypes.forEach((roomType) => {
    const columnTitleHtml = (
      <>
        <span style={{ fontWeight: 600 }}>{roomType.name}</span>
      </>
    );

    columns.push({
      title: (
        <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
          {columnTitleHtml}
        </div>
      ),
      dataIndex: roomType.id,
      key: roomType.id,
      align: 'center',
      width: 120,
      render: (value: any) => {
        return <span>{value}</span>;
      },
    });
  });

  return columns;
};

const baseColumns: TableProps<DataType<MyAllotment>>['columns'] = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    width: 100,
  },
];

export const getColumns = (roomTypes: any[]) => {
  const roomTypeColumns = generateRoomTypeColumns(roomTypes);
  return [...baseColumns, ...roomTypeColumns];
};

export default baseColumns;
