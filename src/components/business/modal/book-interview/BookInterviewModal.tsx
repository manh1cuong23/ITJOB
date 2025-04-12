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

const BookInterviewModal: React.FC<{
  id?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish?: (value: any) => void;
  onCancel?: () => void;
  title: string;
  setPageData?: (data: any) => void;
  onBack?: () => void;
  isViewMode?: boolean;
}> = ({
  id,
  open,
  onFinish,
  onCancel,
  title,
  setPageData,
  setOpen,
  isViewMode = false,
  onBack,
}) => {
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState('');

  const resetForm = () => {
    form.resetFields();
  };

  console.log('check open', open);
  const handleChange = (e: any) => {
    setSelectedValue(e.target.value);
  };

  const handleOk = async (force: boolean = false) => {
    const data = await form.validateFields();
    console.log('data', data);
    if (id && data) {
      const res = await applyJob(id, data);
      if (res && res.message) {
        message.success('Bạn đã ứng tuyển thành công!');
        onCancel && onCancel();
      }
      console.log('res', res);
    }
  };

  const handleCancel = () => {
    onCancel && onCancel();
    form.resetFields();
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
            <MyButton onClick={() => handleOk(false)}>Lưu</MyButton>
          </>
        }>
        <Form form={form} layout="vertical" disabled={isViewMode}>
          <div className="">
            <div className="flex px-4">
              <div className="w-[180px] mt-2 mr-3">
                <h1 className="text-[20px] font-medium">Thông tin</h1>
              </div>
              <div className="w-2/3">
                <Row>
                  <Col span={24}>
                    <SingleSelectSearchCustom
                      options={[
                        { label: 'Offline', value: 'Offline' },
                        { label: 'Online', value: 'Online' },
                      ]}
                    />
                  </Col>
                  <Col span={24}>
                    <InputBasic
                      required
                      isSpan
                      label="Địa điểm (Offline)"
                      name="phone_number"
                    />
                  </Col>
                  <Col span={24}>
                    <InputBasic
                      required
                      isSpan
                      label="Link meet online"
                      name="email"
                    />
                  </Col>
                  <Col span={24}>
                    <MyFormItem label="Thời gian" required name="time">
                      <DatePicker
                        className="w-full"
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime={{
                          defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                        }}
                        name="email"
                      />
                    </MyFormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Form>
      </MyModal>
    </>
  );
};

export default BookInterviewModal;
