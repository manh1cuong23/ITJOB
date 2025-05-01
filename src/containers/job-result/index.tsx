import { TableBasic } from '@/components/basic/table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BackgroundCandidate from './components/BackgroundCandidate';
import { debounce } from 'lodash';
import { Button, Select, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { NavLink, useParams } from 'react-router-dom';
import {
  getListCandicateByJob,
  getListCandicateByJobWithStatus,
  getListCountCandicateByJob,
} from '@/api/features/recruite';
import { formatDateNew } from '@/utils/formatDate';
import {
  ApplyStatus,
  applyStatusOptions,
  interviewsStatus,
} from '@/constants/job';
import InterviewInfo from './components/InterviewInfo';
import { Option } from '@/components/basic/select/SingleSelectSearchCustom';
import StatusTag from './components/StatusCV';
import { getCountByStatus } from '@/utils/helper';

const statusColorMap: Record<number, string> = {
  0: '#888', // Chưa xem
  1: '#1677ff', // Đã xem
  2: '#722ed1', // Phỏng vấn
  3: '#ff4d4f', // Từ chối
  4: '#fa8c16', // Đã hủy
  5: '#52c41a', // Đã Đạt
  6: '#d4380d', // Không đạt
};

const getLabelByValue = (applyStatusOptions: Option[], value: number) => {
  const found = applyStatusOptions.find(option => option.value === value);
  return found?.label || 'Không rõ';
};

const JobResultContainer: React.FC = () => {
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState([]);
  const [status, setStatus] = useState<any>('');
  const [forceUpdate, setForceUpdate] = useState(0);

  const [selected, setSelected] = useState('all');

  const filters = [
    { key: 'all', label: 'Tất cả', status: '' },
    { key: 'matched', label: 'CV phù hợp', status: ApplyStatus.Approved }, // từ 'unread' → 'matched'
    {
      key: 'interview',
      label: 'CV đã hẹn phỏng vấn',
      status: [
        ApplyStatus.Interview,
        ApplyStatus.WaitingCandidateAcceptSchedule,
        ApplyStatus.WaitingEmployerAcceptSchedule,
      ],
    },
    { key: 'passs', label: 'CV đã trúng tuyển', status: ApplyStatus.Passed },
    { key: 'skipped', label: 'CV đã bỏ qua', status: ApplyStatus.Rejected },
  ];

  const { id } = useParams();
  const fetchListCandicates = async (id: string, params: any = '') => {
    const res = await getListCandicateByJob(id, params);
    if (res && res.result) {
      const datam = res.result.map((item: any) => item.candidate_info);
      setData(res.result);
    }
  };
  const fetchListCountCandicates = async (id: string) => {
    const res = await getListCountCandicateByJob(id);
    console.log('check res', res);

    if (res && res.result) {
      setDataCount(res.result);
    }
  };

  const fetListCVWithStatus = async (id: string, status: number) => {
    const res = await getListCandicateByJobWithStatus(id, status);
    if (res?.result) {
      setData(res.result);
    }
  };

  useEffect(() => {
    if (id) {
      fetchListCountCandicates(id);
      if (status && status != '') {
        fetListCVWithStatus(id, status);
      } else {
        fetchListCandicates(id);
      }
    }
  }, [status, forceUpdate]);

  const handleSearch = (value: string) => {
    if (id) {
      fetchListCandicates(id, { name: value });
    }
  };

  const debouncedSearch = useMemo(() => debounce(handleSearch, 300), [id]);

  const handleOnChangeSearch = (e: any) => {
    debouncedSearch(e.target.value);
  };

  const columns: any = [
    {
      title: 'Ứng viên',
      dataIndex: 'service',
      key: 'service',
      width: 500,
      fixed: 'left',
      render: (_: any, record: any) => {
        return <BackgroundCandidate data={record} />;
      },
    },
    {
      title: 'Ngày nộp CV',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: any) => {
        console.log('check ', createdAt);
        return createdAt && formatDateNew(createdAt);
      },
    },
    {
      title: 'CV',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
    },
    selected == 'interview' && {
      title: 'Thông tin phỏng vấn',
      dataIndex: 'interview_employee_suggest_schedule',
      key: 'interview_employee_suggest_schedule',
      width: 200,
      render: (_: any, record: any) => <InterviewInfo data={_} />,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 160,
      render: (_: any, record: any) => (
        <StatusTag
          setForceUpdate={setForceUpdate}
          name={record?.candidate_info?.name}
          id={record?._id}
          dataSuggest={record?.interview_candidate_suggest_schedule}
          value={record.status}
          statusColorMap={statusColorMap}
          statusOptions={applyStatusOptions}
        />
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'service',
      key: 'service',
      fixed: 'right',
      width: 80,
      align: 'center',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-[4px] justify-center">
          <NavLink
            to={`/recruiter/cv/${record?.candidate_account?.user_id}/detail/${record?._id}`}>
            <EyeOutlined className="text-blue-500 text-[16px] cursor-pointer p-1 rounded-md hover:bg-gray-200" />
          </NavLink>
          <DeleteOutlined className="text-red-500 cursor-pointer p-1 rounded-md hover:bg-gray-200" />
        </div>
      ),
    },
  ].filter(Boolean);
  console.log('Check dataCount', dataCount);
  return (
    <div className="my-[20px] mx-[40px] ">
      <div className="flex items-center gap-[20px]">
        <div className="h-[80px] w-1/4 bg-white flex justify-center flex-col p-2">
          <h1>Tổng lượng CV ứng tuyển</h1>
          <h1 className="text-[18px] mt-2">
            {data?.length ? data?.length : 0}
          </h1>
        </div>
        <div className="h-[80px] w-1/4 bg-white flex justify-center flex-col p-2 text-[#52c41a]">
          <h1>CV trúng tuyển</h1>
          <h1 className="text-[18px] mt-2">
            {getCountByStatus(dataCount, ApplyStatus.Passed)}
          </h1>
        </div>
        <div className="h-[80px] w-1/4 bg-white flex justify-center flex-col p-2 text-[#722ed1]">
          <h1>CV đã hẹn phỏng vấn</h1>
          <h1 className="text-[18px] mt-2">
            {getCountByStatus(dataCount, ApplyStatus.Interview) +
              getCountByStatus(
                dataCount,
                ApplyStatus.WaitingCandidateAcceptSchedule
              ) +
              getCountByStatus(
                dataCount,
                ApplyStatus.WaitingEmployerAcceptSchedule
              )}
          </h1>
        </div>
        <div className="h-[80px] w-1/4 bg-white flex justify-center flex-col p-2 text-blue-500">
          <h1 className="">CV phù hợp</h1>
          <h1 className="text-[18px] mt-2">
            {getCountByStatus(dataCount, ApplyStatus.Approved)}
          </h1>
        </div>{' '}
      </div>

      <div className="mt-[20px] bg-white  px-[20px] ">
        <div className="flex items-center gap-[16px] py-[20px]">
          <div className="flex gap-2">
            {filters.map(item => (
              <div
                key={item.key}
                className={`cursor-pointer rounded-full h-[44px] min-w-[120px] flex items-center justify-center p-4
            ${
              selected === item.key
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 hover:bg-gray-400 text-black'
            }`}
                onClick={() => {
                  setSelected(item.key);
                  setStatus(item.status);
                }}>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="h-[40px] border rounded-xl py-2 px-4 w-[300px]">
            <input
              onChange={handleOnChangeSearch}
              className="h-full w-full outline-none"
              placeholder="Nhập tìm kiếm theo tên ứng viên"
            />
          </div>
        </div>
        <div></div>
        <div className="">
          <div className=" w-full h-[800px]">
            <TableBasic
              dataSource={data}
              columns={columns}
              isPaginationClient
              scroll={{ x: 'max-content' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobResultContainer;
