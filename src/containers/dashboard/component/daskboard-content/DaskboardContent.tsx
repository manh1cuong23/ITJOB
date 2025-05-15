import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker, Carousel } from 'antd';
import DaskboardContentLeft from './DaskboardContentLeft';
import DaskboardContentRight from './DaskboardContentRight';
import MyCardjobCompany from '@/components/basic/card/CardJobCompany';
import MyCardjobBasic from '@/components/basic/card/CardjobBasic';
import JobCarousel from './JobCaurel';
import CardBlog from '@/components/basic/card/CardBlog';
import { getListEmployer } from '@/api/features/chat';
import { getListJobByCandicate } from '@/api/features/job';
import MyCardjobDb from '@/components/basic/card/CardJobDbcopy';

const data2 = {
  img: 'https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOW5tV2c9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--87dd2337b87d990fa0f37a62de789ab0051bbb45/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcEFwSUNNQT09IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--d4dc962f8dfd42219a41803be77916f56a123c1e/elasticsearch-query-la-gi-vippro-scaled.jpg',
  description: 'Bạn cần một giải pháp tìm kiếm dữ liệu siêu tốc',
};
const DaskboardContent: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [jobs, setJobs] = useState<any>([]);
  const fetchCompany = async () => {
    const res = await getListEmployer({ page: 1, limit: 6 });
    if (res?.result) {
      setData(res?.result);
    }
  };
  const fetchJob = async () => {
    const res = await getListJobByCandicate({ page: 1, limit: 10 });
    if (res?.result) {
      setJobs(res?.result?.jobs);
    }
  };
  useEffect(() => {
    fetchCompany();
    fetchJob();
  }, []);
  return (
    <div className="mx-auto w-[1260px] pt-[20px]  bg-white ">
      <div>
        <h1 className="text-[28px] text-center font-bold text-black mt-4">
          Các công ty nổi bật
        </h1>
        <JobCarousel jobs={data} />
      </div>

      <h1 className="text-[28px] text-center font-bold text-black mt-4">
        Việc làm nổi bật
      </h1>
      <div className="flex  flex-wrap">
        {jobs?.map((item: any) => (
          <div className="p-2 w-1/3">
            <MyCardjobDb className=" border" data={item} />
          </div>
        ))}
      </div>
      <div>
        <h1 className="text-[28px] font-bold text-black my-4">
          Bài viết nổi bật
          <div className="flex mt-4">
            <div className="w-1/2 ">
              <CardBlog className="h-[530px]" data={data} />
            </div>
            <div className="w-1/2 px-4">
              <div className="flex gap-[4px]">
                <CardBlog className="h-[280px]" data={data2} />
                <CardBlog className="h-[280px]" data={data2} />
              </div>
              <div className="flex gap-[4px] mt-2">
                <CardBlog className="h-[280px]" data={data2} />
                <CardBlog className="h-[280px]" data={data2} />
              </div>
            </div>
          </div>
        </h1>
      </div>
    </div>
  );
};

export default DaskboardContent;
