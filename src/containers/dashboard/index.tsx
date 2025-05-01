import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import DaskboardSearch from './component/daskboard-search/DaskboardSearch';
import DaskboardContent from './component/daskboard-content/DaskboardContent';
import { useSelector } from 'react-redux';
import { TypeUser } from '@/interface/common/type';
import { useNavigate } from 'react-router-dom';

const DashboardComponent: React.FC = () => {
  const { device, collapsed, role } = useSelector(state => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (role === TypeUser.Admin) {
      navigate('/admin/users');
    }
  }, [role, navigate]);
  return (
    <div className="dashboard bg-white">
      <DaskboardSearch isDashBoard />
      <DaskboardContent />
    </div>
  );
};

export default DashboardComponent;
