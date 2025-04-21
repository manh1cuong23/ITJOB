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
import { acceptInterview, makeInterviewCV } from '@/api/features/recruite';
import {
  getDetailInterview,
  makeFailInterview,
  makePassInterview,
} from '@/api/features/apply';

const ResultInterview: React.FC<{
  id?: string;
  open: boolean;
  name?: any;
  onFinish?: (value: any) => void;
  onCancel?: () => void;
  title: string;
  setPageData?: (data: any) => void;
  onBack?: () => void;
  setForceUpdate: any;
  isViewMode?: boolean;
}> = ({
  id,
  open,
  onFinish,
  setForceUpdate,
  onCancel,
  title,
  name,
  setPageData,
  isViewMode = false,
  onBack,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState<any>();
  const [isView, setIsView] = useState<boolean>(true);
  const [selectedValue, setSelectedValue] = useState('');
  const [isNewInterView, setIsNewInterview] = useState<boolean>(false);

  const resetForm = () => {
    form.resetFields();
  };

  const handleFailCV = async () => {
    if (id) {
      const res = await makeFailInterview(id);
      if (res && res.message) {
        message.success('Kết quả phỏng vấn đã được cập nhật thành công.');
        onCancel && onCancel();
        setForceUpdate((a: number) => a + 1);
      }
    }
  };

  const handleOk = async (force: boolean = false) => {
    if (id) {
      const res = await makePassInterview(id);
      if (res && res.message) {
        message.success('Kết quả phỏng vấn đã được cập nhật thành công.');
        onCancel && onCancel();
        setForceUpdate((a: number) => a + 1);
      }
    }
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return (
    <>
      <MyModal
        width={880}
        title={'Đánh giá kết quả phỏng vấn'}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <>
            <MyButton onClick={handleCancel} buttonType="outline">
              Hủy bỏ
            </MyButton>
            <MyButton onClick={handleFailCV} buttonType="secondary">
              Từ chối ứng viên
            </MyButton>
            <MyButton onClick={() => handleOk(false)}>Đạt yêu cầu</MyButton>
          </>
        }>
        <div>
          Vui lòng chọn kết quả phỏng vấn cho ứng viên{' '}
          <span className="text-primary">{name}</span>
        </div>
      </MyModal>
    </>
  );
};

export default ResultInterview;
