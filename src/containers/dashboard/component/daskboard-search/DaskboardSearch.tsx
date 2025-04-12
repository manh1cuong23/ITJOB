import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import InputSearchDashBoard from './InputSearchDashBoard';
import FilterSearchDashBoard from '../filterSearch-dashboard/FilterSearchDashBoard';
import '../../style.less';
const { Option } = Select;
interface Props {
  handleSeach?: (data: any) => void;
  isDashBoard?: boolean;
}
const DaskboardSearch: React.FC<Props> = ({ handleSeach, isDashBoard }) => {
  return (
    <div
      className={`${
        isDashBoard ? 'h-[480px]' : 'h-[300px]'
      } bg-cover bg-center bg-no-repeat bg-main-search py-[20px] relative`}>
      <h2 className="text-center font-bold text-[#1E1E1E]  text-[24px]">
        Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc.
      </h2>
      <p className="text-center text-s mb-[16px] pb-[16px]">
        {' '}
        Tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại
        Việt Nam
      </p>
      <InputSearchDashBoard handleSeach={handleSeach} />
      {isDashBoard && (
        <div>
          <div className="absolute bottom-0 z-0 hidden h-[69px] w-full rounded-tl-[54px] rounded-tr-[54px] bg-white md:block"></div>

          <div className="relative mt-[80px] z-10 mx-auto hidden max-h-[186px] max-w-[1260px] justify-center gap-8 overflow-hidden rounded-[8px] bg-white p-4 align-middle shadow-md md:flex">
            <div className="group relative cursor-pointer items-center gap-3 p-4 text-left hover:rounded-[8px] hover:bg-neutral-100 hover:transition hover:duration-150 hover:ease-linear">
              <a className="flex flex-col" href="#">
                <img
                  alt="Create CV icon"
                  loading="lazy"
                  width="20"
                  height="20"
                  decoding="async"
                  className="h-7 w-7 rounded-lg bg-slate-100 p-1 group-hover:bg-white"
                  src="https://c.topdevvn.com/v4/_next/static/media/create-cv.268c1aeb.svg"
                />
                <span className="mt-[7px] text-[18px] font-semibold leading-6 tracking-[0.09px] text-[#424242]">
                  Tạo CV
                </span>
                <span className="mt-1 text-[14px] leading-5 tracking-[0.14px] text-[#757575]">
                  Tạo CV ấn tượng chỉ với thao tác dễ dàng
                </span>
                <div className="mt-2 flex gap-2 text-left group-hover:visible group-hover:transition group-hover:duration-150 group-hover:ease-linear">
                  <button className="justify-center text-center text-[14px] font-semibold leading-5 tracking-[0.14px] text-primary underline">
                    Tạo ngay
                  </button>
                </div>
              </a>
            </div>
            <div className="group relative cursor-pointer items-center gap-3 p-4 text-left hover:rounded-[8px] hover:bg-neutral-100 hover:transition hover:duration-150 hover:ease-linear">
              <a className="flex flex-col" href="#">
                <img
                  alt="Create CV icon"
                  loading="lazy"
                  width="20"
                  height="20"
                  decoding="async"
                  className="h-7 w-7 rounded-lg bg-slate-100 p-1 group-hover:bg-white"
                  src="https://c.topdevvn.com/v4/_next/static/media/create-cv.268c1aeb.svg"
                />
                <span className="mt-[7px] text-[18px] font-semibold leading-6 tracking-[0.09px] text-[#424242]">
                  Tạo CV
                </span>
                <span className="mt-1 text-[14px] leading-5 tracking-[0.14px] text-[#757575]">
                  Tạo CV ấn tượng chỉ với thao tác dễ dàng
                </span>
                <div className="mt-2 flex gap-2 text-left group-hover:visible group-hover:transition group-hover:duration-150 group-hover:ease-linear">
                  <button className="justify-center text-center text-[14px] font-semibold leading-5 tracking-[0.14px] text-primary underline">
                    Tạo ngay
                  </button>
                </div>
              </a>
            </div>
            <div className="group relative cursor-pointer items-center gap-3 p-4 text-left hover:rounded-[8px] hover:bg-neutral-100 hover:transition hover:duration-150 hover:ease-linear">
              <a className="flex flex-col" href="#">
                <img
                  alt="Create CV icon"
                  loading="lazy"
                  width="20"
                  height="20"
                  decoding="async"
                  className="h-7 w-7 rounded-lg bg-slate-100 p-1 group-hover:bg-white"
                  src="https://c.topdevvn.com/v4/_next/static/media/create-cv.268c1aeb.svg"
                />
                <span className="mt-[7px] text-[18px] font-semibold leading-6 tracking-[0.09px] text-[#424242]">
                  Tạo CV
                </span>
                <span className="mt-1 text-[14px] leading-5 tracking-[0.14px] text-[#757575]">
                  Tạo CV ấn tượng chỉ với thao tác dễ dàng
                </span>
                <div className="mt-2 flex gap-2 text-left group-hover:visible group-hover:transition group-hover:duration-150 group-hover:ease-linear">
                  <button className="justify-center text-center text-[14px] font-semibold leading-5 tracking-[0.14px] text-primary underline">
                    Tạo ngay
                  </button>
                </div>
              </a>
            </div>
            <div className="group relative cursor-pointer items-center gap-3 p-4 text-left hover:rounded-[8px] hover:bg-neutral-100 hover:transition hover:duration-150 hover:ease-linear">
              <a className="flex flex-col" href="#">
                <img
                  alt="Create CV icon"
                  loading="lazy"
                  width="20"
                  height="20"
                  decoding="async"
                  className="h-7 w-7 rounded-lg bg-slate-100 p-1 group-hover:bg-white"
                  src="https://c.topdevvn.com/v4/_next/static/media/create-cv.268c1aeb.svg"
                />
                <span className="mt-[7px] text-[18px] font-semibold leading-6 tracking-[0.09px] text-[#424242]">
                  Tạo CV
                </span>
                <span className="mt-1 text-[14px] leading-5 tracking-[0.14px] text-[#757575]">
                  Tạo CV ấn tượng chỉ với thao tác dễ dàng
                </span>
                <div className="mt-2 flex gap-2 text-left group-hover:visible group-hover:transition group-hover:duration-150 group-hover:ease-linear">
                  <button className="justify-center text-center text-[14px] font-semibold leading-5 tracking-[0.14px] text-primary underline">
                    Tạo ngay
                  </button>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaskboardSearch;
