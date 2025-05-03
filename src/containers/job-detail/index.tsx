import React, { useEffect, useState } from 'react';
import JobSubDetail from './components/JobSubDetail';
import CardReduceCompany from '@/components/basic/card/CardReduceCompany';
import { getDetailJob, getListJobByCandicate } from '@/api/features/job';
import { useParams } from 'react-router-dom';
import { getListApplyJob } from '@/api/features/candicate';

const JobDetailContainer: React.FC = () => {
  const [dataJob, setDataJob] = useState({});
  const [jobs, setJobs] = useState<any>([]);
  const [dataEmployer, setDataEmployer] = useState({});
  const [isApply, setIsApply] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const { id } = useParams();
  const fetchJobById = async (id: string) => {
    const res = await getDetailJob(id);
    if (res && res.result) {
      setDataJob(res.result);
      console.log('res.resul', res.result);
      setDataEmployer(res.result?.employer_info);
    }
  };
  const fetchJob = async () => {
    const res = await getListJobByCandicate({ page: 1, limit: 3 });
    if (res?.result) {
      setJobs(res?.result?.jobs);
    }
  };
  const fetchCheckIsApply = async () => {
    const res = await getListApplyJob(undefined, id);
    console.log('check res', res);
    if (res?.result && res?.result?.applyJobs?.length > 0) {
      setIsApply(true);
    }
  };
  useEffect(() => {
    fetchJob();
    if (id) {
      fetchJobById(id);
      fetchCheckIsApply();
    }
  }, [id, forceUpdate]);
  return (
    <div className="mx-auto w-[1260px] pt-[20px] flex">
      <JobSubDetail
        data={dataJob}
        listJob={jobs}
        isApply={isApply}
        setForceUpdate={setForceUpdate}
      />
      <div className="w-1/3">
        <CardReduceCompany data={dataEmployer} />
      </div>
    </div>
  );
};

export default JobDetailContainer;
