import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import { MyCardjob } from '@/components/basic/card';

const DaskboardContentLeft: React.FC = () => {
  return (
    <div className="w-2/3">
      <div className="text-lg text-primary">
        910 <span className="text-lg font-bold text-black">Việc làm IT</span>{' '}
      </div>
      <MyCardjob />
      <MyCardjob />
      <MyCardjob />
      <MyCardjob />
      <MyCardjob />
    </div>
  );
};

export default DaskboardContentLeft;
