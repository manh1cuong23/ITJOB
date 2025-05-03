import { useEffect, useState } from 'react';
import ContentLeftProfile from '../profile/components/ContentLeftProfile';
import CardJobApply from './components/CardJobApply';
import { getListInvitedJob } from '@/api/features/candicate';
import { ApplyStatus } from '@/constants/job';
import { NavLink } from 'react-router-dom';

export default function JobInviteContainer() {
  const [open, setOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [data, setData] = useState<any>([]);
  const [status, setStatus] = useState<any>(
    ApplyStatus.WaitingCandidateAcceptInvite
  );
  const [activeTab, setActiveTab] = useState('applied');

  const fetchDataJob = async (status: any) => {
    const res = await getListInvitedJob(status);
    if (res?.result) {
      setData(res?.result?.applyJobs);
    }
    console.log('check res', res);
  };
  useEffect(() => {
    fetchDataJob(ApplyStatus.WaitingCandidateAcceptInvite);
  }, [forceUpdate]);

  const tabs = [
    {
      key: 'applied',
      label: 'Đang chờ',
      status: ApplyStatus.WaitingCandidateAcceptInvite,
    },
    {
      key: 'saved',
      label: 'Đã xác nhận',
      status: ApplyStatus.CandidateAcceptInvite,
    },
    {
      key: 'interview',
      label: 'Đã từ chối',
      status: [
        ApplyStatus.WaitingCandidateAcceptSchedule,
        ApplyStatus.WaitingEmployerAcceptSchedule,
      ],
    },
  ];

  useEffect(() => {
    fetchDataJob(status);
  }, [status]);

  return (
    <div className="mt-[20px] mx-auto w-[1260px] flex gap-[20px]">
      <ContentLeftProfile />
      <div className="  w-full">
        <div className="bg-white p-4">
          <h1 className="text-[22px] font-bold text-[#333] mb-1  w-full">
            Lời mời công việc
          </h1>
          <h1 className="text-[18px] font-medium mb-4">
            JobHub cung cấp dịch vụ kết nối ứng viên ẩn danh với các cơ hội việc
            làm phù hợp.
          </h1>
          <div className="flex gap-[16px] itens-center">
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
        </div>
        {data &&
          data?.length > 0 &&
          data?.map((item: any, index: number) => (
            <NavLink to={`/${item?.job_id}/job-detail`}>
              <CardJobApply
                setForceUpdate={setForceUpdate}
                key={index}
                data={item}
              />
            </NavLink>
          ))}
      </div>
    </div>
  );
}
