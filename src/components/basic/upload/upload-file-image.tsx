import React, { useEffect, useState, useRef } from 'react';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, Button, message, Image, Skeleton } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { RequestOptions } from '@/utils/request';
import { uploadImage, uploadUpload } from '@/api/features/toolsUpload';
import { css } from '@emotion/react';
import { MyFormItem } from '../form-item';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

interface IProps {
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  name?: string;
  onChange?: (file: string) => void;
  value?: string;
  isDisable?: boolean;
  uploadApi?: (
    body: any,
    file?: File,
    options?: RequestOptions
  ) => Promise<string>;
  icon?: React.ReactNode;
  onUpload?: (value: string) => void;
}

const MyFileUploadImage: React.FC<IProps> = ({
  onChange,
  uploadApi = uploadImage,
  disabled = false,
  label = 'Upload',
  value,
  icon = <PlusOutlined />,
  placeholder = '',
  onUpload,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    if (value) {
      onChange?.(value);
      const isCrsBooking = value.includes('/crs/crsbooking/');
      setFileList([
        {
          uid: `vc-upload-${Date.now()}-1`,
          name: `vc-upload-${Date.now()}-1`,
          status: 'done',
          thumbUrl: isCrsBooking
            ? `${import.meta.env.VITE_BASE_IMG_URL}${value}`
            : `${import.meta.env.VITE_BASE_URL}/api/cms/assets/${value}`,
        },
      ]);
    }
  }, [value]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    const displayUrl = file.url ? `${file.url}` : (file.preview as string);
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

  const uploadImage = async (
    file: RcFile,
    onError: () => void,
    onSuccess: (url: string) => void
  ) => {
    try {
      if (!uploadApi) return;
      const res = (await uploadApi(file)) as any;
      if (res.data && res.data.id) {
        onChange?.(res.data.id);
        onUpload?.(res.data.id);
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
    await uploadImage(
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
        console.log('updatedFileList', updatedFileList);
        setFileList(updatedFileList);
      }
    );
  };

  const IconUpload = () => {
    return React.cloneElement(icon as React.ReactElement, {
      onClick: () => !disabled && uploadRef.current?.click(),
      style: {
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: '32px',
        height: '32px',
        marginRight: '8px',
        opacity: disabled ? 0.5 : 1,
      },
      disabled: disabled,
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
          aspectRatio: '1',
        }}
      >
        <img
          src={file.thumbUrl || file.url}
          alt={file.name}
          onLoad={handleImageLoad}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '4px',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
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
            onClick={() => handleRemove(file)}
            disabled={disabled}
          />
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
        itemRender={(_, file, fileList, actions) =>
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
        disabled={disabled}
      >
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
              }}
            >
              {placeholder}
            </span>
          </div>
        ) : (
          <div ref={uploadRef}></div>
        )}
      </Upload>
    </div>
  );
};

export default MyFileUploadImage;
