import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import { MyCardjob } from '@/components/basic/card';
import MyCardRecruiter from '@/components/basic/card/CardJobRecruiter';
interface Props {
  listJob: any;
  isJob?: boolean;
  listRecruiter?: any;
}
const DaskboardContentLeft: React.FC<Props> = ({
  listJob,
  isJob = true,
  listRecruiter,
}) => {
  return (
    <div className="w-2/3">
      <div className="mr-4">
        <div className="text-lg text-primary mb-4">
          {isJob ? listJob.length : listRecruiter?.length}
          <span className="text-lg font-bold text-black">
            {isJob ? ' Việc làm' : ' Công ty'}
          </span>
        </div>
        <div className="max-h-[1400px] overflow-auto">
          {isJob
            ? listJob &&
              listJob.length > 0 &&
              listJob.map((item: any, index: number) => (
                <MyCardjob key={index} data={item} />
              ))
            : listRecruiter &&
              listRecruiter.length > 0 &&
              listRecruiter.map((item: any, index: number) => (
                <MyCardRecruiter key={index} data={item} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default DaskboardContentLeft;
