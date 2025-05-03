import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import DaskboardContentLeft from '../dashboard/component/daskboard-content/DaskboardContentLeft';
import DaskboardSearch from '../dashboard/component/daskboard-search/DaskboardSearch';
import DaskboardContentRight from '../dashboard/component/daskboard-content/DaskboardContentRight';
import { getListJobByCandicate } from '@/api/features/job';
import { useLocation } from 'react-router-dom';

const JobBoardContainer: React.FC = () => {
  const [listJob, setListJob] = useState([]);
  const [listRecruiter, setListRecruiter] = useState([]);
  const [activeTab, setActiveTab] = useState('Việc làm');
  const tabs = ['Việc làm', 'Công ty'];
  const location = useLocation();
  const formData = location.state?.formData;

  const handleSeach = async (data: any) => {
    const res = await getListJobByCandicate(data);
    if (res && res.result) {
      setListJob(res.result.jobs);
      setListRecruiter(res.result.employers);
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
      <div className="h-[50px] mx-auto w-[1260px] mt-1">
        <div className="flex items-center">
          {tabs.map(tab => (
            <span
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer py-4 px-6 text-[18px] hover:text-[#dd3f24] ${
                activeTab === tab
                  ? 'border-b-2 border-[#dd3f24] text-[#dd3f24] font-medium'
                  : ' text-black'
              }`}>
              {tab}
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto w-[1260px] pt-[20px] flex ">
        <DaskboardContentLeft
          isJob={activeTab == 'Việc làm'}
          listJob={listJob}
          listRecruiter={listRecruiter}
        />
        <DaskboardContentRight />
      </div>
    </div>
  );
};

export default JobBoardContainer;
