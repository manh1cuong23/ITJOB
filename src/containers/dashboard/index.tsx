import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import DaskboardSearch from './component/daskboard-search/DaskboardSearch';
import DaskboardContent from './component/daskboard-content/DaskboardContent';

const DashboardComponent: React.FC = () => {
  return (
    <div className="dashboard bg-white">
      <DaskboardSearch />
      <DaskboardContent />
    </div>
  );
};

export default DashboardComponent;
