import React, { useState, useEffect } from 'react';
import { MyButton } from '@/components/basic/button';
import { Col, Form, Row } from 'antd';
import { ReactComponent as ProfileSvg } from '@/assets/icons/ic_profile_update.svg';
import { MyModal } from '@/components/basic/modal';

const ProfileUpdate: React.FC<{
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  title?: string;
}> = ({ visible, onCancel, title, onOk }) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleOk = async () => {
    form.validateFields();
    await onOk();
    onCancel();
  };

  return (
    <>
      <MyModal
        title=""
        width={400}
        open={visible}
        onCancel={handleCancel}
        closable={false}
        footer={
          <div style={{ display: 'flex' }}>
            <MyButton onClick={handleCancel} buttonType="outline" block>
              No
            </MyButton>
            <MyButton block onClick={handleOk}>
              Yes!
            </MyButton>
          </div>
        }>
        <div
          style={{
            margin: '16px 0 0 0',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <ProfileSvg width={80} height={80} />
          <span
            style={{
              margin: '16px 50px 0',
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: '600',
              fontFamily: 'Inter',
              color: '#1C1917',
              textAlign: 'center',
            }}>
            {title}
          </span>
        </div>
      </MyModal>
    </>
  );
};

export default ProfileUpdate;
