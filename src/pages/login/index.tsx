import React, { useState, useRef, useEffect } from 'react';
import type { InputRef } from 'antd';
import { Form, Row, Col, Checkbox, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectLoading, setLoading } from '@/stores/slices/global.slice';
import { loginAsync } from '@/stores/thunks/auth.thunk';
import { setUserItem } from '@/stores/slices/auth.slice';
import LoginLogo from '../../assets/login/login-logo.svg';
import LoginImg from '@/assets/login/login_image.png';
import {
  clearRememberedCredentials,
  selectRememberedCredentials,
} from '@/stores/slices/rememberedCredentials.slice';
import './index.less';
import { MyInput } from '@/components/basic/input';
import { MyFormItem } from '@/components/basic/form-item';
import ForgotPasswordModal from '../../components/business/modal/forgot-password/ForgotPassword';
import { MyButton } from '@/components/basic/button';
import { decryptData, encryptData } from '@/utils/crypto';

const LoginForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const rememberedCredentials = useSelector(selectRememberedCredentials);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const passwordInputRef = useRef<InputRef>(null);

  useEffect(() => {
    const savedCredentials = JSON.parse(
      localStorage.getItem('rememberedCredentials') || '{}'
    );
    if (savedCredentials?.remember) {
      form.setFieldsValue({
        username: savedCredentials.username,
        password: decryptData(savedCredentials.password).replace(
          'TAPortal',
          ''
        ),
      });
      setRememberMe(true);
    }
  }, [form]);

  const validateUsername = (_: any, value: string) => {
    // if (!value) {
    //   return Promise.reject('Username is required!');
    // }
    // if (value.length < 5) {
    //   return Promise.reject("Username doesn't exist");
    // }
    // if (value.includes(' ')) {
    //   return Promise.reject("Username doesn't exist");
    // }
    // if (!/^[a-zA-Z0-9]+$/.test(value)) {
    //   return Promise.reject("Username doesn't exist");
    // }

    return Promise.resolve();
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (value.length > 15) {
      value = value.slice(0, 15);
    }

    value = value.replace(/[^a-zA-Z0-9]/g, '');

    form.setFieldsValue({ username: value });
  };

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    dispatch(setLoading(true));
    try {
      const passwordWithPrefix = values.password + 'TAPortal';
      const encryptedPassword = encryptData(passwordWithPrefix);
      if (rememberMe) {
        localStorage.setItem(
          'rememberedCredentials',
          JSON.stringify({
            username: values.username,
            password: encryptedPassword,
            remember: true,
          })
        );
      } else {
        localStorage.removeItem('rememberedCredentials');
      }

      await dispatch(
        loginAsync({
          params: values,
          onSuccess: data => {
            dispatch(
              setUserItem({
                logged: true,
                username: data?.userId,
                role: data?.role,
                token: data?.token,
              })
            );
            localStorage.setItem('json', JSON.stringify(encryptedPassword));
            message.success('Signed in successfully');
            navigate('/');
          },
          onError: error => {
            dispatch(setLoading(false));
            message.error(error);
            console.error(error);
          },
        })
      );
    } catch (error) {
      dispatch(setLoading(false));
      console.error('An unexpected error occurred:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRememberMe = (checked: boolean) => {
    setRememberMe(checked);
    if (!checked) {
      dispatch(clearRememberedCredentials());
    }
  };

  const handleForgotPassword = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePasswordReset = (email: string) => {
    setIsModalOpen(false);
  };

  return (
    <div className="login-page-container">
      <Row className="login-row">
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="login-form-col">
          <div className="login-form-wrapper">
            <div className="login-header">
              <img
                src={LoginLogo}
                alt="Lotus Xpert Logo"
                className="login-logo"
              />
              <p className="login-title1 py-2">Login</p>
              <p className="login-title2 py-2">Welcome To Lotus Xpert</p>
            </div>
            <Form
              form={form}
              onFinish={handleLogin}
              layout="vertical"
              className="login-form">
              <MyFormItem
                name="email"
                label="Email"
                rules={[{ validator: validateUsername }]}
                className="form-item">
                <MyInput
                  className="login-input"
                  placeholder="Enter"
                  onChange={handleUsernameChange}
                />
              </MyFormItem>
              <MyFormItem
                name="password"
                className="form-item"
                label="Password"
                rules={[{ required: true, message: 'Password is required!' }]}>
                <MyInput
                  className="login-input"
                  ref={passwordInputRef}
                  inputType="password"
                  showPasswordToggle={true}
                  placeholder="Enter"
                />
              </MyFormItem>

              <div className="remember-forgot-container">
                <Checkbox
                  className="remember-checkbox"
                  checked={rememberMe}
                  onChange={e => handleRememberMe(e.target.checked)}>
                  Remember Me
                </Checkbox>
                <a className="forgot-password" onClick={handleForgotPassword}>
                  Forgot password
                </a>
              </div>

              <MyButton
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="login-button">
                <span>Sign In</span>
              </MyButton>
            </Form>
          </div>
        </Col>
        <Col xs={0} sm={0} md={12} lg={12} xl={12} className="image-container">
          <img src={LoginImg} alt="Login Image" />
        </Col>
      </Row>
      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handlePasswordReset}
      />
    </div>
  );
};

export default LoginForm;
