import React, { useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { SingleSelectSearchCustom } from '@/components/basic/select';
import { Button, Col, Form, Input, Row, Space } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { TableBasic } from '@/components/basic/table';
import { InputBasic } from '@/components/business/input';
import DatepickerBasic from '@/components/business/date-picker/DatepickerBasic';
import { MyFormItem } from '@/components/basic/form-item';
import { getListJob } from '@/api/features/recruite';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { JobStatusOptions, jobStatusOptions } from '@/constants/job';
import { DatePickerFromTo } from '@/components/business/date-picker';
import { create } from 'lodash';
import { formatDateToYMD } from '@/utils/formatDate';
import JobCruModal from '@/components/business/modal/job-cru';
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
    render: (status: number) => {
      return jobStatusOptions.find(item => item.value == status)?.label;
    },
  },
  {
    title: 'Số lượng tuyển dụng',
    dataIndex: 'num_of_employees',
    key: 'num_of_employees',
  },
];
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

const ManagementJobContainer: React.FC = () => {
  const [data, setData] = useState([]);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [idSelected, setIdSelected] = useState('');
  const [forceUpdate, setForceUpdate] = useState(1);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const switchEditmod = () => {
    setIsViewMode(false);
  };

  useEffect(() => {
    console.log('check isviewmode', isViewMode);
  }, [isViewMode]);

  console.log('check isViewMode', isViewMode);
  const fetchListJob = async (data: any) => {
    const res = await getListJob(data);
    if (res && res.result) {
      setData(res.result.jobs);
    }
  };

  const handleSearch = async () => {
    const data = await form.validateFields();
    console.log('dataa', data);
    fetchListJob(data);
  };

  useEffect(() => {
    fetchListJob([]);
  }, [forceUpdate]);

  const columnAdd = [
    ...columns,
    {
      title: 'Hành động',
      dataIndex: 'service',
      key: 'service',
      width: 160,
      align: 'center',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-[16px] justify-center">
          <EyeOutlined
            onClick={e => {
              e.stopPropagation();
              setIdSelected(record?._id);
              setIsViewMode(true);
              setOpenEdit(true);
            }}
            className="text-blue-500 text-[16px] cursor-pointer p-1 rounded-md hover:bg-gray-200"
          />
          <EditOutlined
            onClick={e => {
              e.stopPropagation();
              setIdSelected(record?._id);
              setIsViewMode(false);
              setOpenEdit(true);
            }}
            className="text-green-500 cursor-pointer p-1 rounded-md hover:bg-gray-200"
          />
          <DeleteOutlined className="text-red-500 cursor-pointer p-1 rounded-md hover:bg-gray-200" />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full bg-white h-[50px]  flex items-center">
        <h1 className="text-[18px] font-medium  my-auto mx-[20px]">
          Quản lý tin tuyển dụng
        </h1>
      </div>
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
                    options={JobStatusOptions}
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
                />
              </Col>
            </Row>

            <div className="flex gap-[16px]  items-center justify-end bg-white w-full">
              <MyButton
                className="h-[40px] my-3"
                onClick={() => {
                  setOpenCreate(true);
                }}>
                <p>Thêm tin tuyển dụng</p>
              </MyButton>
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
            onRow={(record, rowIndex) => {
              return {
                onClick: () => {
                  navigate(`/recruiter/jobs/results/${record?._id}`);
                },
              };
            }}
          />
        </div>
      </div>
      <JobCruModal
        title={`Thêm mới tin tuyển dụng`}
        // id={data?._id}
        open={openCreate}
        isCreate={true}
        setForceUpdate={setForceUpdate}
        onFinish={() => {
          setOpenCreate(false);
        }}
        setOpen={setOpenCreate}
        onCancel={() => {
          setOpenCreate(false);
        }}
      />
      <JobCruModal
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
    </div>
  );
};

export default ManagementJobContainer;
