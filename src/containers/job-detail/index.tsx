import React, { useEffect, useState } from 'react';
import JobSubDetail from './components/JobSubDetail';
import CardReduceCompany from '@/components/basic/card/CardReduceCompany';
import { getDetailJob } from '@/api/features/job';
import { useParams } from 'react-router-dom';

const JobDetailContainer: React.FC = () => {
  const [dataJob, setDataJob] = useState({});
  const { id } = useParams();
  const fetchJobById = async (id: string) => {
    const res = await getDetailJob(id);
    if (res && res.result) {
      setDataJob(res.result);
    }
  };
  useEffect(() => {
    if (id) {
      fetchJobById(id);
    }
  }, [id]);
  return (
    <div className="mx-auto w-[1260px] pt-[20px] flex">
      <JobSubDetail data={dataJob} />
      <div className="w-1/3">
        <CardReduceCompany />
      </div>
    </div>
  );
};

export default JobDetailContainer;
