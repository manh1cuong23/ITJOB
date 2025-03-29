import React, { useState, useEffect } from 'react';
import { MyModal } from '@/components/basic/modal';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as Tick } from '@/assets/icons/ic_ticks.svg';
import { ReactComponent as Upload } from '@/assets/icons/ic_upload.svg';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { ReactComponent as File } from '@/assets/icons/ic_file.svg';
import { ReactComponent as Delete } from '@/assets/icons/ic_delete_white.svg';
import MyFileUpload from '@/components/basic/upload/upload-file';
import { Col, Flex, Row, Progress } from 'antd';
import './SharedDeleteConfirm.less';
const SharedDeleteConfirm: React.FC<{
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  content: string;
  textBtnOk?: string;
  textBtnCancel?: string;
}> = ({
  visible,
  onOk,
  onCancel,
  content,
  textBtnOk = 'Delete',
  textBtnCancel = 'Cancel',
}) => {
  return (
    <MyModal
      width={480}
      open={visible}
      closable={false}
      title={null}
      onOk={onOk}
      onCancel={onCancel}
      footer={
        <Flex>
          <MyButton
            style={{ width: '50%' }}
            onClick={onCancel}
            buttonType="outline">
            {textBtnCancel}
          </MyButton>
          <MyButton style={{ width: '50%' }} onClick={onOk}>
            {textBtnOk}
          </MyButton>
        </Flex>
      }>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 7px',
            borderRadius: '50%',
            background: '#FEE2E2',
          }}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 10px',
              borderRadius: '50%',
              background: '#EF4444',
            }}>
            <Delete
              style={{
                width: '20px',
                marginTop: 3,
                height: '20px',
                color: '#fff',
              }}
            />
          </div>
        </div>
        <p style={{ fontSize: '16px', fontWeight: 500, marginTop: '10px' }}>
          {content}
        </p>
      </div>
    </MyModal>
  );
};

export default SharedDeleteConfirm;
