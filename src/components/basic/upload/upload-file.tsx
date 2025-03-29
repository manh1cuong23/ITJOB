import React, { useEffect, useState, useRef } from 'react';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, Button, message } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { RequestOptions } from '@/utils/request';
import { uploadUpload } from '@/api/features/toolsUpload';
import { css } from '@emotion/react';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

interface UploadFileProps {
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  onChange?: (file: File | string) => void;
  uploadApi?: (
    body: any,
    file?: File,
    options?: RequestOptions
  ) => Promise<string>;
  icon?: React.ReactNode;
}

const MyFileUpload: React.FC<UploadFileProps> = ({
  value,
  onChange,
  uploadApi = uploadUpload,
  disabled,
  label = 'Upload',
  icon = <PlusOutlined />,
  placeholder = '',
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (value) {
      const displayUrl = value.startsWith('http')
        ? value
        : `${import.meta.env.VITE_BASE_URL}/${value}`;
      setFileList([
        {
          uid: `vc-upload-${Date.now()}-1`,
          name: value.split('/').pop() || '',
          status: 'done',
          url: displayUrl,
        },
      ]);
    }
  }, [value]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    const displayUrl = file.url ? `${file.url}` : (file.preview as string);
    setPreviewImage(displayUrl);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || displayUrl.substring(displayUrl.lastIndexOf('/') + 1)
    );
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const updatedFileList = newFileList.map(file => {
      const displayUrl = file.url
        ? `${import.meta.env.VITE_BASE_URL}/${file.url}`
        : undefined;
      return {
        ...file,
        url: displayUrl,
      };
    });
    setFileList(updatedFileList);
  };

  const handleRemove: UploadProps['onRemove'] = () => {
    setFileList([]);
    onChange?.('');
  };

  const handleCancel = () => setPreviewOpen(false);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadAvatar = async (
    file: RcFile,
    onError: () => void,
    onSuccess: (url: string) => void
  ) => {
    try {
      if (!uploadApi) return;
      const res = (await uploadApi({ file })) as any;
      if (res?.code === 200) {
        const { filename } = res.data;
        const fullUrl = `${import.meta.env.VITE_BASE_URL}/${filename}`;
        onChange?.(fullUrl);
        onSuccess(fullUrl);
      } else {
        message.error('Upload failed');
        onError();
      }
    } catch (error) {
      message.error('Upload failed');
      onError();
    }
  };

  const customRequest: UploadProps['customRequest'] = async ({
    file,
    onError,
    onSuccess,
  }) => {
    await uploadAvatar(
      file as RcFile,
      () => {
        // Set the status of the file to error on failure
        const updatedFileList: UploadFile<any>[] = fileList.map(item =>
          item.uid === (file as UploadFile).uid
            ? ({ ...item, status: 'error' } as UploadFile<any>)
            : item
        );
        setFileList(updatedFileList);
      },
      (url: string) => {
        // Set the status of the file to done on success
        const updatedFileList: UploadFile<any>[] = fileList.map(item =>
          item.uid === (file as UploadFile).uid
            ? ({ ...item, status: 'done', url } as UploadFile<any>)
            : item
        );
        setFileList(updatedFileList);
      }
    );
  };

  const IconUpload = () => {
    return React.cloneElement(icon as React.ReactElement, {
      onClick: () => uploadRef.current?.click(),
      style: {
        cursor: 'pointer',
        width: '32px',
        height: '32px',
        marginRight: '8px',
      },
    });
  };

  const customPreview = (file: UploadFile, actions: any) => {
    return (
      <div
        className="custom-preview"
        style={{
          width: '100%',
          position: 'relative',
          border: '1px dashed red',
          height: '100%',
          borderRadius: '6px',
          overflow: 'hidden',
        }}>
        <img
          src={file.thumbUrl || file.url}
          alt={file.name}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '4px',
            objectFit: 'none',
          }}
        />
        <div className="hover-actions">
          <IconUpload />

          <Button
            style={{
              borderRadius: '50%',
              border: 'none',
              width: '32px',
              height: '32px',
            }}
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleRemove(file)}></Button>
        </div>
      </div>
    );
  };
  const style = css`
    .ant-upload-list-item-container {
      width: 100% !important;
    }
    .hover-actions {
      opacity: 0;
      position: absolute;
      z-index: 100;

      display: flex;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      justify-content: center;
      align-items: center;
    }
    .custom-preview:hover .hover-actions {
      opacity: 1;
    }
    ${fileList.length !== 0 &&
    css`
      .ant-upload-select {
        display: none !important;
      }
    `}
  `;

  return (
    <div css={style}>
      <Upload
        itemRender={(originNode, file, fileList, actions) =>
          customPreview(file, actions)
        }
        customRequest={customRequest}
        className="custom-upload"
        listType="picture-card"
        maxCount={1}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        beforeUpload={beforeUpload}
        disabled={disabled}>
        {fileList.length === 0 ? (
          <div>
            {icon}
            <div style={{ marginTop: 8, color: '#ED4E6B', fontWeight: 500 }}>
              {label}
            </div>
            <span
              style={{
                color: '#A8A29E',
                fontSize: '11px',
                lineHeight: '14px',
              }}>
              {placeholder}
            </span>
          </div>
        ) : (
          <div ref={uploadRef}></div>
        )}
      </Upload>

      {/* <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="Preview" style={{ width: '100%', maxHeight: 500 }} src={previewImage} />
      </Modal> */}
    </div>
  );
};

export default MyFileUpload;
