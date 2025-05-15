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
import {
  formatDateNew,
  formatDateTime,
  formatDateToYMD,
} from '@/utils/formatDate';
import ConfirmModal from '@/components/business/modal/ConfirmModal/BookInterviewModal';
import { getMe } from '@/api/features/user';
import SalePost from '@/components/business/modal/SalePost';
import { formatCurrency } from '@/utils/helper';
import { deletePackage, getListPackage } from '@/api/features/package';
import PackageCruModal from '@/components/business/modal/package-cru';
import { getListTransaction, getOverViewTransaction } from '@/api/features/pay';
import { useSelector } from 'react-redux';
import { TypeUser } from '@/interface/common/type';

const TransactionContainer: React.FC = () => {
  const [data, setData] = useState([]);
  const [dataOverV, setDataOverV] = useState<any>([]);
  const [employInfor, setEmployInfor] = useState<any>([]);
  const [idSelect, setIdSelect] = useState('');
  const [idSelected, setIdSelected] = useState('');
  const { role, username } = useSelector(state => state.auth);
  const [forceUpdate, setForceUpdate] = useState(1);
  const [form] = Form.useForm();

  const columns: any = [
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => record?.package_info?.name,
    },
    role == TypeUser.Admin && {
      title: 'Tên người mua',
      dataIndex: 'name2',
      key: 'name2',
      render: (_: any, record: any) => record?.employer_info?.name,
    },
    {
      title: 'Giá gói',
      dataIndex: 'price',
      key: 'price',
      render: (_: any, record: any) =>
        record?.package_info?.price &&
        formatCurrency(record?.package_info?.price),
    },
    {
      title: 'Số lượt tuyển dụng thêm',
      dataIndex: 'count',
      key: 'count',
      render: (_: any, record: any) => record?.package_info?.count,
    },
    {
      title: 'Nội dung chuyển khoản',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: any) => createdAt && formatDateTime(createdAt),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => {
        return status ? (
          <span style={{ color: 'green' }}>Thanh toán thành công</span>
        ) : (
          <span style={{ color: 'red' }}>Thanh toán thất bại</span>
        );
      },
    },
  ].filter(Boolean);
  const fetchListTransaction = async (data?: any) => {
    const res = await getListTransaction(data);
    const resOv = await getOverViewTransaction();
    if (res && res.result) {
      setData(res.result);
    }
    if (resOv && resOv.result) {
      setDataOverV(resOv.result);
    }
  };

  const handleSearch = async () => {
    const data = await form.validateFields();
    console.log('check dataa', data);
    fetchListTransaction(data);
  };

  useEffect(() => {
    fetchListTransaction([]);
  }, [forceUpdate]);

  return (
    <div className="w-full">
      <div className="mx-[20px] p-6 bg-white mt-[20px]">
        {role == TypeUser.Admin && (
          <div className="flex items-center gap-4">
            <div className="border border-green-600 rounded-xl w-[200px] p-4 text-center bg-gray-50 shadow">
              <div className="font-semibold">Tổng thu nhập</div>
              <div className="text-green-600">
                {formatCurrency(dataOverV?.totalRevenue)}
              </div>
            </div>
            <div className="border border-blue-600 rounded-xl w-[200px] p-4 text-center bg-gray-50 shadow">
              <div className="font-semibold">Giao dịch thành công</div>
              <div className="text-blue-600">
                {dataOverV?.successfulTransactions}
              </div>
            </div>
          </div>
        )}
        <div className="w-full">
          <Form form={form}>
            <Row gutter={16}>
              <Col
                xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                md={24} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                lg={24} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                xl={24} // Chiếm 19/24 phần màn hình cực lớn (xl)
              >
                <InputBasic isSpan label="Tên gói" name="name" />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <DatePickerFromTo
                  labelFromDate="Ngày giao dịch từ"
                  labelToDate="đến"
                  name="createdAt"
                  notInitValue
                />
              </Col>
            </Row>

            <div className="flex gap-[16px]  items-center justify-between bg-white w-full ">
              <div className="flex gap-[16px] items-center"></div>
              <div>
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
          <TableBasic dataSource={data} columns={columns} isPaginationClient />
        </div>
      </div>
    </div>
  );
};

export default TransactionContainer;
