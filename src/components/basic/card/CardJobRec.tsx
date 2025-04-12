import React, { ReactNode } from 'react';
import './style.less';
import { NavLink } from 'react-router-dom';
import MyTag from '../tags/tag';
import { DollarOutlined } from '@ant-design/icons';
interface MyCardProps {
  title?: string | ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CardJobRec: React.FC<MyCardProps> = ({
  title,
  children,
  className = '',
  style,
}) => {
  return (
    <div
      className={` ${className} border rounded-lg pb-[24px]  hover:bg-[#f9ebdd] transition-colors cursor-pointer duration-200 py-4 px-2 bg-[#fff4e9]`}>
      <h1 className="text-[14px] text-[#a6a6a6]">Đăng 10 ngày trước</h1>
      <h1 className="text-[18px] font-bold my-2">Oracale Support Specialist</h1>
      <div className="flex items-center gap-[6px] my-2 pb-2">
        <img
          className="w-[50px] h-[50px] object-contain"
          src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMGdvREE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--49f107dff1850ed1ff3ede3c7e0a1b99659f1d83/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcGFXbHAiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--20b0435834affc851fb8b496383cefc8135158a8/elca-logo.jpg"
        />
        <h1 className="text-[14px] ">PRIME TECH SOLUTION COMPANY LIMITED</h1>
      </div>
      <div className="flex items-center gap-[12px] my-2">
        <DollarOutlined />
        <h1 className="text-[14px]">Lên tới 4000</h1>
      </div>
      <div className="flex items-center gap-[12px] my-2">
        <DollarOutlined />
        <h1 className="text-[14px]">Lên tới 4000</h1>
      </div>
      <div className="flex items-center gap-[12px] my-2">
        <DollarOutlined />
        <h1 className="text-[14px]">Lên tới 4000</h1>
      </div>
      <div className="mt-4">
        <MyTag title="SQL" />
        <MyTag title="SQL" />
        <MyTag title="SQL" />
      </div>
    </div>
  );
};

export default CardJobRec;
