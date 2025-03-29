import { css } from '@emotion/react';
import { Button, Modal, ModalProps } from 'antd';
import { useState } from 'react';
import { ReactComponent as BackWhite } from '@/assets/icons/ic_back_white.svg';

// Định nghĩa các style
const styles = {
  modal: css`
    .ant-modal-body {
      background: #eeedec;
      padding: 0;
      max-height: 90vh;
      overflow: auto;
      background-color: #eeedec;
    }
    .ant-modal-wrap {
      overflow: hidden;
    }
    .ant-modal-content {
      background-color: #eeedec;
      padding: 0px;
    }
    .ant-modal-header {
      padding-left: 12px;
      padding-top: 12px;
      background-color: #eeedec;
    }
    .ant-modal-body {
      padding: 12px;
      background: #ffff;
      border-radius: 0px 0px 12px 12px;
    }
    .ant-modal-close {
      width: 24px;
      height: 24px;
      border-radius: 24px;
      background: #ffff;
    }
    .ant-modal-footer {
      border-radius: 14px;
    }
  `,
  isBack: css`
    padding: 0px !important;
    margin: 0px !important;
    border-radius: 0px !important;
  `,
  titleContainer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eeedec;
  `,
  button: css`
    margin-right: 5px;
    color: gray;
    transition: color 0.3s;
    &:hover {
      color: #1890ff;
    }
  `,
  icon: css`
    font-size: 16px;
    position: relative;
    top: -2px;
  `,
  title: css`
    font-size: 18px;
    font-weight: 500;
    color: #1c1917;
  `,
};

interface BaseModalProps extends ModalProps {
  maxContentWidth?: string | number;
  isOpen: boolean;
  title: string;
  onClose: () => any;
  children: React.ReactNode;
  isBack?: boolean;
  onBack?: () => any;
}

function BaseModal(props: BaseModalProps) {
  const { isOpen, maxContentWidth, title, onClose, children, isBack, onBack } =
    props;

  const handleCancel = () => {
    onClose && onClose();
  };

  return (
    <Modal
      maskClosable={false}
      css={styles.modal}
      onCancel={handleCancel}
      open={isOpen}
      width={maxContentWidth || '519px'}
      footer={<></>}
      title={
        <div css={styles.titleContainer}>
          <div className="row">
            {isBack ? (
              <Button
                type="text"
                css={styles.isBack}
                onClick={() => {
                  onBack && onBack();
                }}>
                <BackWhite width={24} height={24} />
              </Button>
            ) : null}
            <span css={styles.title}>{title}</span>
          </div>
        </div>
      }>
      <div className="body">{children}</div>
    </Modal>
  );
}

export default BaseModal;
