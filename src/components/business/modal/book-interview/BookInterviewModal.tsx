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
import { getDetailInterview } from '@/api/features/apply';
import { makeChangeInterviewCV } from '@/api/features/candicate';

const BookInterviewModal: React.FC<{
  id?: string;
  open: boolean;
  onFinish?: (value: any) => void;
  onCancel?: () => void;
  title: string;
  isSeeEmploy?: boolean;
  isEmployerCreate?: boolean;
  isEmployChange?: boolean;
  setPageData?: (data: any) => void;
  onBack?: () => void;
  setForceUpdate?: any;
  isViewMode?: boolean;
  isCandicate?: boolean;
  isInfo?: boolean;
}> = ({
  id,
  open,
  onFinish,
  isEmployerCreate = false,
  isSeeEmploy = false,
  setForceUpdate,
  isEmployChange = false,
  isCandicate = false,
  onCancel,
  title,
  isInfo,
  setPageData,
  isViewMode = false,
  onBack,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState<any>({});
  const [isView, setIsView] = useState<boolean>(true);
  const [selectedValue, setSelectedValue] = useState('');
  const [isNewInterView, setIsNewInterview] =
    useState<boolean>(isEmployerCreate);

  const resetForm = () => {
    form.resetFields();
  };

  console.log('check open', open);
  const handleChange = (e: any) => {
    setSelectedValue(e.target.value);
  };

  useEffect(() => {
    setIsView(isViewMode);
  }, [isViewMode, open]);

  const fetchDataInterview = async (id: string) => {
    const res = await getDetailInterview(id);
    console.log('check ', res);
    if (res.result) {
      if (isInfo) {
        setData(res.result?.interview_final_schedule);
      }
      if (!isSeeEmploy) {
        setData(res.result?.interview_candidate_suggest_schedule);
      } else {
        setData(res.result?.interview_employee_suggest_schedule);
      }
    }
  };
  useEffect(() => {
    if (open && id) {
      fetchDataInterview(id);
    }
  }, [open]);
  const handleNewInterview = () => {
    form.resetFields();
  };

  const handleOk = async (force: boolean = false) => {
    const dataForm = await form.validateFields();
    if (id && dataForm) {
      if (isNewInterView) {
        if (!isCandicate) {
          const res = await makeInterviewCV(id, dataForm);
          if (res && res.message) {
            message.success('Bạn đã gửi lời mời phỏng vấn thành công!');
            onCancel && onCancel();
            resetForm();
          }
        } else {
          const res = await makeChangeInterviewCV(id, dataForm);
          if (res && res.message) {
            message.success(
              'Bạn đã gửi yêu cầu thay đổi phỏng vấn thành công!'
            );
            onCancel && onCancel();
            resetForm();
          }
        }
      } else {
        const res = await acceptInterview(id);
        if (res && res.message) {
          message.success('Bạn đã xác nhận phỏng vấn thành công!');
          onCancel && onCancel();
          resetForm();
        }
      }
      setForceUpdate((a: number) => a + 1);
    }
    setIsNewInterview(false);
  };
  useEffect(() => {
    if (data?.date) {
      data.date = dayjs(data?.date);
    }
    console.log('check data', data);
    form.setFieldsValue(data);
  }, [data]);
  const handleCancel = () => {
    onCancel && onCancel();
    setIsNewInterview(false);
  };
  console.log('isNewInterView', isNewInterView);
  console.log('data', data);
  return (
    <>
      <MyModal
        width={880}
        title={!isNewInterView ? title : 'Tạo lịch phỏng vấn mới'}
        open={open}
        onOk={handleOk}
        onClose={(e: any) => {
          e.stopPropagation();
        }}
        onCancel={handleCancel}
        footer={
          <>
            <MyButton onClick={handleCancel} buttonType="outline">
              Hủy bỏ
            </MyButton>

            {isCandicate
              ? Object.keys(data || {}).length > 0 &&
                !isEmployChange && (
                  <MyButton
                    onClick={() => {
                      handleNewInterview();
                      setIsNewInterview(true);
                      setIsView(false);
                    }}
                    buttonType="secondary">
                    Đề xuất lịch mới
                  </MyButton>
                )
              : Object.keys(data || {}).length > 0 &&
                !isEmployChange && (
                  <MyButton
                    onClick={() => {
                      setIsNewInterview(true);
                      setIsView(false);
                    }}
                    buttonType="secondary">
                    Thay đổi
                  </MyButton>
                )}
            {/* {Object.keys(data || {}).length > 0 && !isEmployChange && (
              <MyButton
                onClick={() => {
                  handleNewInterview();
                  setIsNewInterview(true);
                  setIsView(false);
                }}
                buttonType="secondary">
                'Đề xuất lịch mới
              </MyButton>
            )} */}
            {isNewInterView ? (
              <MyButton
                disabled={isEmployChange && isView}
                onClick={() => handleOk(false)}>
                {'Gửi'}
              </MyButton>
            ) : (
              <MyButton
                disabled={isEmployChange && isView}
                onClick={() => handleOk(false)}>
                {Object.keys(data || {}).length > 0 ? 'Chấp nhận' : 'Gửi'}
              </MyButton>
            )}
          </>
        }>
        {data ? (
          <Form form={form} layout="vertical">
            <div className="">
              <div className="flex px-4">
                <div className="w-[180px] mt-2 mr-3">
                  <h1 className="text-[20px] font-medium">Thông tin</h1>
                </div>
                <div className="w-2/3">
                  <Row>
                    <Col span={24}>
                      <InputBasic
                        disabled={isView}
                        required
                        isSpan
                        label="Địa điểm"
                        name="address"
                      />
                    </Col>
                    <Col span={24}>
                      <MyFormItem
                        label="Ngày giờ"
                        disabled={isView}
                        required
                        name="date">
                        <DatePicker
                          className="w-full"
                          format="YYYY-MM-DD HH:mm:ss"
                          showTime={{
                            defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                          }}
                        />
                      </MyFormItem>
                    </Col>
                    <Col span={24}>
                      <InputBasic
                        required
                        disabled={isView}
                        isSpan
                        label="Thời gian phỏng vấn ( số phút)"
                        name="time"
                      />
                    </Col>

                    <Col span={24}>
                      <MyFormItem disabled={isView} name="note" label="Ghi chú">
                        <MyTextArea disabled={isView} />
                      </MyFormItem>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Form>
        ) : (
          'Không có thông tin'
        )}
      </MyModal>
    </>
  );
};

export default BookInterviewModal;
