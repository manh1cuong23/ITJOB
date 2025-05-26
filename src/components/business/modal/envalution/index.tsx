import React, { useCallback, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { Row, Col, Form, message, Rate } from 'antd';
import { MyModal } from '@/components/basic/modal';
import { getMe, updateMe } from '@/api/features/user';
import { InputBasic } from '../../input';
import { MyFormItem } from '@/components/basic/form-item';
import ReactQuill from 'react-quill';
import RadioButtonSimple from '@/components/basic/radio/RadioSimple';
import { MyRadio } from '@/components/basic/radio';
import MyCheckBox from '../../checkbox/MyCheckBox';
import { envalutionEmployer } from '@/api/features/candicate';

const EnvalutionRecruiterModal: React.FC<{
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
  const [content, setContent] = useState<any>();
  const [rate, setRate] = useState<number>(5);
  const [form] = Form.useForm();

  const handleOk = async (force: boolean = false) => {
    const data = await form.validateFields();
    let dataForm = { ...data, content, rate };
    if (id && dataForm) {
      const res = await envalutionEmployer(id, dataForm);
      if (res && res.message) {
        message.success('Bạn đã đánh giá công ty thành công');
        onCancel && onCancel();
        form.resetFields();
      }
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
            <MyButton onClick={() => handleOk(false)}>Đánh giá</MyButton>
          </>
        }>
        <Form form={form} layout="vertical" className="px-4 py-2">
          <div className="flex items-center gap-[16px] ">
            <h1 className="text-[16px] font-medium">Đánh giá chung</h1>
            <div className="rate-header">
              <Rate
                value={rate}
                onChange={value => {
                  setRate(value);
                }}
                allowHalf
                defaultValue={5}
                className="my-1"
                style={{ fontSize: '30px' }} // Tăng kích thước ngôi sao
              />
            </div>
          </div>
          <InputBasic
            disabled={isViewMode}
            label="Tiêu đề đánh giá"
            name="title"
            placeholder="Đánh giá"
            // isName
            required
            form={form}
          />
          <MyFormItem
            name="description"
            label="Nội dung"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}>
            <div>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                style={{ height: '200px', marginBottom: '80px' }}
              />
            </div>
          </MyFormItem>
          <MyCheckBox
            form={form}
            defaultValue={true}
            name="isEncouragedToWorkHere"
            label="Khuyến khích làm việc tại đây"
          />
        </Form>
      </MyModal>
    </>
  );
};

export default EnvalutionRecruiterModal;
