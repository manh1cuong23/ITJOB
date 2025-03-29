import React, { useEffect, useState } from 'react';
import { Modal, Form, Col, Row, Avatar } from 'antd';
import { MyButton } from '@/components/basic/button';
import './ForgotPassword.less';
import { CheckCircleFilled } from '@ant-design/icons';
import { MyInput } from '@/components/basic/input';
import { MyFormItem } from '@/components/basic/form-item';
import { InputBasic } from '../../input';
import { MyModal } from '@/components/basic/modal';
import ChangePassword from './ChangePassword';
import { selectPassWord } from '@/stores/slices/auth.slice';
import { useSelector } from 'react-redux';
import { apiUserSearch } from '@/api/features/user';
import Password from 'antd/es/input/Password';
import { decryptData } from '@/utils/crypto';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const Profile: React.FC<IProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(isOpen);
  const [showChangePassword, setShowChangePassword] = useState(false);
	const [userName, setUserName] = useState('');
	const [currentPass, setCurrentPass] = useState('');
  const [initialValues, setInitialValues] = useState<any>();

  const featData = async (SearchField: any) => {
		let decryptedPassword = '';
		const pass = JSON.parse(localStorage.getItem('json') || '');
    if (pass !== '') {
      decryptedPassword = decryptData(pass).replace('CMS', '');
      setCurrentPass(decryptedPassword);
    }
    const res = await apiUserSearch(SearchField);
    if (res && res.status) {
      form.setFieldsValue({
        username: res.result.data?.[0]?.userName,
        email: res.result.data?.[0]?.email,
        phone: res.result.data?.[0]?.phone,
        password: decryptedPassword,
      });
			setEmail(res.result.data?.[0]?.email);
      setUserName(res.result.data?.[0]?.userName);
    }
  };

  React.useEffect(() => {
    setShowForgotModal(isOpen);
    if (isOpen) {
      const initialSearchField: API.searchObj[] = [
        {
          key: 'userName',
          value: localStorage.getItem('username') || '',
        },
      ];
      featData({ searchFields: initialSearchField });
    }
  }, [isOpen]);

  const handleCloseChangePassword = () => {
    setShowChangePassword(false);
    onClose();
  };

  const handleBackToOtp = () => {
    setShowChangePassword(false);
  };

  return (
    <>
      <MyModal
        title="Profile"
        open={isOpen && !showChangePassword}
        onCancel={onClose}
        footer={
          <>
            <MyButton onClick={onClose} buttonType="outline">
              Close
            </MyButton>
            <MyButton type="primary" onClick={onSubmit}>
              Save
            </MyButton>
          </>
        }>
        <Form layout="vertical" initialValues={initialValues} form={form}>
          <Row
            gutter={[16, 16]}
            style={{
              border: '1px solid #d6d3d1',
              padding: 16,
              margin: 5,
              borderRadius: 8,
            }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Avatar
                size={100}
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  fontSize: '40px',
                  color: '#000',
                }}></Avatar>
              <CheckCircleFilled
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 75,
                  transform: 'translate(50%, 50%)',
                  fontSize: 24,
                  color: '#52c41a', // Màu xanh lá cây
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                }}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <InputBasic label="Username" name="username" disabled />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <InputBasic disabled name="email" label="Email" />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <InputBasic label="Phone" name="phone" disabled />
            </Col>
          </Row>

          <Row
            gutter={[16, 16]}
            style={{
              border: '1px solid #d6d3d1',
              padding: 16,
              margin: '16px 5px 5px',
              borderRadius: 8,
            }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <MyFormItem
                label="Password"
                name="password"
                extra={
                  <a
                    href="#"
                    style={{ color: '#ed4e6b', fontWeight: 600 }}
                    onClick={() => setShowChangePassword(true)}>
                    Change Password
                  </a>
                }>
                <MyInput
                  className="change-password-input"
                  inputType="password"
                  showPasswordToggle={true}
                  placeholder="Enter"
                />
              </MyFormItem>
            </Col>
          </Row>
        </Form>
      </MyModal>
      <ChangePassword
        isCurrentPass
        isOpen={showChangePassword}
        onClose={handleCloseChangePassword}
        onBack={handleBackToOtp}
        userName={userName}
        currentPass={currentPass}
      />
    </>
  );
};

export default Profile;
