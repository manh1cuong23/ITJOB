import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as LockSvg } from '@/assets/icons/ic_login_lock.svg';
import ChangePassword from './ChangePassword';
import { authConfirmOtp, authGenerateOtp } from '@/api/features/auth';
import './ForgotPassword.less';

interface IProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onBack: () => void;
}

const OtpVerification: React.FC<IProps> = ({
  isOpen,
  email,
  onClose,
  onBack,
}) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleOtpChange = (value: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value.trim() !== '' && index < otp.length - 1) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 100);
    }
  };

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 100);
      }
    }
  };

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleShowChangePassword = async () => {
    const otpString = otp.join('');
    const res = await authConfirmOtp({
      email,
      otp: otpString,
    });

    if (res && res.isSuccess) {
      setShowChangePassword(true);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setShowMessage(false);
      setOtp(Array(6).fill(''));
      setIsButtonDisabled(false);
    }
  }, [isOpen]);

  const handleCloseChangePassword = () => {
    setShowChangePassword(false);
    onClose();
  };

  const handleBackToOtp = () => {
    setShowChangePassword(false);
  };

  const handleResend = async () => {
    try {
      const res = await authGenerateOtp({ email });

      if (res && res.isSuccess) {
        setIsButtonDisabled(true);
        setShowMessage(true);
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  const handleBlur = (
    index: number,
    otp: string[],
    setOtp: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const updatedOtp = [...otp];

    if (!/^\d$/.test(otp[index])) {
      updatedOtp[index] = '';
      setOtp(updatedOtp);
    }
  };

  return (
    <>
      <Modal
        open={isOpen && !showChangePassword}
        onCancel={onBack}
        footer={null}
        className="otp-verification-modal"
        closable={false}>
        <div className="otp-verification-container">
          <div className="lock-icon">
            <LockSvg width={46} height={46} />
          </div>

          <h2 className="otp-modal-title">Verify OTP</h2>
          {showMessage && (
            <div className="otp-modal-desc">
              <p>
                An OTP code was sent to <span>{email}</span>{' '}
              </p>
              <p>Enter it within 3 minutes </p>
            </div>
          )}

          <div className="otp-input-container">
            {[0, 1, 2].map(i => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={otp[i]}
                className="otp-digit"
                placeholder="0"
                onBlur={() => handleBlur(i, otp, setOtp)}
                onChange={e => handleOtpChange(e.target.value, i)}
                ref={el => (inputRefs.current[i] = el!)}
                onKeyUp={e => handleKeyUp(e, i)}
              />
            ))}
            <span className="otp-separator">-</span>
            {[3, 4, 5].map(i => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={otp[i]}
                className="otp-digit"
                placeholder="0"
                onBlur={() => handleBlur(i, otp, setOtp)}
                onChange={e => handleOtpChange(e.target.value, i)}
                ref={el => (inputRefs.current[i] = el!)}
                onKeyUp={e => handleKeyUp(e, i)}
              />
            ))}
          </div>

          <p className="resend-text">
            Didn't get a code?{' '}
            <a
              onClick={!isButtonDisabled ? handleResend : undefined}
              className={isButtonDisabled ? 'disabled' : ''}>
              Click to resend.
            </a>
          </p>

          <div className="otp-modal-divider"></div>

          <div className="otp-modal-button">
            <MyButton
              buttonType="outline"
              className="close-button"
              block
              onClick={onBack}>
              <span>Close</span>
            </MyButton>
            <MyButton
              buttonType="primary"
              className="save-button"
              block
              onClick={handleShowChangePassword}>
              <span>Save</span>
            </MyButton>
          </div>
        </div>
      </Modal>
      <ChangePassword
        isOpen={showChangePassword}
        onClose={handleCloseChangePassword}
        onBack={handleBackToOtp}
        email={email}
      />
    </>
  );
};

export default OtpVerification;
