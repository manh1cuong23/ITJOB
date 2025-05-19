import { deleteBlog, getListBlog } from '@/api/features/admin';
import { MyButton } from '@/components/basic/button';
import { TableBasic } from '@/components/basic/table';
import { DatePickerFromTo } from '@/components/business/date-picker';
import { InputBasic } from '@/components/business/input';
import InsertUpdateBlog from '@/components/business/modal/blog';
import ConfirmModal from '@/components/business/modal/ConfirmModal/BookInterviewModal';
import { formatDateNew } from '@/utils/formatDate';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Button, Col, Dropdown, Form, Menu, message, Row } from 'antd';
import { useEffect, useState } from 'react';

const AdminBlogsPage = () => {
  const [openInsertUpdateBlog, setOpenInsertUpdateBlog] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [idSelect, setIdSelect] = useState();
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
  });

  const fetchBlogList = async (data: any = []) => {
    setLoading(true);
    const res = await getListBlog(data);
    setBlogs(res.result);
    setLoading(false);
  };

  const handleDeleteBlog = async () => {
    if (idSelect) {
      setLoading(true);
      const res = await deleteBlog(idSelect);
      fetchBlogList([]);
      message.success(res.message);
      setLoading(false);
      setDeleteModal(false);
    }
  };

  useEffect(() => {
    fetchBlogList([]);
  }, []);

  const columns: any = [
    {
      title: 'Hình nền',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: any) => (
        <img src={avatar} className="h-[50px] w-[100px]" alt="img" />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at: any) => formatDateNew(created_at),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (active: any) =>
        !active ? (
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${'bg-red-500'}`} />
            <span className={'text-red-500 font-medium'}>Đã ẩn</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${'bg-green-500'}`} />
            <span className={'text-green-500 font-medium'}>Đang hiển thị</span>
          </div>
        ),
    },
  ];

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
              if (key === 'view') {
              } else if (key === 'edit') {
                setOpenInsertUpdateBlog(record);
              } else if (key === 'delete') {
                setDeleteModal(true);
                setIdSelect(record._id);
              }
            }}
            items={[
              // {
              //   key: 'view',
              //   icon: <EyeOutlined />,
              //   label: 'Xem gói',
              //   className: 'min-w-[160px] left-[0]',
              // },
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

  const handleSearch = async () => {
    const data = await form.validateFields();
    console.log('dataa form', data);
    fetchBlogList(data);
  };
  return (
    <div className="w-full">
      <div className="mx-[20px] p-6 bg-white mt-[20px]">
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
                <InputBasic
                  isSpan
                  label="Tiêu đề"
                  name="title"
                  placeholder="Nhập title"
                />
              </Col>
            </Row>
            <Col
              xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
              sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
              md={24} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
              lg={24} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
              xl={24} // Chiếm 19/24 phần màn hình cực lớn (xl)
            >
              <DatePickerFromTo
                labelFromDate="Ngày tạo từ"
                labelToDate="đến"
                label="Ngày tạo"
                name="created_at"
                notInitValue
              />
            </Col>
            <div className="flex gap-[16px]  items-center justify-end bg-white w-full">
              <Button
                className="!bg-blue-500 text-white h-[40px] rounded-lg px-4"
                onClick={handleSearch}>
                Tìm kiếm
              </Button>
              <MyButton
                className="h-[40px] "
                onClick={() => setOpenInsertUpdateBlog(true)}>
                <p>Tạo blog</p>
              </MyButton>
            </div>
          </Form>
        </div>

        <div className=" mt-[20px] ">
          <TableBasic
            dataSource={blogs}
            loading={loading}
            columns={columnAdd}
            isPaginationClient
          />
        </div>
      </div>

      {openInsertUpdateBlog && (
        <InsertUpdateBlog
          title="Thêm mới"
          open={openInsertUpdateBlog}
          onCancel={() => setOpenInsertUpdateBlog(false)}
          onOk={fetchBlogList}
        />
      )}
      <ConfirmModal
        title={`Xác nhận xóa blog này`}
        open={deleteModal}
        onFinish={handleDeleteBlog}
        onCancel={() => {
          setDeleteModal(false);
        }}>
        <h1>Bạn xác nhận xóa gói này</h1>
      </ConfirmModal>
    </div>
  );
};

export default AdminBlogsPage;
