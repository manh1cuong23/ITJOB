import { useEffect, useState } from 'react';
import ContentLeftProfile from '../profile/components/ContentLeftProfile';
import CardJobApply from './components/CardJobApply';
import { getListApplyJob } from '@/api/features/candicate';
import { ApplyStatus } from '@/constants/job';
import { getListCandicateByJobWithStatus } from '@/api/features/recruite';
import { NavLink } from 'react-router-dom';

export default function JobApplyContainer() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>([]);
  const [status, setStatus] = useState<any>('');
  const [activeTab, setActiveTab] = useState('applied');
  const [forceUpdate, setForceUpdate] = useState(0);

  const fetchJobApply = async (status: any) => {
    const res = await getListApplyJob(status);
    console.log('check res', res);
    if (res.result) {
      console.log(res.result?.applyJobs);
      setData(res.result?.applyJobs);
    }
  };

  useEffect(() => {
    if (status && status != '') {
      fetchJobApply(status);
    } else {
      fetchJobApply('');
    }
  }, [status, forceUpdate]);
  useEffect(() => {
    fetchJobApply('');
  }, []);

  const tabs = [
    { key: 'applied', label: 'Đã ứng tuyển', status: '' },
    // { key: 'saved', label: 'Đã Lưu', status: '' },
    {
      key: 'interview',
      label: 'Đã được liên hệ phỏng vấn',
      status: [
        ApplyStatus.WaitingCandidateAcceptSchedule,
        ApplyStatus.WaitingEmployerAcceptSchedule,
      ],
    },
    {
      key: 'interview2',
      label: 'Chờ kết quả phỏng vấn',
      status: [ApplyStatus.Interview, ApplyStatus.Passed, ApplyStatus.Failed],
    },
  ];

  return (
    <div className="mt-[20px] mx-auto w-[1260px] flex gap-[20px]">
      <ContentLeftProfile />
      <div className="  w-full ">
        <div className="bg-white p-4">
          <h1 className="text-[22px] font-bold text-[#333] mb-4 w-full">
            Việc làm của tôi
          </h1>
          <div className="flex gap-[16px] items-center">
            {tabs.map(tab => (
              <div
                key={tab.key}
                className="cursor-pointer"
                onClick={() => {
                  setActiveTab(tab.key);
                  setStatus(tab.status);
                }}>
                <h1
                  className={`text-[18px] font-bold py-2 ${
                    activeTab === tab.key
                      ? 'text-primary border-b border-red-500'
                      : 'text-[#626262]'
                  }`}>
                  {tab.label}
                </h1>
              </div>
            ))}
          </div>
        </div>
        <div className="max-h-[600px] overflow-auto mt-2">
          {data &&
            data.length > 0 &&
            data.map((item: any, index: number) => (
              <CardJobApply setForceUpdate={setForceUpdate} data={item} />
            ))}
        </div>
      </div>
    </div>
  );
}
