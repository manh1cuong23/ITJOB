import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import MyCardjobCompany from '@/components/basic/card/CardJobCompany';
import CardSection from '@/components/basic/card/CardSection';
import { getListEmployer } from '@/api/features/chat';

const DaskboardContentRight: React.FC = () => {
  const [data, setData] = useState<any>([]);

  const fetchCompany = async () => {
    const res = await getListEmployer({ page: 1, limit: 2 });
    if (res?.result) {
      setData(res?.result);
    }
  };
  useEffect(() => {
    fetchCompany();
  }, []);
  return (
    <div className="w-1/3">
      <div className="ml-4">
        <h1 className="text-lg font-bold text-black">Tiêu điểm</h1>
        <div className="h-[1400px]">
          {data?.length > 0 &&
            data?.map((item: any, index: number) => (
              <MyCardjobCompany key={index} data={item} />
            ))}

          {/* <CardSection /> */}
        </div>
      </div>
    </div>
  );
};

export default DaskboardContentRight;
