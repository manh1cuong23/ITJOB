import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import DaskboardContentLeft from '../dashboard/component/daskboard-content/DaskboardContentLeft';
import DaskboardSearch from '../dashboard/component/daskboard-search/DaskboardSearch';
import DaskboardContentRight from '../dashboard/component/daskboard-content/DaskboardContentRight';
import { getListJobByCandicate } from '@/api/features/job';
import { useLocation } from 'react-router-dom';

const JobBoardContainer: React.FC = () => {
  const [listJob, setListJob] = useState([]);
  const location = useLocation();
  const formData = location.state?.formData;

  const handleSeach = async (data: any) => {
    const res = await getListJobByCandicate(data);
    if (res && res.result) {
      setListJob(res.result.jobs);
    }
    console.log('res', res);
  };
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      handleSeach(formData);
    } else {
      handleSeach([]);
    }
  }, [formData]);
  return (
    <div className="dashboard bg-white">
      <DaskboardSearch handleSeach={handleSeach} />
      <div className=" h-[50px] mx-auto w-[1260px] mt-1  ">
        <div className="flex items-center">
          <span className="cursor-pointer border-b border-black py-4 px-6 text-[18px] hover:text-[#dd3f24]">
            Tất cả
          </span>
          <span className="cursor-pointer border-b border-black py-4 px-6 text-[18px] hover:text-[#dd3f24]">
            Việc làm
          </span>
          <span className="cursor-pointer border-b border-black py-4 px-6 text-[18px] hover:text-[#dd3f24]">
            Công ty
          </span>
        </div>
      </div>
      <div className="mx-auto w-[1260px] pt-[20px] flex ">
        <DaskboardContentLeft listJob={listJob} />
        <DaskboardContentRight />
      </div>
    </div>
  );
};

export default JobBoardContainer;
