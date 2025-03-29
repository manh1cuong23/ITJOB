import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, message } from 'antd';
import { MyModal } from '@/components/basic/modal';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as ExportSvg } from '@/assets/icons/ic_export.svg';
import { MySearchInput } from '@/components/basic/input';
import { TableBasic } from '@/components/basic/table';
import { exportListToExcel } from '@/utils/exportExcel';
import { formatDateTable } from '@/utils/formatDate';
import dayjs from 'dayjs';

interface RateActivityLogProps {
  open: boolean;
  onClose: () => void;
  dataRateActLog: any[];
}

const RateActivityLog: React.FC<RateActivityLogProps> = ({ open, onClose, dataRateActLog }) => {
  const [form] = Form.useForm();
  const [dataTable, setDataTable] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any>([]);

  useEffect(() => {
    if (open) {
      if (dataRateActLog && dataRateActLog.length > 0) {
        const dataTableRateActLog = dataRateActLog.map(
          (item: any) => ({
            action: item?.action,
            log: item?.log,
            executeTime: dayjs(item?.execute_time).format('DD/MM/YYYY HH:mm'),
            executeBy: item?.user_execute,
          })
        );
        setDataTable(dataTableRateActLog);
        setFilteredData(dataTableRateActLog);
      } else {
        setDataTable([]);
        setFilteredData([]);
      }
    }
  }, [open]);

  const handleOk = async (force: boolean = false) => {
    const dataForm = await form.validateFields();
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleSearch = (searchText: string) => {
    console.log(searchText)
    if (!searchText.trim()) {
      setFilteredData(dataTable);
      return;
    }

    setTimeout(() => {
      const searchLower = searchText.toLowerCase();
      const filtered = dataTable.filter((item: any) => 
        item.action?.toLowerCase().includes(searchLower) ||
        item.log?.toLowerCase().includes(searchLower) ||
        item.executeBy?.toLowerCase().includes(searchLower)
      );
      setFilteredData(filtered);
    }, 500);
  };

  const columns: any = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      render: (value: string, record: any, index: number) => index + 1, 
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 100,
    },
    {
      title: 'Log',
      dataIndex: 'log',
      key: 'log',
      width: 250,
    },
    {
      title: 'Execute Time',
      dataIndex: 'executeTime',
      key: 'executeTime',
      width: 140,
    },
    {
      title: 'Execute By',
      dataIndex: 'executeBy',
      key: 'executeBy',
      width: 140,
    },
  ];

  const formatDataBeforeExport = (data: any[]) => {
    return data.map((row, index)=> {
      const formattedRow: Record<string, any> = {};
      columns.forEach((col: any) => {
        if (col.dataIndex) {
          let value;
          if (col.dataIndex === 'hotelId') {
            value = row['hotel'].fullName;
          } else if (col.dataIndex === 'guestName') {
            value = row['bookingGuestInfos']?.[0]?.guest?.fullName ?? '';
          } else if (col.dataIndex === 'no') {
            value = index + 1;
          } else {
            value = row[col.dataIndex] ?? '';
          }
          formattedRow[col.dataIndex] = value;
        }
      });
      return formattedRow;
    });
  };

  const handleExport = async () => {
    const dataExcel = filteredData;
    const header =
      columns &&
      columns.map((col: any) => ({
        title: col.textForExport || col.title,
        key: col.dataIndex,
        columnExport: col.exportValue || ((_record: any) => ''),
      }));
    if (!header) return;

    if (!dataExcel || dataExcel.length === 0) {
      message.error('Data is empty, unable to export.');
      return;
    }

    const estimatedSize = JSON.stringify(dataExcel).length / 1024 / 1024;
    const maxFileSize = 5;

    if (estimatedSize > maxFileSize) {
      message.error('Error: Export failed. File size exceeds 5MB.');
      return;
    }

    try {
      const formattedData = formatDataBeforeExport
        ? formatDataBeforeExport(dataExcel)
        : dataExcel;
      if (!formattedData)
        throw new Error('Formatted data is undefined or null.');
      await exportListToExcel(
        formattedData,
        header.filter((column: any) => column.key !== undefined),
        'Rate_Activity_Log'
      );
      message.success('Export succesfully');
    } catch (error) {
      message.error('Error occurred during file export.' + error);
    }
  };

  return (
    <MyModal
      width={880}
      title="Rate Activity Log"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <>
          <MyButton onClick={handleCancel} buttonType="outline">
            Close
          </MyButton>
        </>
      }>
      <Form form={form} layout="vertical" className="rate-activity-log">
        <Row gutter={16} className="rate-act-search">
          <MySearchInput
            className="search-input"
            placeholder="Search by Action, Log, Execute By"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <MyButton
            buttonType="outline"
            className="icon-button-export"
            icon={<ExportSvg height={16} width={16} />}
            onClick={handleExport}
          >
            Export
          </MyButton>
        </Row>
        <Row gutter={16}>
          <TableBasic dataSource={filteredData} columns={columns} />
        </Row>
      </Form>
    </MyModal>
  );
};

export default RateActivityLog;