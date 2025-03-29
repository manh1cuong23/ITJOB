import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { MyButton } from '@/components/basic/button';
import { SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import InputSelectPlace from './InputSelectPlace';
import FilterSearchDashBoard from '../filterSearch-dashboard/FilterSearchDashBoard';

const InputSearchDashBoard: React.FC = () => {
  return (
    <div className="mx-auto w-[1260px]">
      <div className="w-100 h-[72px] rounded-lg text-center bg-white  flex justify-between items-center px-[16px] py-[8px] gap-x-[16px]">
        <div>
          <MyButton
            className="!h-[50px]  !text-8xl"
            icon={<UnorderedListOutlined className="!text-[16px]" />}>
            <p className="!text-[16px]">Bộ lọc</p>
          </MyButton>
        </div>
        <div className="border-l w-1/2 flex-1 ">
          <Input
            placeholder="Vị trí tuyển dụng, tên công ty"
            className="h-[42px]  !border-none !outline-none "
          />
        </div>
        <MyButton
          className="!h-[50px]  !text-8xl"
          icon={<SearchOutlined className="!text-[16px]" />}>
          <p className="!text-[16px]">Tìm kiếm</p>
        </MyButton>
      </div>
      <FilterSearchDashBoard />
    </div>
  );
};

export default InputSearchDashBoard;
