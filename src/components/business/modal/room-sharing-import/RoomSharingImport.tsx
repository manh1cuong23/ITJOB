import React, { useState, useEffect } from 'react';
import { MyModal } from '@/components/basic/modal';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as Upload } from '@/assets/icons/ic_upload.svg';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { ReactComponent as File } from '@/assets/icons/ic_file.svg';
import { ReactComponent as Bell } from '@/assets/icons/ic_bell.svg';
import { ReactComponent as Delete } from '@/assets/icons/ic-delete.svg';
import { Col, Flex, Row, Progress, UploadFile, message } from 'antd';
import './RoomSharingImport.less';
import UploadFileExcel from '@/components/basic/upload/upload-file-excel';
import * as XLSX from 'xlsx';
import { formatMoney } from '@/utils/formatCurrentcy';

const RoomSharingImport: React.FC<{
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  onBack?: () => void;
  apiImport?: any;
  onDownloadTemplate?: () => void;
  expectedHeaders?: any[];
  title?: string;
  hotelId?: any;
  setData?: any;
  isRoomConfig?: boolean;
}> = ({
  visible,
  onOk,
  onCancel,
  onBack,
  apiImport,
  onDownloadTemplate,
  expectedHeaders,
  title,
  hotelId,
  setData,
  isRoomConfig = false,
}) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [messageError, setMessageError] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [validData, setValidData] = useState<any>([]);
  const [invalidData, setInvalidData] = useState<any>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
  const [disabledDown, setDisabledDown] = useState<boolean>(false);
  const [loadingDown, setLoadingDown] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalError, setTotalError] = useState<number>(0);

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    const kb = size / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const handleFileUpload = async (file: File) => {
    setMessageError('');
    setFileSize(formatFileSize(file.size));
    setFileName(file.name);
    setUploadedFile(file);
    setDisabledBtn(false);

    const validFormats = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (
      !validFormats.includes(file.type) ||
      !file.name.match(/\.(xls|xlsx)$/i)
    ) {
      setMessageError('File is invalid format');
      setIsUploading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessageError('File is too large (> 5MB)');
      setIsUploading(false);
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = e => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Lấy sheet đầu tiên
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Chuyển sheet thành JSON
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setTotalRows(jsonData.length);

        if (jsonData.length === 0) {
          setMessageError('The file is empty');

          setDisabledBtn(true);
          setIsUploading(false);
          return;
        }

        const firstRow = sheetData[0] || [];

        // Lấy hàng đầu tiên
        const actualHeaders = Array.isArray(firstRow)
          ? firstRow.map(header =>
              typeof header === 'string'
                ? header.replace(/\r\n/g, ' ').replace(/\s+/g, ' ').trim()
                : ''
            )
          : Object.keys(firstRow).map(header =>
              header.replace(/\r\n/g, ' ').replace(/\s+/g, ' ').trim()
            );

        console.log('Actual Headers:', actualHeaders);
        console.log(expectedHeaders);

        const isValidTemplate =
          expectedHeaders &&
          expectedHeaders.every(header =>
            actualHeaders.some(actualHeader => actualHeader.includes(header))
          );

        if (!isValidTemplate) {
          setMessageError('File does not match the import template');

          setDisabledBtn(true);
          setIsUploading(false);
          return;
        }

        setDisabledDown(true);
        message.success('File uploading successfully!');
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {}
  };

  const reset = () => {
    setMessageError('');
    setValidData([]);
    setInvalidData([]);
    setFileList([]);
    setUploadedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setFileName('');
    setFileSize('');
    setDisabledBtn(false);
    setDisabledDown(false);
    setLoadingDown(false);
    setTotalError(0);
    setTotalRows(0);
  };

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible]);

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setFileName('');
    setMessageError('');
  };

  const exportFileError = async (response: any) => {
    if (!uploadedFile) {
      setMessageError('Please select a file to import.');
      return;
    }
    const text = await response.text();
    if (text.includes('"status":"success","message":"success"')) {
      const jsonResponse = JSON.parse(text);
      if (jsonResponse.data.length > 0) {
        handleSetData(jsonResponse.data);
      }
      message.success('Import data successfully!');
      onOk();
    } else if (!text.includes('"status":"error"')) {
      const fileError = new Blob([response], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const reader = new FileReader();
      reader.onload = e => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setTotalError(jsonData.length);
      };
      reader.readAsArrayBuffer(fileError);

      const fileUrl = window.URL.createObjectURL(fileError);
      const link = document.createElement('a');
      link.href = fileUrl;
      const fileNameWithoutExtension = uploadedFile.name
        .split('.')
        .slice(0, -1)
        .join('.');
      link.setAttribute('download', `${fileNameWithoutExtension}_error.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(fileUrl);
      setTimeout(() => {
        onOk();
      }, 1000);
    } else {
      const jsonResponse = JSON.parse(text);
      if (jsonResponse.status === 'error') {
        message.error(jsonResponse.message);
      }
    }
  };

  const handleSetData = (data: any) => {
    if (isRoomConfig) {
      setData?.((pre: any) =>
        pre.map((item: any) => {
          const updatedItem = data.find(
            (dataItem: any) =>
              dataItem.MarketSegmentId === item?.market_segment_id &&
              dataItem.RoomTypeId === item?.room_type_id
          );

          return updatedItem
            ? {
                ...item,
                is_percent: updatedItem.IsPercent,
                distribution_room: formatMoney(updatedItem.Value),
              }
            : item;
        })
      );
    } else {
      setData?.((pre: any) =>
        pre.map((item: any) => {
          const updatedItem = data.find(
            (dataItem: any) =>
              dataItem.package_plan_code_id === item?.package_plan?.id &&
              dataItem.rate_code_id === item?.rate_code?.id &&
              dataItem.room_type_code_id === item?.room_type?.id
          );

          return updatedItem
            ? {
                ...item,
                rack_rate: String(formatMoney(updatedItem.rack_rate)),
                distribution_rate: String(
                  formatMoney(updatedItem.distribution_rate)
                ),
                cost_rate: String(formatMoney(updatedItem.cost_rate)),
              }
            : item;
        })
      );
    }
  };

  const handleImport = async () => {
    setMessageError('');
    setIsUploading(true);
    setUploadProgress(0);

    const uploadProgressPromise = new Promise<void>(resolve => {
      const uploadInterval = setInterval(() => {
        setUploadProgress(prevProgress => {
          const newProgress = prevProgress + 20;
          if (newProgress >= 100) {
            clearInterval(uploadInterval);
            setUploadProgress(100);
            resolve();
          }
          return newProgress;
        });
      }, 500);
    });

    try {
      await uploadProgressPromise;
      if (hotelId) {
        const response = await apiImport(hotelId, uploadedFile);
        if (response.data && response.data.length > 0) {
          handleSetData(response.data);
        }
        exportFileError(response.file);
      } else {
        const response = await apiImport(uploadedFile);
        exportFileError(response);
      }
    } catch (error) {
      console.error('Error importing file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getTitle = (title: string) => {
    return (
      <>
        <MyButton
          buttonType="outline"
          onClick={onBack}
          icon={<BackSvg width={16} height={16} />}
          style={{
            padding: '4px',
            boxShadow: 'none',
            marginRight: '10px',
            height: ' 24px',
            width: ' 24px',
            borderRadius: '4px',
          }}
        />
        {title}
      </>
    );
  };

  const handleDeleteFile = () => {
    reset();
  };

  const handleDownloadTemplate = async () => {
    setLoadingDown(true);
    const res = await onDownloadTemplate?.();
    if (res) {
      setLoadingDown(false);
    } else {
      setLoadingDown(true);
    }
  };

  return (
    <MyModal
      width={480}
      title={getTitle(title || 'Import File')}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={
        <Flex justify="space-between">
          <MyButton
            className="btn-down"
            icon={<File />}
            buttonType="outline"
            loading={loadingDown}
            disabled={disabledDown}
            onClick={handleDownloadTemplate}
          >
            Download template
          </MyButton>
          <div>
            <MyButton onClick={onCancel} buttonType="outline">
              Close
            </MyButton>
            <MyButton
              disabled={disabledBtn}
              onClick={handleImport}
              loading={isUploading}
              style={{ marginRight: '0px' }}
            >
              Import
            </MyButton>
          </div>
        </Flex>
      }
    >
      <Row gutter={24} className="room-sharig-import-wrapper">
        <Col span={24}>
          {/* <MyFileUpload
            label="Select a file"
            placeholder="Supported formats: XLS, XLSX. Maximum size: 5MB"
            icon={<Upload width={32} height={32} />}
          /> */}
          <UploadFileExcel
            fileList={fileList}
            setFileList={setFileList}
            label="Select A File"
            placeholder="xls, xlsx, file max: 5MB, 1000 rows"
            icon={<Upload width={32} height={32} />}
            onFileChange={handleFileUpload}
            disabled={isUploading}
          />
          {messageError && <span style={{ color: 'red' }}>{messageError}</span>}
        </Col>
      </Row>
      {fileList.length > 0 &&
        !isUploading &&
        (invalidData.length === 0 || validData.length === 0) && (
          <div
            style={{
              marginTop: '30px',
              border: '1px solid #D6D3D1',
              padding: '0 10px',
              borderRadius: '8px',
            }}
          >
            <Row gutter={[16, 16]} className="upload-details">
              <Col span={2}>
                <File width={16} height={16} className="file-icon" />
              </Col>
              <Col span={22} style={{ paddingLeft: 0 }}>
                <Row gutter={12} className="upload-details">
                  <Col span={20}>
                    <Row gutter={12} className="upload-details">
                      <Col span={24}>
                        <span>{fileName}</span>
                      </Col>
                    </Row>
                    <Row gutter={12} className="upload-details">
                      <Col span={24}>
                        <p className="file-size">{fileSize}</p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={4} style={{ textAlign: 'right' }}>
                    {/* Cancel icon */}
                    <Delete
                      onClick={handleDeleteFile}
                      style={{ cursor: 'pointer' }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )}
      {totalError > 0 && !isUploading && (
        <>
          <span>Import Result</span>
          <div
            style={{
              marginTop: '10px',
              border: '1px solid #D6D3D1',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#f5f5f4',
            }}
          >
            <Row gutter={[16, 16]} className="upload-details">
              <Col span={3} style={{ margin: 'auto' }}>
                <Bell
                  width={16}
                  height={16}
                  style={{
                    borderRadius: 20,
                    backgroundColor: '#3b82f6',
                    padding: 9,
                  }}
                />
              </Col>
              <Col
                span={21}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <span style={{ fontWeight: 500, color: '#1C1917' }}>
                  Success: {totalRows > totalError ? totalRows - totalError : 0}
                  /{totalRows}, Error: {totalError}/{totalRows}
                </span>
                <span style={{ fontWeight: 400, color: '#57534e' }}>
                  The error file has been automatically downloaded
                </span>
              </Col>
            </Row>
          </div>
        </>
      )}
      {isUploading && (
        <div
          style={{
            marginTop: '30px',
            border: '1px solid #D6D3D1',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <Row gutter={[16, 16]} className="upload-details">
            <Col span={2}>
              <File width={16} height={16} className="file-icon" />
            </Col>
            <Col span={22} style={{ paddingLeft: 0 }}>
              <Row gutter={12} className="upload-details">
                <Col span={24}>
                  <span>{fileName}</span>
                </Col>
              </Row>
              <Row gutter={12} className="upload-details">
                <Col span={24}>
                  <p className="file-size">{fileSize}</p>
                </Col>
              </Row>
              <Row
                gutter={12}
                className="upload-progress"
                style={{ marginTop: '5px' }}
              >
                <Col span={24}>
                  <Progress
                    percent={uploadProgress}
                    status={uploadProgress < 100 ? 'active' : 'success'}
                    strokeColor={uploadProgress < 100 ? '#292524' : '#52c41a'}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      )}
    </MyModal>
  );
};

export default RoomSharingImport;
