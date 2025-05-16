import React, { useEffect, useRef, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import { MyCardjob } from '@/components/basic/card';
import MyCardRecruiter from '@/components/basic/card/CardJobRecruiter';
interface Props {
  listJob: any;
  isJob?: boolean;
  listRecruiter?: any;
  fetchMoreData?: any;
  totalPage?: any;
  page?: any;
  total?: any;
}
const DaskboardContentLeft: React.FC<Props> = ({
  listJob,
  isJob = true,
  listRecruiter,
  fetchMoreData,
  totalPage,
  total,
  page,
}) => {
  const divRef = useRef<any>(null);

  const handleScroll = () => {
    if (divRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = divRef.current;
      // Kiểm tra nếu cuộn đến cuối (có thể thêm một khoảng nhỏ để tăng tính linh hoạt)
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log('Đã cuộn đến cuối div!');
        // Thực hiện hành động khi cuộn đến cuối, ví dụ: tải thêm dữ liệu
        fetchMoreData();
        if (page < totalPage) divRef.current.scrollTop -= 50; // Kéo lên 50px, điều chỉnh nếu cần
      }
    }
  };
  return (
    <div className="w-2/3">
      <div className="mr-4">
        <div className="text-lg text-primary mb-4">
          {isJob ? total.job : total?.employer}
          <span className="text-lg font-bold text-black">
            {isJob ? ' Việc làm' : ' Công ty'}
          </span>
        </div>
        <div
          className="max-h-[1400px] overflow-auto"
          ref={divRef}
          onScroll={handleScroll}>
          {isJob
            ? listJob &&
              listJob.length > 0 &&
              listJob.map((item: any, index: number) => (
                <MyCardjob key={index} data={item} />
              ))
            : listRecruiter &&
              listRecruiter.length > 0 &&
              listRecruiter.map((item: any, index: number) => (
                <MyCardRecruiter key={index} data={item} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default DaskboardContentLeft;
