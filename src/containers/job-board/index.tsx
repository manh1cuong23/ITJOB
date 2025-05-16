import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import DaskboardContentLeft from '../dashboard/component/daskboard-content/DaskboardContentLeft';
import DaskboardSearch from '../dashboard/component/daskboard-search/DaskboardSearch';
import DaskboardContentRight from '../dashboard/component/daskboard-content/DaskboardContentRight';
import { getListJobByCandicateDb } from '@/api/features/job';
import { useLocation } from 'react-router-dom';

const JobBoardContainer: React.FC = () => {
  const [listJob, setListJob] = useState<any>([]);
  const [listRecruiter, setListRecruiter] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [pageTotal, setPageTotal] = useState(1);
  const [limit, setLimit] = useState(10);
  const [activeTab, setActiveTab] = useState('Việc làm');
  const tabs = ['Việc làm', 'Công ty'];
  const location = useLocation();
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState({ job: 0, employer: 0 });
  const formData = location.state?.formData;

  const handleSeach = async (data: any) => {
    setPage(1); // Reset page về 1 khi tìm kiếm mới
    const res = await getListJobByCandicateDb({ ...data, page, limit });
    setPageTotal(res?.result?.pagination?.total_pages);
    if (res && res.result) {
      setListJob(res.result.jobs?.data);
      setListRecruiter(res.result.employers?.data);
      setTotal({
        job: res.result.jobs?.pagination?.total_records,
        employer: res.result.employers?.pagination?.total_records,
      });
    }
  };
  const fetchMoreData = async () => {
    if (page >= pageTotal) return;
    const nextPage = page + 1;
    setPage(nextPage);
    const res = await getListJobByCandicateDb({
      ...formData,
      page: nextPage,
      limit,
    });
    if (res && res.result) {
      const newJobs = res.result.jobs?.data || [];
      const newRecruiters = res.result.employers?.data || [];

      setListJob((prev: any) => [...prev, ...newJobs]);
      setListRecruiter((prev: any) => [...prev, ...newRecruiters]);
    }
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
          total={total}
          totalPage={pageTotal}
          page={page}
          isJob={activeTab == 'Việc làm'}
          listJob={listJob}
          listRecruiter={listRecruiter}
          fetchMoreData={fetchMoreData}
        />
        <DaskboardContentRight />
      </div>
    </div>
  );
};

export default JobBoardContainer;
