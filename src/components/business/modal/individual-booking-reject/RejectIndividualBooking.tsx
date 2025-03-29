import React, { useState, useEffect } from 'react';
import { MyButton } from '@/components/basic/button';
import cancelIcon from '@/assets/header/Mask Group 5.jpg';
import { Col, Form, message, Row } from 'antd';
import { MyCardContent } from '@/components/basic/card-content';
import { MyFormItem } from '@/components/basic/form-item';
import { MyTextArea } from '@/components/basic/input';
import { apiBookingReject, apiBookingRejectItem } from '@/api/features/booking';
import { MyModal } from '@/components/basic/modal';
import ResultErrorBooking from '../individual-booking-approve/ResultlErrorBooking';
import { BOOKING_STATUS } from '@/constants/booking';

const RejectIndividualBooking: React.FC<{
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  isItem?: boolean;
  value?: any;
}> = ({ visible, onOk, onCancel, value, isItem = false }) => {
  const [form] = Form.useForm();
  const [visibleResult, setVisibleResult] = useState(false);
  const [updatedRecord, setUpdatedRecord] = useState(value);

  const handleSave = async () => {
    try {
      await form.validateFields();
      const dataForm = await form.getFieldsValue();

      // Nếu value không phải là array, bỏ qua bước lọc
      let invalidBookings: any[] = [];
      let validBookings: any[] = [];

      if (Array.isArray(value)) {
        invalidBookings = value.filter((item: any) => item.bookingStatus !== 1);
        validBookings = value.filter((item: any) => item.bookingStatus === 1);
      } else {
        validBookings = [value];
      }

      if (invalidBookings.length > 0) {
        setVisibleResult(true);
        setTimeout(() => {
          handleCancel();
        }, 100);

        const updatedRecord = invalidBookings.map((row: any) => ({
          bookingNo: isItem ? (row?.key ? `#${row?.key}` : '') : row.bookingNo,
          status: row.bookingStatus,
          message: `Cannot reject ${BOOKING_STATUS.find(
            item => item.value === row.bookingStatus
          )?.label.replace(/^./, c => c.toLowerCase())} booking`,
        }));

        setUpdatedRecord(updatedRecord);

        if (validBookings.length === 0) {
          return;
        }
      }

      // Nếu value là object thì chỉ xử lý bình thường
      const bookingIds = validBookings.map((row: any) => row.id);
      const formattedBody = {
        [isItem ? 'bookingItemIds' : 'bookingIds']: bookingIds,
        status: 2,
        note: dataForm.reason,
      };

      const res = isItem
        ? await apiBookingRejectItem(formattedBody)
        : await apiBookingReject(formattedBody);

      if (res && res.isSuccess) {
        message.success(res.data.messageName);
        onOk();
      } else {
        setVisibleResult(true);
        setTimeout(() => {
          handleCancel();
        }, 100);

        const updatedRecord = validBookings.map((row: any) => {
          const error = res.errors?.find((e: any) => e.id === row.id);
          return error
            ? {
                bookingNo: isItem
                  ? row?.key
                    ? `#${row?.key}`
                    : ''
                  : row.bookingNo,
                status: row.bookingStatus,
                message: error.message,
              }
            : row;
        });

        setUpdatedRecord(updatedRecord);
      }
    } catch (error) {
      console.error('Lỗi khi xử lý form:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleCancelResult = () => {
    setVisibleResult(false);
    onOk();
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
                  style={{ width: '100%' }}
                >
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
        }
      >
        <Form layout="vertical" form={form}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
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
              }}
            >
              Are you sure to reject the booking(s)?
            </span>
            <MyCardContent hasHeader={false} style={{ width: '95%' }}>
              <MyFormItem required label="Reason" name="reason">
                <MyTextArea placeholder="Enter" rows={4} />
              </MyFormItem>
            </MyCardContent>
          </div>
        </Form>
      </MyModal>
      <ResultErrorBooking
        visible={visibleResult}
        onCancel={handleCancelResult}
        data={updatedRecord}
        text="reject"
      />
    </>
  );
};

export default RejectIndividualBooking;
