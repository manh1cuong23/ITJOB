import { deleteBlog, getListBlog } from '@/api/features/admin';
import { MyButton } from '@/components/basic/button';
import { TableBasic } from '@/components/basic/table';
import InsertUpdateBlog from '@/components/business/modal/blog';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Dropdown, Menu, message } from 'antd';
import { useEffect, useState } from 'react';

const AdminBlogsPage = () => {
  const [openInsertUpdateBlog, setOpenInsertUpdateBlog] =
    useState<boolean>(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
  });

  const fetchBlogList = async () => {
    setLoading(true);
    const res = await getListBlog(pagination);
    setBlogs(res.result);
    setLoading(false);
  };

  const handleDeleteBlog = async (id: string) => {
    setLoading(true);
    const res = await deleteBlog(id);
    fetchBlogList();
    message.success(res.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogList();
  }, []);

  const columns: any = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: any) => (
        <img
          src={avatar}
          className="h-[50px] w-[50px] rounded-full"
          alt="img"
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
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
                handleDeleteBlog(record._id);
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
    <div>
      <div className="flex gap-[16px]  items-center justify-between bg-white w-full ">
        <div>
          <MyButton
            className="h-[40px] m-3"
            onClick={() => setOpenInsertUpdateBlog(true)}>
            <p>Tạo blog</p>
          </MyButton>
        </div>
      </div>
      <div className="bg-white mt-[20px] w-full px-[20px]">
        <TableBasic
          dataSource={blogs}
          loading={loading}
          columns={columnAdd}
          isPaginationClient
        />
      </div>

      {openInsertUpdateBlog && (
        <InsertUpdateBlog
          title="Thêm mới"
          open={openInsertUpdateBlog}
          onCancel={() => setOpenInsertUpdateBlog(false)}
          onOk={fetchBlogList}
        />
      )}
    </div>
  );
};

export default AdminBlogsPage;
