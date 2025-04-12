import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import MyCardjobCompany from '@/components/basic/card/CardJobCompany';
import CardSection from '@/components/basic/card/CardSection';

const DaskboardContentRight: React.FC = () => {
  return (
    <div className="w-1/3">
      <div className="ml-4">
        <h1 className="text-lg font-bold text-black">Tiêu điểm</h1>
        <div className="h-[1400px]">
          <MyCardjobCompany />
          <CardSection />
        </div>
      </div>
    </div>
  );
};

export default DaskboardContentRight;
