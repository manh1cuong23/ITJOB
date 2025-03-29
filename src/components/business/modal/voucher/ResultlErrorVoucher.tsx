import React from 'react';
import { MyButton } from '@/components/basic/button';
import { message } from 'antd';
import { ReactComponent as DeleteSvg } from '@/assets/icons/ic_export.svg';
import { MyModal } from '@/components/basic/modal';
import { TableBasic } from '@/components/basic/table';
import { MyCardContent } from '@/components/basic/card-content';
import dayjs from 'dayjs';
import { exportListToExcel } from '@/utils/exportExcel';

const ResultErrorVoucher: React.FC<{
  visible: boolean;
  onCancel: () => void;
  data: any;
}> = ({ visible, onCancel, data }) => {
  const handleCancel = () => {
    onCancel();
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'No',
      width: 50,
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: 'Voucher Code',
      dataIndex: 'code',
      width: 200,
    },
    {
      title: 'Message',
      dataIndex: 'message',
    },
  ];

  const handleExport = async () => {
    const fileName = `Failed_Voucher`;
    const header =
      columns &&
      columns.map((col: any) => ({
        title: col.textForExport || col.title,
        key: col.dataIndex,
        columnExport: col.exportValue || ((_record: any) => ''),
      }));
    if (!header) return;

    const sheetData = data.map((item: any, index: number) => ({
      No: index + 1,
      code: item.code || '',
      message: item.message || '',
    }));

    try {
      if (!sheetData) throw new Error('Formatted data is undefined or null.');
      await exportListToExcel(
        sheetData,
        header.filter(column => column.key !== undefined),
        fileName ?? 'Report'
      );
      message.success('Export successfully');
    } catch (error) {
      message.error('Error occurred during file export.' + error);
    }
  };

  return (
    <>
      <MyModal
        title="Failed Voucher"
        width={600}
        open={visible}
        onCancel={handleCancel}
        footer={
          <MyButton onClick={handleCancel} buttonType="outline">
            Close
          </MyButton>
        }>
        <MyCardContent>
          <div className="action">
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={event => {
                event.stopPropagation();
                handleExport();
                // showDelete();
              }}>
              <DeleteSvg />
              <span style={{ marginLeft: '5px' }}>Export</span>
            </div>
          </div>
          <TableBasic dataSource={data} columns={columns} />
        </MyCardContent>
      </MyModal>
    </>
  );
};

export default ResultErrorVoucher;
