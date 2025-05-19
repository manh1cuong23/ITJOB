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
import { getListBlog } from '@/api/features/admin';

const DaskboardContent: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [jobs, setJobs] = useState<any>([]);
  const [blogs, setBlogs] = useState<any>([]);
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
  const fetchBlog = async () => {
    const res = await getListBlog({ page: 1, limit: 4 });
    if (res?.result) {
      setBlogs(res?.result);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchJob();
    fetchBlog();
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
          <div className="flex mt-5 flex-wrap">
            {blogs &&
              blogs.length > 0 &&
              blogs?.map((item: any, index: number) => (
                <CardBlog key={index} className=" w-1/2" data={item} />
              ))}
          </div>
        </h1>
      </div>
    </div>
  );
};

export default DaskboardContent;
