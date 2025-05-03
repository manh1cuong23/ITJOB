import React, { useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { SingleSelectSearchCustom } from '@/components/basic/select';
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Row,
  Space,
} from 'antd';
import {
  CheckOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PoweroffOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { TableBasic } from '@/components/basic/table';
import { InputBasic } from '@/components/business/input';
import DatepickerBasic from '@/components/business/date-picker/DatepickerBasic';
import { MyFormItem } from '@/components/basic/form-item';
import { changeStatus, getListJob } from '@/api/features/recruite';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import {
  JobStatus,
  JobStatusOptions,
  jobStatusOptions,
  statusAccounts,
  userTypeOptions,
} from '@/constants/job';
import { DatePickerFromTo } from '@/components/business/date-picker';
import { create } from 'lodash';
import { formatDateToYMD } from '@/utils/formatDate';
import JobCruModal from '@/components/business/modal/job-cru';
import ConfirmModal from '@/components/business/modal/ConfirmModal/BookInterviewModal';
import {
  getListEnvalutions,
  getListUser,
  makeActiveAccount,
  makeActiveEnvalution,
  makeInActiveAccount,
} from '@/api/features/admin';
import { getLableSingle } from '@/utils/helper';
import EnvalutionContent from '@/containers/Recruiter/components/EnvalutionContent';

const getStatusStyles = (status: number) => {
  switch (status) {
    case 0: // Đang chờ duyệt
      return 'text-yellow-500 ';
    case 1: // Đang tuyển
      return 'text-green-500 ';
    case 2: // Dừng tuyển
      return 'text-red-500 ';
    default:
      return 'text-gray-500 ';
  }
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
    status: 'Hết hạn',
    applicants: 25,
  },
  {
    key: '3',
    code: 'DEV003',
    service: 'Tester',
    createdAt: '2025-03-30',
    status: 'Đang tuyển',
    applicants: 10,
  },
  {
    key: '4',
    code: 'DEV004',
    service: 'Quản lý dự án',
    createdAt: '2025-03-25',
    status: 'Đóng',
    applicants: 5,
  },
];

