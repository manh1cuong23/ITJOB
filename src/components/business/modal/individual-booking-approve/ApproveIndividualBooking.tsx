import React, { useState, useEffect } from 'react';
import { MyButton } from '@/components/basic/button';
import approveIcon from '@/assets/header/Illustration library 2.png';
import { Col, Form, message, Row } from 'antd';
import {
  apiBookingApprove,
  apiBookingApproveItem,
} from '@/api/features/booking';
import { MyModal } from '@/components/basic/modal';
import ResultErrorBooking from './ResultlErrorBooking';
import { BOOKING_STATUS } from '@/constants/booking';

const ApproveIndividualBooking: React.FC<{
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  isItem?: boolean;
  value?: any;
}> = ({ visible, onOk, onCancel, value, isItem = false }) => {
  const [visibleResult, setVisibleResult] = useState(false);
  const [updatedRecord, setUpdatedRecord] = useState(value);

  const handleSave = async () => {
    let invalidBookings: any[] = [];
    let validBookings: any[] = [];

    if (Array.isArray(value)) {
      invalidBookings = value.filter((item: any) => item.bookingStatus !== 1);
      validBookings = value.filter((item: any) => item.bookingStatus === 1);
    } else {
      validBookings = [value];
    }

    // Nếu có mục không hợp lệ, hiển thị thông báo lỗi và cập nhật danh sách lỗi
    if (invalidBookings.length > 0) {
      setVisibleResult(true);
      setTimeout(() => {
        handleCancel();
      }, 100);
      const updatedRecord = invalidBookings.map((row: any) => ({
        bookingNo: isItem ? (row?.key ? `#${row?.key}` : '') : row.bookingNo,
        status: row.bookingStatus,
        message: `Cannot approve ${BOOKING_STATUS.find(
          item => item.value === row.bookingStatus
        )?.label.replace(/^./, c => c.toLowerCase())} booking`,
      }));

      setUpdatedRecord(updatedRecord);

      // Nếu tất cả đều không hợp lệ, thì return, không gửi request
      if (validBookings.length === 0) {
        return;
      }
    }

    // Tiếp tục xử lý với các booking hợp lệ (bookingStatus === 1)
    const bookingIds = validBookings.map((row: any) => row.id);
    const formattedBody = {
      [isItem ? 'bookingItemIds' : 'bookingIds']: bookingIds,
      status: 3,
      note: 'duyệt đặt phòng',
    };

    const res = isItem
      ? await apiBookingApproveItem(formattedBody)
      : await apiBookingApprove(formattedBody);

    if (res && res.isSuccess) {
      const Message = res.data.messageName;
      message.success(Message);
      invalidBookings.length === 0 && onOk();
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
  };

  const handleCancel = () => {
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <img
            src={approveIcon}
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
            Are you sure to approve the booking(s)?
          </span>
        </div>
      </MyModal>
      <ResultErrorBooking
        visible={visibleResult}
        onCancel={handleCancelResult}
        data={updatedRecord}
        text="approve"
      />
    </>
  );
};

export default ApproveIndividualBooking;
