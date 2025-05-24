import { deleteBlog, getListBlog } from '@/api/features/admin';
import CardBlog from '@/components/basic/card/CardBlog';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
const BlogPage = () => {
  const [blogs, setBlogs] = useState<any>([]);
  const fetchBlog = async () => {
    const res = await getListBlog({ page: 1, limit: 10 });
    if (res?.result) {
      setBlogs(res?.result);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const featuredBlogs = blogs.slice(0, 5);
  const popularBlogs = blogs.slice(5, 10);
  return (
    <div className="bg-white">
      <div className="w-[1260px] mx-auto mt-5">
        <div className="text-[26px] font-medium">Bài viết nổi bật</div>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          className="mt-5">
          {featuredBlogs &&
            featuredBlogs.length > 0 &&
            featuredBlogs.map((item: any, index: number) => (
              <SwiperSlide key={index}>
                <CardBlog className="w-full" data={item} />
              </SwiperSlide>
            ))}
        </Swiper>
        <div className="text-[26px] mt-4 font-medium">
          Bài viết được xem nhiều
        </div>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          className="mt-5">
          {popularBlogs &&
            popularBlogs.length > 0 &&
            popularBlogs.map((item: any, index: number) => (
              <SwiperSlide key={index}>
                <CardBlog className="w-full" data={item} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BlogPage;
