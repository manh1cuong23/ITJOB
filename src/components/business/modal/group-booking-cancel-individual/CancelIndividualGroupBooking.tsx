import React, { useState, useEffect } from 'react';
import { MyButton } from '@/components/basic/button';
import cancelIcon from '@/assets/header/Mask Group 5.jpg';
import { Col, Form, message, Row } from 'antd';
import { MyCardContent } from '@/components/basic/card-content';
import { MyFormItem } from '@/components/basic/form-item';
import { MyTextArea } from '@/components/basic/input';
import {
  apiBookingItemCancel,
  apiBookingItemListCancel,
} from '@/api/features/booking';
import { MyModal } from '@/components/basic/modal';
import ResultCancelIndividualGroupBooking from './ResultCancelIndividualGroupBooking';

const CancelIndividualGroupBooking: React.FC<{
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  record: any;
}> = ({ visible, onOk, onCancel, record }) => {
  const [form] = Form.useForm();
  const [visibleResult, setVisibleResult] = useState(false);
  const [updatedRecord, setUpdatedRecord] = useState(record);

  const handleSave = async () => {
    await form.validateFields();
    const dataForm = await form.getFieldsValue();
    const formattedBodies: API.BookingItemListCancelDto = {
      bookingItemIds: Array.isArray(record)
        ? record.map((row: any) => row.No)
        : [record.No],
      note: dataForm.reason,
    };
    const res = await apiBookingItemListCancel(formattedBodies);
    if (res && res.isSuccess) {
      onOk();
    } else {
      setVisibleResult(true);
      setTimeout(() => {
        handleCancel();
      }, 100);
      const updatedRecord = Array.isArray(record)
        ? record.map((row: any) => {
            const error = res.errors?.find((e: any) => e.id === row.No);
            return error ? { ...row, message: error.message } : row;
          })
        : {
            ...record,
            message: res.errors?.find((e: any) => e.id === record.No)?.message,
          };
      setUpdatedRecord(updatedRecord);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleCancelResult = () => {
    setVisibleResult(false);
  };

  return (
    <>
      <MyModal
        title=""
        width={400}
        open={visible}
        onOk={handleSave}
        onCancel={handleCancel}
        closable={false}
        footer={
          <>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <MyButton
                  onClick={handleCancel}
                  buttonType="outline"
                  style={{ width: '100%' }}>
                  Cancel
                </MyButton>
              </Col>
              <Col span={12}>
                <MyButton onClick={handleSave} style={{ width: '100%' }}>
                  Confirm
                </MyButton>
              </Col>
            </Row>
          </>
        }>
        <Form layout="vertical" form={form}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
            <img
              src={cancelIcon}
              alt="cancel"
              style={{ maxWidth: '30%', marginTop: '10px' }}
            />
            <span
              style={{
                margin: '16px 0',
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: '600',
                fontFamily: 'Inter',
                color: '#1C1917',
                textAlign: 'center',
              }}>
              Cancel the individual booking(s) ?
            </span>
            <MyCardContent hasHeader={false} style={{ width: '95%' }}>
              <MyFormItem required label="Reason" name="reason">
                <MyTextArea placeholder="Enter" rows={4} />
              </MyFormItem>
            </MyCardContent>
          </div>
        </Form>
      </MyModal>
      <ResultCancelIndividualGroupBooking
        visible={visibleResult}
        onCancel={handleCancelResult}
        data={updatedRecord}
      />
    </>
  );
};

export default CancelIndividualGroupBooking;
