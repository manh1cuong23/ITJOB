import { TableBasic } from '@/components/basic/table';
import React, { useEffect, useState } from 'react';
import BackgroundCandidate from './components/BackgroundCandidate';
import { Button, Select, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { NavLink, useParams } from 'react-router-dom';
import { getListCandicateByJob } from '@/api/features/recruite';
import { MyButton } from '@/components/basic/button';
import {
  convertDateString,
  formatDateToISO,
  formatDateToYMD,
} from '@/utils/formatDate';
import { applyStatusOptions, interviewsStatus } from '@/constants/job';
import InterviewInfo from './components/InterviewInfo';
import { Option } from '@/components/basic/select/SingleSelectSearchCustom';
import { InputBasic } from '@/components/business/input';

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
const dataSource = [
  {
    key: '1',
    code: 'DEV001',
    service: 'Lập trình viên Frontend',
    createdAt: '2025-04-01',
    status: 'Đang tuyển',
    applicants: 15,
  },
  {
    key: '2',
    code: 'DEV002',
    service: 'Lập trình viên Backend',
    createdAt: '2025-03-28',
    status: 'Đã liên hệ',
    applicants: 25,
  },
  {
    key: '3',
    code: 'DEV003',
    service: 'Tester',
    createdAt: '2025-03-30',
    status: 'Chưa xem',
    applicants: 10,
  },
  {
    key: '4',
    code: 'DEV004',
    service: 'Quản lý dự án',
    createdAt: '2025-03-25',
    status: 'Từ chôi',
    applicants: 5,
  },
];
const JobResultContainer: React.FC = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState<string[]>([]);

  const [selected, setSelected] = useState('all');

  const filters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'unread', label: 'CV phù hợp' },
    { key: 'interview', label: 'CV đã hẹn phỏng vấn' },
    { key: 'skipped', label: 'CV đã bỏ qua' },
  ];

  const { id } = useParams();
  const fetchListCandicates = async (id: string) => {
    const res = await getListCandicateByJob(id);
    if (res && res.result) {
      setData(res.result);
      setStatus(res.result.map((item: any) => item.status));
      // setStatus()
    }
  };

  const handleStatusChange = (value: string, index: number) => {
    const updatedStatus = [...status];
    updatedStatus[index] = value;
    setStatus(updatedStatus);
  };

  useEffect(() => {
    if (id) {
      fetchListCandicates(id);
    }
  }, []);

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

      render: (createdAt: any) => createdAt && formatDateToYMD(createdAt),
    },
    {
      title: 'CV',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
    },
    selected == 'interview' && {
      title: 'Thông tin phỏng vấn',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (_: any, record: any) => <InterviewInfo />,
    },
    false && {
      title: 'Trạng thái ứng viên',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (_: any, record: any) => {
        const currentValue = record.status;
        const color = statusColorMap[currentValue];
        const label = getLabelByValue(interviewsStatus, currentValue);

        return (
          <Tag
            style={{
              color: color,
              backgroundColor: `${color}20`, // tạo background nhạt
              borderColor: color,
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: '8px',
            }}>
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 160,
      render: (_: any, record: any) => {
        const currentValue = record.status;
        const color = statusColorMap[currentValue];
        const label = getLabelByValue(applyStatusOptions, currentValue);

        return (
          <Tag
            style={{
              color: color,
              backgroundColor: `${color}20`, // tạo background nhạt
              borderColor: color,
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: '8px',
            }}>
            {label}
          </Tag>
        );
      },
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
          <NavLink to={`/recruiter/cv/${record?._id}/detail`}>
            <EyeOutlined className="text-blue-500 text-[16px] cursor-pointer p-1 rounded-md hover:bg-gray-200" />
          </NavLink>
          <DeleteOutlined className="text-red-500 cursor-pointer p-1 rounded-md hover:bg-gray-200" />
        </div>
      ),
    },
  ].filter(Boolean);

  return (
    <div className="my-[20px] mx-[40px] ">
      <div className="flex items-center gap-[20px]">
        <div className="h-[80px] w-1/4 bg-white flex justify-center flex-col p-2">
          <h1>Tổng lượng CV ứng tuyển</h1>
          <h1 className="text-[18px] mt-2">{data && data.length}</h1>
        </div>
        <div className="h-[80px] w-1/4 bg-white flex justify-center flex-col p-2 text-blue-500">
          <h1>CV Chưa xem</h1>
          <h1 className="text-[18px] mt-2">10</h1>
        </div>
        <div className="h-[80px] w-1/4 bg-white flex justify-center flex-col p-2 text-yellow-500">
          <h1>CV đã liên hệ</h1>
          <h1 className="text-[18px] mt-2">10</h1>
        </div>
        <div className="h-[80px] w-1/4 bg-white flex justify-center flex-col p-2 text-red-500">
          <h1 className="">CV đã từ chối</h1>
          <h1 className="text-[18px] mt-2">10</h1>
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
                onClick={() => setSelected(item.key)}>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <InputBasic
            label=""
            name="name"
            placeholder="Nhập để tìm cv theo tên.."
          />
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
