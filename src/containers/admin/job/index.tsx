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
import { changeStatus } from '@/api/features/recruite';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { JobStatus, JobStatusOptions, jobStatusOptions } from '@/constants/job';
import { DatePickerFromTo } from '@/components/business/date-picker';
import { create } from 'lodash';
import { formatDateToYMD } from '@/utils/formatDate';
import JobCruModal from '@/components/business/modal/job-cru';
import ConfirmModal from '@/components/business/modal/ConfirmModal/BookInterviewModal';
import { getListJob } from '@/api/features/admin';

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

const AdminJobsContainer: React.FC = () => {
  const [data, setData] = useState([]);
  const [idSelect, setIdSelect] = useState('');
  const [isStop, setIsStop] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [resume, setResumne] = useState(false);
  const [accept, setAccept] = useState(false);
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
      title: 'Vị trí',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: any) => createdAt && formatDateToYMD(createdAt),
    },
    {
      title: 'Hạn Nộp',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline: any) => deadline && formatDateToYMD(deadline),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: number, recod: any) => {
        const statusLabel =
          jobStatusOptions.find(item => item.value === status)?.label ||
          'Không xác định';
        return (
          <div className="flex justify-between items-center">
            <span
              className={`inline-block py-1  rounded-full  font-medium  ${getStatusStyles(
                status
              )}`}>
              {statusLabel}
            </span>
            {status == JobStatus.Recuriting && (
              <span
                onClick={e => {
                  e.stopPropagation();
                  setIdSelect(recod._id);
                  setStop(true);
                }}
                className="text-primary hover:underline cursor-pointer">
                Tạm dừng
              </span>
            )}
            {status == JobStatus.Stopped && (
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  setIdSelect(recod._id);
                  setResumne(true);
                }}>
                Tiếp tục
              </span>
            )}
            {status == JobStatus.Created && (
              <span
                className="text-green-500 hover:underline cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  setIdSelect(recod._id);
                  setAccept(true);
                }}>
                Duyệt tin
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Số lượng tuyển dụng',
      dataIndex: 'num_of_employees',
      key: 'num_of_employees',
    },
  ];
  const fetchListJob = async (data: any) => {
    const res = await getListJob(data);
    if (res && res.result) {
      setData(res.result.jobs);
    }
  };

  const handleSearch = async () => {
    const data = await form.validateFields();
    fetchListJob(data);
  };

  useEffect(() => {
    fetchListJob([]);
  }, [forceUpdate]);

  const handleResume = async () => {
    const res = await changeStatus(idSelect, { status: JobStatus.Recuriting });
    if (res?.message) {
      message.success('Tin tuyển dụng đã được yêu cầu tiếp tục tuyển dụng');
      fetchListJob([]);
      setResumne(false);
    }
  };
  const handleAccept = async () => {
    if (!isStop) {
      const res = await changeStatus(idSelect, {
        status: JobStatus.Recuriting,
      });
      if (res?.message) {
        message.success('Tin tuyển dụng đã được duyệt thành công');
        fetchListJob([]);
        setAccept(false);
      }
    } else {
      const res = await changeStatus(idSelect, { status: JobStatus.Created });
      if (res?.message) {
        message.success('Tin tuyển dụng đã được bỏ duyệt thành công');
        fetchListJob([]);
        setAccept(false);
        setIsStop(false);
      }
    }
  };

  const handleStop = async () => {
    const res = await changeStatus(idSelect, { status: JobStatus.Stopped });
    if (res?.message) {
      fetchListJob([]);
      message.success('Tin tuyển dụng đã được yêu cầu dừng tuyển dụng');
      setStop(false);
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
            icon: <EyeOutlined className="text-red-500" />,
            label: 'Xem tin tuyển dụng',
            className: 'min-w-[180px] py-1 my-1 hover:!bg-red-100 left-[0]', // Tăng chiều rộng
          },
          {
            key: 'stop',
            icon: <PoweroffOutlined className="text-red-500" />,
            label: 'Bỏ duyệt tin tuyển dụng',
            className: 'min-w-[180px] py-1 my-1 hover:!bg-red-100 left-[0]', // Tăng chiều rộng
          },
        ];

        const handleMenuClick = ({ key }: any) => {
          if (key === 'see') {
            setIdSelect(record?._id);
            console.log('vao day');
            setIdSelected(record?._id);
            setIsViewMode(true);
            setOpenEdit(true);
          }
          // Xử lý các mục khác nếu cần, ví dụ:
          if (key === 'stop') {
            setIdSelect(record?._id);
            setIdSelected(record?._id);
            console.log('Xử lý bỏ duyệt');
            setIsStop(true);
            setAccept(true);
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
                <InputBasic isSpan label="Vị trí" name="key" />
              </Col>
              <Col span={12}>
                <MyFormItem
                  name="status"
                  label="Trạng thái"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}>
                  <SingleSelectSearchCustom
                    className="change-field"
                    options={[...JobStatusOptions, { label: 'All', value: '' }]}
                  />
                </MyFormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <DatePickerFromTo
                  labelFromDate="Hạn nộp từ"
                  labelToDate="đến"
                  name="deadline"
                  notInitValue
                />
              </Col>
              <Col
                xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
              >
                <DatePickerFromTo
                  labelFromDate="Ngày tạo từ"
                  labelToDate="đến"
                  label="Ngày tạo"
                  name="createdAt"
                  notInitValue
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
      <JobCruModal
        isInAdmin
        title={`${
          isViewMode ? 'Xem  tin tuyển dụng' : 'Chỉnh sửa tin tuyển dụng'
        }`}
        isViewMode={isViewMode}
        id={idSelected}
        switchEditmode={switchEditmod}
        open={openEdit}
        setOpen={setOpenEdit}
        setForceUpdate={setForceUpdate}
        onFinish={() => {
          setOpenEdit(false);
        }}
        onCancel={() => {
          setOpenEdit(false);
        }}
      />
      <ConfirmModal
        title={`Xác nhận tiếp tục tuyển`}
        open={resume}
        onFinish={handleResume}
        onCancel={() => {
          setResumne(false);
        }}>
        <h1>Xác nhận tiếp tục tuyển thêm ứng viên cho công việc</h1>
      </ConfirmModal>
      <ConfirmModal
        title={!isStop ? `Xác nhận duyệt` : 'Xác nhận bỏ duyệt tin'}
        open={accept}
        onFinish={handleAccept}
        onCancel={() => {
          setAccept(false);
        }}>
        {!isStop ? (
          <h1>
            Xác nhận duyệt tin tuyển dụng này. Tin tuyển dụng sẽ được hiện thị
            lên trang web!
          </h1>
        ) : (
          <h1>
            Xác nhận bỏ duyệt tin tuyển dụng này. Tin tuyển dụng sẽ quay về
            trạng thái chưa được duyệt!
          </h1>
        )}
      </ConfirmModal>
      <ConfirmModal
        title={`Xác nhận dừng tuyển`}
        open={stop}
        onFinish={handleStop}
        onCancel={() => {
          setStop(false);
        }}>
        <h1>Xác nhận dừng việc tuyển thêm ứng viên cho công việc</h1>
      </ConfirmModal>
    </div>
  );
};

export default AdminJobsContainer;
