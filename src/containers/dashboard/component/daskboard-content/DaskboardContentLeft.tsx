import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import { MyCardjob } from '@/components/basic/card';
interface Props {
  listJob: any;
}
const DaskboardContentLeft: React.FC<Props> = ({ listJob }) => {
  console.log('data', listJob);
  return (
    <div className="w-2/3 pb-[500px]">
      <div className="mr-4">
        <div className="text-lg text-primary mb-4">
          {listJob.length}{' '}
          <span className="text-lg font-bold text-black">Việc làm IT</span>{' '}
        </div>
        <div className="h-[1400px] overflow-auto">
          {listJob &&
            listJob.length > 0 &&
            listJob.map((item: any, index: number) => (
              <MyCardjob key={index} data={item} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default DaskboardContentLeft;
