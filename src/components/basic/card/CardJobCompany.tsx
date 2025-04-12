import React, { ReactNode } from 'react';
import './style.less';
interface MyCardProps {
  title?: string | ReactNode;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const MyCardjobCompany: React.FC<MyCardProps> = ({
  title,
  children,
  className = '',
  style,
}) => {
  const dataitem = {
    nameCompany: 'PRIME TECH SOLUTION COMPANY LIMITED',
    title: 'Your Partner All The Way',
    img: 'https://salt.topdev.vn/75VadizXM8hmNkdG26qUXYwIAVX3KcVcqvehkraKrMQ/fit/828/1000/ce/1/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzAyLzIwL1RvcERldi1hN2UyZmMyZmE5Y2IyOGQzZDMyM2Y2ODgyNDIxNDU3OS0xNzQwMDQ0NzQyLnBuZw',
    address: 'Quận Gò Vấp, Hồ Chí Minh',
    employees: '25-99 Nhân viên',
    business: 'Phần mềm, dịch vụ',
  };
  return (
    <div
      className={`${className} my-6 rounded bg-white shadow-md hover:shadow-lg`}>
      <img
        className="h-[150px] w-full  rounded-tl rounded-tr object-cover object-center"
        src={dataitem.img}
      />
      <div className="px-4 flex-1  p-[16px]">
        <div className=" border-b-2 pb-4 ">
          <h2 className="text-gray line-clamp-1 text-lg font-bold transition-all hover:text-primary-300">
            {dataitem.nameCompany}
          </h2>
          <h2 className="tag-line text-gray mt-1 line-clamp-1 text-base">
            {dataitem.title}
          </h2>
          <ul className="text-base text-gray-500  pl-[10px] mt-2">
            <li className="">{dataitem.address}</li>
            <li>{dataitem.employees}</li>
            <li>{dataitem.business}</li>
          </ul>
        </div>
        <p className="text-sm text-primary text-underline whitespace-nowrap pt-2 text-center">
          {`2 vị trí tuyển dụng >`}
        </p>
      </div>
    </div>
  );
};

export default MyCardjobCompany;
