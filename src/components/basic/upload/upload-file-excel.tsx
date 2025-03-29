import { Upload, UploadFile } from 'antd';
import React from 'react';

interface UploadFileExcelProps {
  fileList: UploadFile[];
  setFileList: (fileList: UploadFile[]) => void;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  onFileChange?: (file: File) => void;
	disabled?: boolean;
}

const UploadFileExcel = ({
  fileList,
  setFileList,
  label,
  placeholder,
  icon,
  onFileChange,
	disabled = false,
}: UploadFileExcelProps) => {
  return (
    <Upload.Dragger
      showUploadList={false}
      accept=".xlsx, .xls"
      fileList={fileList}
      multiple={false}
      maxCount={1}
			disabled={disabled}
      onChange={info => {
        const newFileList = info.fileList as UploadFile[];
        setFileList(newFileList);
        if (newFileList.length > 0 && onFileChange) {
          onFileChange(newFileList[0].originFileObj as File);
        }
      }}
      beforeUpload={() => false}>
      <div style={{ padding: '20px 0px' }}>
        <div className="ant-upload-drag-icon">{icon}</div>
        <div
          className="ant-upload-text"
          style={{ marginTop: 8, color: '#ED4E6B', fontWeight: 500 }}>
          {label}
        </div>
        <div
          style={{
            color: '#A8A29E',
            fontSize: '11px',
            lineHeight: '14px',
          }}
          className="ant-upload-hint">
          {placeholder}
        </div>
      </div>
    </Upload.Dragger>
  );
};

export default UploadFileExcel;
