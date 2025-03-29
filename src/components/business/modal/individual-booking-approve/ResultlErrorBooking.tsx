import React, { useState, useEffect } from 'react';
import { MyButton } from '@/components/basic/button';
import { Col, Row } from 'antd';
import { ReactComponent as ErrorIcon } from '@/assets/icons/ic_noti_error.svg';
import { MyModal } from '@/components/basic/modal';
import { TableBasic } from '@/components/basic/table';
import { STATUS_BOOKING } from '@/constants/page';
import { useNavigate } from 'react-router-dom';

const ResultErrorBooking: React.FC<{
  visible: boolean;
  onCancel: () => void;
  data: any;
  text?: string;
}> = ({ visible, onCancel, data, text }) => {
  const handleCancel = () => {
    onCancel();
  };

  const columns = [
    {
      title: 'Booking No',
      dataIndex: 'bookingNo',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(value: number, record: any, index: number) {
        let label = '';

        const getStyleStatus = () => {
          switch (value) {
            case STATUS_BOOKING.WARNING:
              label = 'Waiting';
              return 'status-waiting-booking';
            case STATUS_BOOKING.REJECTED:
              label = 'Rejected';
              return 'status-rejected-booking';
            case STATUS_BOOKING.CONFIRMED:
              label = 'Confirmed';
              return 'status-confirmed-booking';
            case STATUS_BOOKING.CHECKED_IN:
              label = 'Checked In';
              return 'status-checked-in-booking';
            case STATUS_BOOKING.CHECK_OUT:
              label = 'Checked out';
              return 'status-checked-out-booking';
            case STATUS_BOOKING.CANCELED:
              label = 'Cancelled';
              return 'status-cancelled-booking';
            case STATUS_BOOKING.CLOSED:
              label = 'Closed';
              return 'status-closed-booking';
            default:
              label = '-';
              return '';
          }
        };
        return (
          <div className={getStyleStatus()} style={{ width: 'fit-content' }}>
            {label}
          </div>
        );
      },
    },
    {
      title: 'Error',
      dataIndex: 'message',
    },
  ];

  return (
    <>
      <MyModal
        title=""
        width={600}
        open={visible}
        onCancel={handleCancel}
        closable={false}
        footer={
          <>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <MyButton
                  onClick={handleCancel}
                  buttonType="outline"
                  style={{ width: '100%' }}
                >
                  Close
                </MyButton>
              </Col>
            </Row>
          </>
        }
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ErrorIcon width={50} height={50} />
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            {text && text.charAt(0).toUpperCase() + text.slice(1)} booking
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: '#57534E',
              marginBottom: 10,
            }}
          >
            Can not {text} booking(s)
          </div>
        </div>
        <TableBasic dataSource={data} columns={columns} />
      </MyModal>
    </>
  );
};

export default ResultErrorBooking;
