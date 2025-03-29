import React, { ReactNode } from 'react';
import './style.less';
import CardMiniCompany from './CardMiniCompany';
interface MyCardProps {
  title?: string | ReactNode;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CardSection: React.FC<MyCardProps> = ({
  title,
  children,
  className = '',
  style,
}) => {
  const dataitem = {
    nameCompany: 'PRIME TECH SOLUTION COMPANY LIMITED',
    title: 'Việc làm nổi bật',
    img: 'https://salt.topdev.vn/75VadizXM8hmNkdG26qUXYwIAVX3KcVcqvehkraKrMQ/fit/828/1000/ce/1/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzAyLzIwL1RvcERldi1hN2UyZmMyZmE5Y2IyOGQzZDMyM2Y2ODgyNDIxNDU3OS0xNzQwMDQ0NzQyLnBuZw',
    address: 'Quận Gò Vấp, Hồ Chí Minh',
    employees: '25-99 Nhân viên',
    business: 'Phần mềm, dịch vụ',
  };
  return (
    <div className=" my-6 rounded bg-white shadow-sm hover:shadow-md  border border-solid border-primary ">
      <div className="rounded-tl rounded-tr border-b border-solid border-primary bg-[rgb(254,238,235)] px-4 py-2">
        <h2 className="text-lg font-bold">{dataitem.title}</h2>
      </div>
      <div className="">
        <div className="">
          <CardMiniCompany />
          <CardMiniCompany />
          <CardMiniCompany />
          <CardMiniCompany />
        </div>
      </div>
    </div>
  );
};

export default CardSection;
