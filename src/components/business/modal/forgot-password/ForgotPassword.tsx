import React, { useState } from 'react';
import { Modal, Form, Col, Row } from 'antd';
import { MyButton } from '@/components/basic/button';
import './ForgotPassword.less';
import { ReactComponent as MailSvg } from '@/assets/icons/ic_mail.svg';
import InputEmail from '@/components/business/input/InputEmail';
import OtpVerification from './OtpVerification';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const ForgotPassword: React.FC<IProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(isOpen);

  React.useEffect(() => {
    setShowForgotModal(isOpen);
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setEmail(values.email);
      setShowOtpModal(true);
      setShowForgotModal(false);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const handleCloseAll = () => {
    setShowOtpModal(false);
    setShowForgotModal(false);
    form.resetFields();
    onClose();
  };

  const handleBackToForgot = () => {
    setShowOtpModal(false);
    setShowForgotModal(true);
  };

  return (
    <>
      <Modal
        open={showForgotModal}
        onCancel={handleCloseAll}
        footer={null}
        width={495}
        className="forgot-password-modal"
        closable={false}>
        <div className="forgot-password-container">
          <div className="email-icon">
            <MailSvg width={44} height={44} />
          </div>

          <h2 className="forgot-modal-title">Forgot your Password</h2>
          <p className="forgot-modal-desc">
            Enter your registered email to change password
          </p>
          <Form form={form} layout="vertical" className="forgot-form">
            <Row gutter={16}>
              <Col span={24}>
                <InputEmail form={form} required />
              </Col>
            </Row>
          </Form>
          <div className="forgot-modal-divider"></div>
          <div className="forgot-modal-button">
            <MyButton
              buttonType="outline"
              className="close-button"
              block
              onClick={handleCloseAll}>
              <span>Close</span>
            </MyButton>
            <MyButton
              buttonType="primary"
              className="send-button"
              block
              onClick={handleSubmit}>
              <span>Send</span>
            </MyButton>
          </div>
        </div>
      </Modal>

      <OtpVerification
        isOpen={showOtpModal}
        email={email}
        onClose={handleCloseAll}
        onBack={handleBackToForgot}
      />
    </>
  );
};

export default ForgotPassword;
