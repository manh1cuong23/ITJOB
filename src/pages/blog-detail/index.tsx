import { getDeatailBlog, getListBlog } from '@/api/features/admin';
import CardBlog from '@/components/basic/card/CardBlog';
import JobApplyContainer from '@/containers/job-apply';
import { formatDateNew } from '@/utils/formatDate';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blogs, setBlogs] = useState<any>([]);
  const [data, setData] = useState<any>();
  console.log('id', id);
  const getDetailBlog = async () => {
    if (id) {
      const data = await getDeatailBlog(id);
      setData(data?.result);
    }
  };
  const fetchBlog = async () => {
    const res = await getListBlog({ page: 1, limit: 3 });
    if (res?.result) {
      setBlogs(res?.result);
    }
  };
  useEffect(() => {
    fetchBlog();
    getDetailBlog();
  }, [id]);
  return (
    <div className="w-3/4 mx-auto bg-white p-6">
      <div>
        <h1 className="text-[30px] font-medium">{data?.title}</h1>
        <div
          className="mt-5"
          dangerouslySetInnerHTML={{ __html: data?.content }}
        />
      </div>
      <div className="flex justify-end text-gray-600 mt-4">
        {' '}
        Ngày đăng {formatDateNew(data?.created_at)}
      </div>
      <div className="mt-4">
        <h1 className="text-[24px] font-bold text-black my-4 border-top">
          Bài viết tương tự
          <div className="flex mt-5 flex-wrap">
            {blogs &&
              blogs.length > 0 &&
              blogs?.map((item: any, index: number) => (
                <CardBlog key={index} className=" w-1/3" data={item} />
              ))}
          </div>
        </h1>
      </div>
    </div>
  );
};

export default BlogDetailPage;
