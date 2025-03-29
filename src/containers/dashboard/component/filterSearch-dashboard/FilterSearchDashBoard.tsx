import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import {
  MultiSelectWithSearch,
  SingleSelectSearchCustom,
} from '@/components/basic/select';
import { MyButton } from '@/components/basic/button';
import { Option } from '@/components/basic/select/SingleSelectSearchCustom';
import { FilterOutlined } from '@ant-design/icons';
const option: Option[] = [
  { label: 'Ha Noi1', value: '1' },
  { label: 'Ha Noi2', value: '2' },
  { label: 'Ha Noi3', value: '3' },
  { label: 'Ha Noi4', value: '4' },
];
const FilterSearchDashBoard: React.FC = () => {
  return (
    <div>
      <div className="my-3 flex justify-between  gap-[16px] ">
        <MultiSelectWithSearch
          placeholder="Thành phố"
          // className="cus"
          classButon="!h-[50px] min-w-[260px]"
          options={option}
        />
        <MultiSelectWithSearch
          placeholder="Cấp bậc"
          // className="cus"
          classButon="!h-[50px] min-w-[260px]"
          options={option}
        />
        <MultiSelectWithSearch
          // className="cus"
          classButon="!h-[50px] min-w-[260px]"
          options={option}
        />
        <MultiSelectWithSearch
          // className="cus"
          classButon="!h-[50px] min-w-[260px] "
          options={option}
        />
        <MyButton
          buttonType="secondary"
          className="!h-[50px] !w-[140px] !text-8xl !bg-gray"
          icon={<FilterOutlined className="!text-[16px]" />}>
          <p className="!text-[16px]">Xóa bộ lọc</p>
        </MyButton>
      </div>
    </div>
  );
};

export default FilterSearchDashBoard;
