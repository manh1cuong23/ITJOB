import React, { ReactNode } from 'react';
import './style.less';
import { NavLink } from 'react-router-dom';
interface MyCardProps {
  title?: string | ReactNode;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  data?: any;
}

const MyCardjobCompany: React.FC<MyCardProps> = ({
  title,
  children,
  className = '',
  style,
  data,
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
        src={
          data?.cover_photo ||
          'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ff1e3a0b-d453-4f25-9d40-b639ea34eac6/d8b0e2q-c3445053-675a-4952-9be8-11884fd5c7d7.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2ZmMWUzYTBiLWQ0NTMtNGYyNS05ZDQwLWI2MzllYTM0ZWFjNlwvZDhiMGUycS1jMzQ0NTA1My02NzVhLTQ5NTItOWJlOC0xMTg4NGZkNWM3ZDcuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.TNA3OxHyji3j7IYYhoKKMv0Z9RkWkP-pcdTdxLU6h3E'
        }
      />
      <div className="px-4 flex-1  p-[16px]">
        <div className=" border-b-2 pb-4 ">
          <h2 className="text-gray line-clamp-1 text-lg font-bold transition-all hover:text-primary-300">
            {data?.name}
          </h2>
          <ul className="text-base text-gray-500  pl-[10px] mt-2 list-none">
            <li className="">{data?.address}</li>
            <li>{data?.date_working}</li>
            <li>
              {data?.fields_info?.length > 0 &&
                data?.fields_info?.map((item: any) => (
                  <div className="mr-2">{item.name}</div>
                ))}
            </li>
          </ul>
        </div>
        <NavLink
          to={`/recruiter/${data?._id}`}
          className="text-sm flex items-center justify-center text-primary text-underline whitespace-nowrap pt-2 text-center cursor-pointer">
          {`Xem trang công ty`}
        </NavLink>
      </div>
    </div>
  );
};

export default MyCardjobCompany;
