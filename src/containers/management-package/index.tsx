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
import { JobStatus, JobStatusOptions, jobStatusOptions } from '@/constants/job';
import { DatePickerFromTo } from '@/components/business/date-picker';
import { create } from 'lodash';
import { formatDateToYMD } from '@/utils/formatDate';
import ConfirmModal from '@/components/business/modal/ConfirmModal/BookInterviewModal';
import { getMe } from '@/api/features/user';
import SalePost from '@/components/business/modal/SalePost';
import { formatCurrency } from '@/utils/helper';
import { deletePackage, getListPackage } from '@/api/features/package';
import PackageCruModal from '@/components/business/modal/package-cru';

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

const PackageContainer: React.FC = () => {
  const [data, setData] = useState([]);
  const [employInfor, setEmployInfor] = useState<any>([]);
  const [idSelect, setIdSelect] = useState('');
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [statusBuy, setStatusBuy] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [resume, setResumne] = useState(false);
  const [stop, setStop] = useState(false);
  const [deleteD, setDeleteD] = useState<any>(false);
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
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá gói',
      dataIndex: 'price',
      key: 'price',
      render: (price: any) => price && formatCurrency(price),
    },
    {
      title: 'Số lượt tuyển dụng thêm',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => {
        return status ? (
          <span style={{ color: 'green' }}>Đang hoạt động</span>
        ) : (
          <span style={{ color: 'red' }}>Không hoạt động</span>
        );
      },
    },
  ];
  const fetchListPackage = async (data: any = []) => {
    const res = await getListPackage(data);
    if (res && res.result) {
      setData(res.result);
    }
  };

  const handleSearch = async () => {
    const data = await form.validateFields();
    console.log('check dataa', data);
    fetchListPackage(data);
  };

  useEffect(() => {
    fetchListPackage([]);
  }, [forceUpdate]);

  const handleResume = async () => {
    const res = await changeStatus(idSelect, { status: JobStatus.Recuriting });
    if (res?.message) {
      message.success('Tin tuyển dụng đã được yêu cầu tiếp tục tuyển dụng');
      fetchListPackage([]);
      setResumne(false);
    }
  };

  const handleStop = async () => {
    const res = await changeStatus(idSelect, { status: JobStatus.Stopped });
    if (res?.message) {
      fetchListPackage([]);
      message.success('Tin tuyển dụng đã được yêu cầu dừng tuyển dụng');
      setStop(false);
    }
  };
  const handleDelete = async () => {
    const res = await deletePackage(idSelected);
    if (res?.message) {
      message.success('Gói đã được xóa thành công');
      setDeleteD(false);
      fetchListPackage();
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
        console.log('check record', record);
        const menu = (
          <Menu
            onClick={({ key }) => {
              console.log('Checkl record', record?._id);
              setIdSelected(record?._id);
              if (key === 'view') {
                setIdSelected(record?._id);
                setIsViewMode(true);
                setOpenEdit(true);
              } else if (key === 'edit') {
                setIdSelected(record?._id);
                setIsViewMode(false);
                setOpenEdit(true);
              } else if (key === 'delete') {
                setIdSelected(record?._id);
                setDeleteD(true);
              } else if (key === 'active') {
                setResumne(true);
                console.log('vo dfay');
              } else if (key === 'inactive') {
                // xử lý xóa tại đây
                setStop(true);
              }
            }}
            items={[
              {
                key: 'view',
                icon: <EyeOutlined />,
                label: 'Xem gói',
                className: 'min-w-[160px] left-[0]',
              },
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Sửa gói',
                className: 'min-w-[160px] left-[0]',
              },
              {
                key: 'delete',
                icon: <DeleteOutlined className="text-red-500" />,
                label: <span>Xoá gói</span>,
                className: 'min-w-[160px] left-[0]',
              },
              // record.status
              //   ? {
              //       key: 'inactive',
              //       icon: <PoweroffOutlined className="text-red-500" />,
              //       label: 'Dừng hoạt động',
              //       className: 'min-w-[160px] left-[0]',
              //     }
              //   : {
              //       key: 'active',
              //       icon: <CheckOutlined className="text-green-500" />,
              //       label: 'Bật hoạt động',
              //       className: 'min-w-[160px] left-[0]',
              //     },
            ]}
          />
        );

        return (
          <Dropdown
            overlay={menu}
            placement="bottomLeft"
            trigger={['click']}
            className="!z-10"
            getPopupContainer={triggerNode => document.body}>
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
      <div className="mx-[20px] p-6 bg-white mt-[20px]">
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
                <InputBasic isSpan label="Tên gói" name="name" />
              </Col>
              <Col span={12}>
                <MyFormItem
                  name="status"
                  label="Trạng thái"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}>
                  <SingleSelectSearchCustom
                    className="change-field"
                    options={[
                      { label: 'Đang hoạt động', value: 'true' },
                      { label: 'Dừng hoạt động', value: 'false' },
                      { label: 'Tất cả', value: '' },
                    ]}
                  />
                </MyFormItem>
              </Col>
            </Row>

            <div className="flex gap-[16px]  items-center justify-between bg-white w-full ">
              <div className="flex gap-[16px] items-center"></div>
              <div>
                <MyButton
                  disabled={employInfor?.numberOffFree <= 0}
                  className="h-[40px] m-3"
                  onClick={() => {
                    setOpenCreate(true);
                  }}>
                  <p>Thêm gói mới</p>
                </MyButton>
                <Button
                  className="!bg-blue-500 text-white h-[40px] rounded-lg px-4"
                  onClick={handleSearch}>
                  Tìm kiếm
                </Button>
              </div>
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
      <PackageCruModal
        title={`Thêm mới gói`}
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
      <PackageCruModal
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
        title={`Xác nhận xóa gói này`}
        open={deleteD}
        onFinish={handleDelete}
        onCancel={() => {
          setDeleteD(false);
        }}>
        <h1>Bạn xác nhận xóa gói này</h1>
      </ConfirmModal>
    </div>
  );
};

export default PackageContainer;
