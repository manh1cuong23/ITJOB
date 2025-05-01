import React, { useCallback, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { Row, Col, Form, message, DatePicker } from 'antd';
import { MyModal } from '@/components/basic/modal';
import { MyFormItem } from '@/components/basic/form-item';
import { InputBasic } from '../../input';
import { MyTextArea } from '@/components/basic/input';
import { applyJob } from '@/api/features/job';
import { SingleSelectSearchCustom } from '@/components/basic/select';
import DatepickerBasic from '../../date-picker/DatepickerBasic';
import dayjs from 'dayjs';

const ConfirmModal: React.FC<{
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish?: () => void;
  onCancel?: () => void;
  title: string;
  children?: React.ReactNode;
  setPageData?: (data: any) => void;
  onBack?: () => void;
  isViewMode?: boolean;
}> = ({ open, onFinish, onCancel, title, children }) => {
  const handleOk = async (force: boolean = false) => {
    onFinish && onFinish();
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return (
    <>
      <MyModal
        width={880}
        title={title}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <>
            <MyButton onClick={handleCancel} buttonType="outline">
              Hủy bỏ
            </MyButton>
            <MyButton onClick={() => handleOk(false)}>Xác nhận</MyButton>
          </>
        }>
        {children}
      </MyModal>
    </>
  );
};

export default ConfirmModal;
