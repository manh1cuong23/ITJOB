import React, { useState, useEffect } from 'react';
import { MyModal } from '@/components/basic/modal';
import { MyButton } from '@/components/basic/button';
import cancelIcon from '@/assets/header/Frame 1261163339.png';

const SharedDeleteConfirm: React.FC<{
  visible: boolean;
  onCancel: () => void;
}> = ({ visible, onCancel }) => {
  return (
    <MyModal
      width={480}
      open={visible}
      closable={false}
      title={null}
      onCancel={onCancel}
      footer={
        <div
          style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <MyButton
            style={{ width: '80%' }}
            onClick={onCancel}
            buttonType="outline">
            Close
          </MyButton>
        </div>
      }>
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
          Voucher exceeds booking nights.
          <br /> Please check and try again
        </span>
      </div>
    </MyModal>
  );
};

export default SharedDeleteConfirm;