const AdminEnvalutionContainer: React.FC = () => {
  const [data, setData] = useState([]);
  const [idSelect, setIdSelect] = useState('');
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [resume, setResumne] = useState(false);
  const [stop, setStop] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [idSelected, setIdSelected] = useState('');
  const [forceUpdate, setForceUpdate] = useState(1);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const switchEditmod = () => {
    setIsViewMode(false);
  };

  const columns: any = [
    {
      title: 'Tên tài khoản đánh giá',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (_: any, record: any) => {
        return record?.candidate_info?.name;
      },
    },
    {
      title: 'Tên công ty được đánh giá',
      width: 150,
      dataIndex: 'employer_info',
      key: 'employer_info',
      render: (_: any, record: any) => {
        return record?.employer_info?.name;
      },
    },
    {
      title: 'Nội dung',
      dataIndex: 'role',
      key: 'role',
      width: 600,
      className: 'overflow-auto ',
      render: (role: any, record: any) => (
        <EnvalutionContent
          isInAdmin
          title={record?.title}
          isKK={record?.isEncouragedToWorkHere}
          content={record?.content}
          created={record?.createdAt}
          rate={record?.rate}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (active: any) => (
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${'bg-red-500'}`} />
          <span className={'text-red-500 font-medium'}>Đang chờ duyệt</span>
        </div>
      ),
    },
  ];
  const fetchListUser = async (data: any) => {
    const res = await getListEnvalutions(data);
    console.log('check', res);
    if (res && res.result) {
      setData(res.result);
    }
  };
  const handleSearch = async () => {
    const data = await form.validateFields();
    console.log('dataa form', data);
    fetchListUser(data);
  };

  useEffect(() => {
    fetchListUser([]);
  }, [forceUpdate]);

  console.log(idSelected);
  const handleResume = async () => {
    const res = await makeActiveAccount(idSelected);
    if (res?.message) {
      message.success('Bạn đã đổi trạng thái của tài khoản thành công!');
      fetchListUser([]);
      setResumne(false);
    }
  };

  const handleStop = async () => {
    const res = await makeInActiveAccount(idSelected);
    if (res?.message) {
      fetchListUser([]);
      message.success('Bạn đã duyệt tin đánh giá!');
      setStop(false);
    }
  };

  const handleChangeStatus = async () => {
    const res = await makeActiveEnvalution(idSelected);
    if (res?.message) {
      fetchListUser([]);
      message.success('Bạn đã đổi trạng thái của tài khoản thành công!');
      setResumne(false);
    }
  };

  const columnAdd = [
    ...columns,
    {
      title: 'Hành động',
      dataIndex: 'service',
      key: 'service',
      width: 160,
      align: 'center',
      render: (_: any, record: any) => {
        const items = [
          {
            key: 'see',
            icon: <CheckOutlined className="text-green-500" />,
            label: 'Duyệt đánh giá',
            className: 'min-w-[180px] py-1 my-1 hover:!bg-green-100 left-[0]', // Tăng chiều rộng
          },
          // {
          //   key: 'stop',
          //   icon: <PoweroffOutlined className="text-red-500" />,
          //   label: 'Bỏ duyệt tin tuyển dụng',
          //   className: 'min-w-[180px] py-1 my-1 hover:!bg-red-100 left-[0]', // Tăng chiều rộng
          // },
        ];

        const handleMenuClick = ({ key }: any) => {
          if (key === 'see') {
            setIdSelect(record?._id);
            setIdSelected(record?._id);
            setResumne(true);
          }
          // Xử lý các mục khác nếu cần, ví dụ:
          if (key === 'stop') {
            setIdSelect(record?._id);
            setIdSelected(record?._id);
            console.log('Xử lý bỏ duyệt');
          }
        };
        return (
          <>
            <style>
              {`
                  .ant-dropdown-menu-item:hover {
                    background-color: #f0f0f0; // Màu nền khi hover
                    transition: background-color 0.3s ease; // Hiệu ứng mượt
                  }
                `}
            </style>
            <Dropdown menu={{ items, onClick: handleMenuClick }}>
              <a onClick={e => e.preventDefault()}>
                <Space>
                  Thao tác
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="mx-[20px] p-6 bg-white  h-[500px] mt-[20px]">
        <div className="w-full">
          <Form form={form}>
            <Row gutter={16}>
              <Col
                xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
              >
                <InputBasic
                  isSpan
                  label="Tên tài khoản đánh giá"
                  name="nameCandicate"
                  placeholder="Nhập email hoặc tên tài khoản"
                />
              </Col>
              <Col
                xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
              >
                <InputBasic
                  isSpan
                  label="Tên công ty"
                  name="nameEmployer"
                  placeholder="Nhập email hoặc tên tài khoản"
                />
              </Col>
            </Row>
            <div className="flex gap-[16px]  items-center justify-end bg-white w-full">
              <Button
                className="!bg-blue-500 text-white h-[40px] rounded-lg px-4"
                onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </div>
          </Form>
        </div>
        <div className="bg-white mt-[20px] w-full h-[800px]">
          <TableBasic
            dataSource={data}
            columns={columnAdd}
            isPaginationClient
          />
        </div>
      </div>

      <ConfirmModal
        title={`Xác nhận duyệt đánh giá này`}
        open={resume}
        onFinish={handleChangeStatus}
        onCancel={() => {
          setResumne(false);
        }}>
        <h1>
          Bạn xác nhận duyệt đánh giá này ? Đánh giá sẽ được hiển thị tại trang
          của công ty.
        </h1>
      </ConfirmModal>
      <ConfirmModal
        title={`Xác nhận dừng hoạt động`}
        open={stop}
        onFinish={handleStop}
        onCancel={() => {
          setStop(false);
        }}>
        <h1>Bạn xác nhận tắt hoạt động của tài khoản này</h1>
      </ConfirmModal>
    </div>
  );
};

export default AdminEnvalutionContainer;
