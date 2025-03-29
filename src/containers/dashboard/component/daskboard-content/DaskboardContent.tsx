import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker, Carousel } from 'antd';
import DaskboardContentLeft from './DaskboardContentLeft';
import DaskboardContentRight from './DaskboardContentRight';
import MyCardjobCompany from '@/components/basic/card/CardJobCompany';
import MyCardjobBasic from '@/components/basic/card/CardjobBasic';
import JobCarousel from './JobCaurel';
const jobs = [
  {
    logo: 'https://salt-2.topdev.vn/pcd4sSyNgvr820-JaUsyqcMlPk6WLprRAOo-0JgQxts/rs:fit/w:160/h:112/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzAzLzAzL1RvcERldi0xODUzZGU4MzlkM2U5ZjcxMjkxZjJlODFiM2Y0Mjg5NC0xNzQwOTg0MzAwLmpwZw',
    title: 'CATHAY UNITED BANK - HO CHI MINH CITY BRANCH',
    subtitle: 'Cathay empowers your future',
    description: 'Cathay United Bank (CUB) is a wholly owned subsidiary...',
    jobsLink: 'https://your-job-listing-url.com',
    backgroundImage:
      'https://salt-2.topdev.vn/p5CZt1Nmepjdd2jyXWP2flvkWRxTuS5h2aWzZDvggWY/rs:fill/w:832/h:250/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzAzLzExL1RvcERldi1lYmRlNWI1NzQxZDkzNTYzZDgwMDlhNTU2MTdmNzdhZi0xNzQxNjg3MzEwLmpwZw',
  },
  {
    logo: 'https://salt-2.topdev.vn/pcd4sSyNgvr820-JaUsyqcMlPk6WLprRAOo-0JgQxts/rs:fit/w:160/h:112/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzAzLzAzL1RvcERldi0xODUzZGU4MzlkM2U5ZjcxMjkxZjJlODFiM2Y0Mjg5NC0xNzQwOTg0MzAwLmpwZw',
    title: 'CATHAY UNITED BANK - HO CHI MINH CITY BRANCH',
    subtitle: 'Cathay empowers your future',
    description: 'Cathay United Bank (CUB) is a wholly owned subsidiary...',
    jobsLink: 'https://your-job-listing-url.com',
    backgroundImage:
      'https://salt-2.topdev.vn/p5CZt1Nmepjdd2jyXWP2flvkWRxTuS5h2aWzZDvggWY/rs:fill/w:832/h:250/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzAzLzExL1RvcERldi1lYmRlNWI1NzQxZDkzNTYzZDgwMDlhNTU2MTdmNzdhZi0xNzQxNjg3MzEwLmpwZw',
  },
  {
    logo: 'https://salt-2.topdev.vn/pcd4sSyNgvr820-JaUsyqcMlPk6WLprRAOo-0JgQxts/rs:fit/w:160/h:112/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzAzLzAzL1RvcERldi0xODUzZGU4MzlkM2U5ZjcxMjkxZjJlODFiM2Y0Mjg5NC0xNzQwOTg0MzAwLmpwZw',
    title: 'CATHAY UNITED BANK - HO CHI MINH CITY BRANCH',
    subtitle: 'Cathay empowers your future',
    description: 'Cathay United Bank (CUB) is a wholly owned subsidiary...',
    jobsLink: 'https://your-job-listing-url.com',
    backgroundImage:
      'https://salt-2.topdev.vn/p5CZt1Nmepjdd2jyXWP2flvkWRxTuS5h2aWzZDvggWY/rs:fill/w:832/h:250/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzAzLzExL1RvcERldi1lYmRlNWI1NzQxZDkzNTYzZDgwMDlhNTU2MTdmNzdhZi0xNzQxNjg3MzEwLmpwZw',
  },
  {
    logo: 'https://salt-2.topdev.vn/pcd4sSyNgvr820-JaUsyqcMlPk6WLprRAOo-0JgQxts/rs:fit/w:160/h:112/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzAzLzAzL1RvcERldi0xODUzZGU4MzlkM2U5ZjcxMjkxZjJlODFiM2Y0Mjg5NC0xNzQwOTg0MzAwLmpwZw',
    title: 'CATHAY UNITED BANK - HO CHI MINH CITY BRANCH',
    subtitle: 'Cathay empowers your future',
    description: 'Cathay United Bank (CUB) is a wholly owned subsidiary...',
    jobsLink: 'https://your-job-listing-url.com',
    backgroundImage:
      'https://salt-2.topdev.vn/p5CZt1Nmepjdd2jyXWP2flvkWRxTuS5h2aWzZDvggWY/rs:fill/w:832/h:250/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzAzLzExL1RvcERldi1lYmRlNWI1NzQxZDkzNTYzZDgwMDlhNTU2MTdmNzdhZi0xNzQxNjg3MzEwLmpwZw',
  },
  // Thêm nhiều job khác nếu cần
];

const DaskboardContent: React.FC = () => {
  return (
    <div className="mx-auto w-[1260px] pt-[20px]  bg-white ">
      <div>
        <h1 className="text-[28px] text-center font-bold text-black mt-4">
          Các công ty nổi bật
        </h1>
        <JobCarousel jobs={jobs} />
      </div>

      <h1 className="text-[28px] text-center font-bold text-black mt-4">
        Nhà tuyển dụng hàng đầu
      </h1>
      <div className="flex  flex-wrap">
        <div className="p-2 w-1/3">
          <MyCardjobCompany className=" border" />
        </div>
        <div className="p-2 w-1/3">
          <MyCardjobCompany className=" border" />
        </div>
        <div className="p-2 w-1/3">
          <MyCardjobCompany className=" border" />
        </div>
        <div className="p-2 w-1/3">
          <MyCardjobCompany className=" border" />
        </div>
        <div className="p-2 w-1/3">
          <MyCardjobCompany className=" border" />
        </div>
        <div className="p-2 w-1/3">
          <MyCardjobCompany className=" border" />
        </div>
        <div className="p-2 w-1/3">
          <MyCardjobCompany className=" border" />
        </div>
        <div className="p-2 w-1/3">
          <MyCardjobCompany className=" border" />
        </div>
        <div className="p-2 w-1/3">
          <MyCardjobCompany className=" border" />
        </div>
      </div>
      <div>
        <h1 className="text-[28px] text-center font-bold text-black mt-4">
          Các công việc hàng đầu
          <div className="flex  flex-wrap">
            <div className="p-2 w-1/3">
              <MyCardjobBasic />
            </div>
          </div>
        </h1>
      </div>
      <div className="h-[1000px]"></div>
    </div>
  );
};

export default DaskboardContent;
