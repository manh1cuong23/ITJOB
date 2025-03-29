import React, { useEffect, useState } from 'react';
import { Form, message, Modal } from 'antd';
import { MyButton } from '@/components/basic/button';
import { MyFormItem } from '@/components/basic/form-item';
import { MyInput } from '@/components/basic/input';
import { CloseOutlined } from '@ant-design/icons';
import './ForgotPassword.less';
import { ReactComponent as TickSvg } from '@/assets/icons/ic_login_tick.svg';
import { authForgetPassword, authResetPassword } from '@/api/features/auth';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  email?: string;
  isCurrentPass?: boolean;
  currentPass?: string;
  userName?: string;
}

const ChangePassword: React.FC<IProps> = ({
  isOpen,
  onClose,
  onBack,
  email,
  currentPass,
  isCurrentPass = false,
  userName,
}) => {
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    letterCase: false,
    specialChar: false,
  });
	const [loading, setLoading] = useState(false);

  const hasVietnameseTones = (str: string) => {
    const normalizedStr = str.normalize('NFD');
    return /[\u0300-\u036fđĐ]/.test(normalizedStr);
  };

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('');
    }

    const trimmedValue = value.replace(/\s+/g, '');
    if (trimmedValue.length < 8 || trimmedValue.length > 15) {
      return Promise.reject('Invalid password');
    }
    if (
      !/(?=.*[a-z])(?=.*[A-Z])/.test(trimmedValue) ||
      hasVietnameseTones(trimmedValue)
    ) {
      return Promise.reject('Invalid password');
    }
    if (!/[@$#!&]/.test(trimmedValue)) {
      return Promise.reject('Invalid password');
    }

    return Promise.resolve();
  };

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen]);

  const validateConfirmPassword = (_: any, value: string) => {
    const password = form.getFieldValue('newPassword');
    if (!value) {
      return Promise.reject('');
    }
    if (password !== value && value.trim() !== '') {
      return Promise.reject('New password and confirm password do not match');
    }
    return Promise.resolve();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '');
    form.setFieldsValue({ newPassword: value });

    setPasswordStrength({
      length: value.length >= 8 && value.length <= 15,
      letterCase: /(?=.*[a-z])(?=.*[A-Z])/.test(value),
      specialChar: /[@$#!&]/.test(value),
    });
  };

  const handleSubmit = async () => {
		if (loading) return;
    const dataForm = await form.validateFields();
		setLoading(true);
    const res = isCurrentPass
      ? await authResetPassword({ userName, password: dataForm.newPassword })
      : await authForgetPassword({
          email,
          password: dataForm.newPassword,
        });

    if (res && res.isSuccess) {
      message.success('Change password successfully');
      onClose();
    } else if (res && !res.isSuccess && res.errors?.[0].code === 902) {
      form.setFields([
        {
          name: 'newPassword',
          errors: ['Invalid password'],
        },
      ]);
			setLoading(false);
    } else {
			setLoading(false);
		}
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={495}
      className="change-password-modal"
      closable={false}>
      <div className="change-password-wrapper">
        <div className="change-password-header">
          <h2 className="header-title">Change password</h2>
          <button onClick={onClose} className="header-close-btn">
            <CloseOutlined style={{ fontSize: '14px', color: '#000' }} />
          </button>
        </div>

        <div className="change-password-content">
          <Form form={form} layout="vertical" className="change-password-form">
            {isCurrentPass && (
              <MyFormItem
                name="currentPassword"
                className="current-password"
                label="Current Password"
                required
                rules={[
                  {
                    validator: (_: any, value: string) => {
                      if (!value) {
                        return Promise.reject('');
                      }
                      if (value !== currentPass) {
                        return Promise.reject('Password is incorrect');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                form={form}>
                <MyInput
                  className="change-password-input"
                  inputType="password"
                  showPasswordToggle={true}
                  placeholder="Enter"
                  maxLength={15}
                  // onChange={handlePasswordChange}
                />
              </MyFormItem>
            )}
            <MyFormItem
              name="newPassword"
              className="change-password-item"
              label="New Password"
              required
              rules={[{ validator: validatePassword }]}
              form={form}>
              <MyInput
                className="change-password-input"
                inputType="password"
                showPasswordToggle={true}
                placeholder="Enter"
                onChange={handlePasswordChange}
                maxLength={15}
              />
            </MyFormItem>
            <MyFormItem
              name="confirmPassword"
              className="confirm-password-item"
              label="Confirm New Password"
              required
              rules={[{ validator: validateConfirmPassword }]}
              form={form}>
              <MyInput
                className="confirm-password-input"
                inputType="password"
                showPasswordToggle={true}
                placeholder="Enter"
                maxLength={15}
              />
            </MyFormItem>
          </Form>

          <div className="password-requirements">
            <div
              className={`requirement-item ${
                passwordStrength.length ? 'fulfilled' : ''
              }`}>
              <TickSvg width={14} height={14} />
              <span className="requirement-text">
                Minimum 8 characters, maximum 15 characters
              </span>
            </div>
            <div
              className={`requirement-item ${
                passwordStrength.letterCase ? 'fulfilled' : ''
              }`}>
              <TickSvg width={14} height={14} />
              <span className="requirement-text">
                At least 1 lowercase letter and 1 uppercase letter
              </span>
            </div>
            <div
              className={`requirement-item ${
                passwordStrength.specialChar ? 'fulfilled' : ''
              }`}>
              <TickSvg width={14} height={14} />
              <span className="requirement-text">
                At least 1 special character below: @$#!&
              </span>
            </div>
          </div>
        </div>

        <div className="change-password-divider"></div>

        <div className="change-password-buttons">
          <MyButton
            buttonType="outline"
            className="close-button"
            onClick={onBack}>
            Close
          </MyButton>
          <MyButton
            buttonType="primary"
            className="save-button"
            onClick={handleSubmit}>
            Save
          </MyButton>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePassword;
