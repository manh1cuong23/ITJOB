import React, { useCallback, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { Row, Col, Form, message } from 'antd';
import { MyModal } from '@/components/basic/modal';
import { MyFormItem } from '@/components/basic/form-item';
import { InputBasic } from '../../input';
import { MyTextArea } from '@/components/basic/input';
import { applyJob } from '@/api/features/job';
import { getMe } from '@/api/features/user';

const ApplyJobModal: React.FC<{
  id?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  onCancel,
  title,
  setPageData,
  setOpen,
  setForceUpdate,
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

  const fetchMe = async () => {
    const data = await getMe();
    if (data?.result) {
      const newData = {
        email: data?.result.email,
        ...data?.result?.candidate_info,
      };
      form.setFieldsValue(newData);
    }
    console.log('data', data);
  };
  useEffect(() => {
    if (open) {
      fetchMe();
      setForceUpdate((prev: number) => prev + 1);
    }
  }, [open]);
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
    setForceUpdate((prev: number) => prev + 1);
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
            <MyButton onClick={() => handleOk(false)}>Ứng tuyển</MyButton>
          </>
        }>
        <Form form={form} layout="vertical" disabled={isViewMode}>
          <div className="">
            <div className="flex px-4">
              <div className="w-[180px] mt-2 mr-3">
                <h1 className="text-[20px] font-medium">Thông tin cơ bản</h1>
              </div>
              <div className="w-2/3">
                <Row>
                  <Col span={24}>
                    <InputBasic required isSpan label="Họ và tên" name="name" />
                  </Col>
                  <Col span={24}>
                    <InputBasic
                      required
                      isSpan
                      label="Số điện thoại"
                      name="phone_number"
                    />
                  </Col>
                  <Col span={24}>
                    <InputBasic
                      required
                      isSpan
                      label="Email liên hệ"
                      name="email"
                    />
                  </Col>
                </Row>
              </div>
            </div>
            <div className="flex px-4 mt-4">
              <div className="w-[180px] mt-2 mr-3">
                <h1 className='text-[20px] font-medium"'>Chọn CV</h1>
              </div>
              <div className="w-2/3">
                <div className="h-[40px] w-full border mb-2"></div>
                <MyButton>Tải CV của bạn</MyButton>
              </div>
            </div>
            <div className="flex px-4 mt-4">
              <div className="w-[180px] mt-2 mr-3">
                <h1 className='text-[20px] font-medium"'>Thư giới thiệu</h1>
              </div>
              <div className="w-2/3">
                <MyFormItem name="content" isShowLabel={false}>
                  <MyTextArea></MyTextArea>
                </MyFormItem>
              </div>
            </div>
          </div>
        </Form>
      </MyModal>
    </>
  );
};

export default ApplyJobModal;
