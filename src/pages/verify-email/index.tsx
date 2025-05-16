import { verifyEmail } from '@/api/features/auth';
import { Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';
const VerifyPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const verifyEmail2 = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
      if (!token) return;

      const res = await verifyEmail({ emailVerifyToken: token }); // Thay bằng endpoint thật của bạn

      if (res.message) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
      setLoading(false);
    };
    verifyEmail2();
  }, [location.search]);

  return (
    <div className="w-full flex gap-[20x] justify-center items-center">
      <img src={logo} className="h-[100px]" />
      <div>
        <div className="text-[20px] font-medium">Xác thực email</div>
        {loading ? (
          <Spin tip="Loading..." />
        ) : success ? (
          <div className=" text-[20px] font-medium text-green-500">
            Email xác thực thành công
          </div>
        ) : (
          <div className=" text-[20px] font-medium text-red-500">
            Xác thực thất bại
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
