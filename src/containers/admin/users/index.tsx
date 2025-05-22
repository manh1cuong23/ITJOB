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
  getListUser,
  makeActiveAccount,
  makeInActiveAccount,
} from '@/api/features/admin';
import { getLableSingle } from '@/utils/helper';

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

const AdminUsersContainer: React.FC = () => {
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => {
        return record?.employer_info?.name || _;
      },
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: any) => (
        <img
          src={
            avatar ||
            'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='
          }
          className="h-[50px] w-[50px] rounded-full"
          alt="img"
        />
      ),
    },

    {
      title: 'Vai trò người dùng',
      dataIndex: 'role',
      key: 'role',
      render: (role: any) => role && getLableSingle(role, userTypeOptions),
    },
    {
      title: 'Trạng thái hoạt động',
      dataIndex: 'active',
      key: 'active',
      render: (active: any) => (
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              active ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span
            className={
              active ? 'text-green-600 font-medium' : 'text-red-500 font-medium'
            }>
            {active ? 'Hoạt động' : 'Không hoạt động'}
          </span>
        </div>
      ),
    },
  ];
  const fetchListUser = async (data: any) => {
    const res = await getListUser(data);
    if (res && res.result) {
      const datas = res.result?.map((item: any, index: number) => {
        const { candidate_info, ...prev } = item;
        return { ...candidate_info, ...prev };
      });
      setData(datas);
    }
  };
  const handleSearch = async () => {
    const data = await form.validateFields();
    fetchListUser(data);
  };

  useEffect(() => {
    fetchListUser([]);
  }, [forceUpdate]);

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
      message.success('Bạn đã đổi trạng thái của tài khoản thành công!');
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
        const menu = (
          <Menu
            onClick={({ key }) => {
              setIdSelected(record?._id);
              if (key === 'view') {
                setIdSelected(record?._id);
                setIsViewMode(true);
                setOpenEdit(true);
              } else if (key === 'edit') {
                setIdSelected(record?._id);
                setIsViewMode(false);
                setOpenEdit(true);
              } else if (key === 'active') {
                setResumne(true);
              } else if (key === 'inactive') {
                // xử lý xóa tại đây
                setStop(true);
              }
            }}
            items={[
              record.active
                ? {
                    key: 'inactive',
                    icon: <PoweroffOutlined className="text-red-500" />,
                    label: 'Dừng hoạt động',
                    className: 'min-w-[160px] left-[0]',
                  }
                : {
                    key: 'active',
                    icon: <CheckOutlined className="text-green-500" />,
                    label: 'Bật hoạt động',
                    className: 'min-w-[160px] left-[0]',
                  },
            ]}
          />
        );

        return (
          <Dropdown
            overlay={menu}
            placement="bottomLeft"
            trigger={['click']}
            getPopupContainer={triggerNode => {
              const parent = triggerNode.closest('.table-container');
              // Nếu không tìm thấy .table-container, sử dụng triggerNode làm container mặc định
              return parent instanceof HTMLElement ? parent : triggerNode;
            }}>
            <div
              onClick={e => e.stopPropagation()}
              className="cursor-pointer border px-2 py-1 rounded-md hover:bg-gray-100 inline-flex items-center gap-1">
              Thao tác <DownOutlined />
            </div>
          </Dropdown>
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
                xs={6} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                sm={6} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                md={6} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                lg={6} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                xl={6} // Chiếm 19/24 phần màn hình cực lớn (xl)
              >
                <InputBasic
                  isSpan
                  label="Email"
                  name="key"
                  placeholder="Nhập email"
                />
              </Col>
              <Col
                xs={6} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                sm={6} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                md={6} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                lg={6} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                xl={6} // Chiếm 19/24 phần màn hình cực lớn (xl)
              >
                <InputBasic
                  isSpan
                  label="Tên"
                  name="name"
                  placeholder="Nhập tên"
                />
              </Col>
              <Col span={6}>
                <MyFormItem
                  name="role"
                  label="Loại tài khoản"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}>
                  <SingleSelectSearchCustom
                    className="change-field"
                    options={[...userTypeOptions, { label: 'All', value: '' }]}
                  />
                </MyFormItem>
              </Col>
              <Col span={6}>
                <MyFormItem
                  name="active"
                  label="Trạng thái"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}>
                  <SingleSelectSearchCustom
                    className="change-field"
                    options={[...statusAccounts, { label: 'All', value: '' }]}
                  />
                </MyFormItem>
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
        <div className="bg-white mt-[20px] w-full">
          <TableBasic
            dataSource={data}
            columns={columnAdd}
            isPaginationClient
          />
        </div>
      </div>

      <ConfirmModal
        title={`Xác nhận bật hoạt động`}
        open={resume}
        onFinish={handleResume}
        onCancel={() => {
          setResumne(false);
        }}>
        <h1>Bạn xác nhận bật hoạt động của tài khoản này</h1>
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

export default AdminUsersContainer;
