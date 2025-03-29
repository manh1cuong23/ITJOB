import { MyFormItem } from '@/components/basic/form-item';
import MyFileUploadImage from '@/components/basic/upload/upload-file-image';
import React from 'react';
import { ReactComponent as Upload } from '@/assets/icons/ic_upload.svg';
import { UploadFile } from 'antd';
interface IProps {
  name: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  onChange?: (file: string) => void;
  onUpload?: (value: string) => void;
}
const UploadBasic = (props: IProps) => {
  const {
    name = 'imgFront',
    disabled,
    label = 'Upload Front Side',
    placeholder = 'SVG, PNG, JPG, file max 5MB',
    onChange,
    onUpload,
  } = props;
  return (
    <MyFormItem name={name} isShowLabel={false} disabled={disabled}>
      <MyFileUploadImage
        isDisable={disabled}
        label={label}
        placeholder={placeholder}
        icon={<Upload width={24} height={24} />}
        disabled={disabled}
        onChange={onChange}
        onUpload={onUpload}
      />
    </MyFormItem>
  );
};

export default UploadBasic;
