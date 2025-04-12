import React, { ReactNode } from 'react';
import './style.less';
import MyTag from '../tags/tag';
interface MyCardProps {
  title?: string | ReactNode;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const MyCardjobBasic: React.FC<MyCardProps> = ({
  title,
  children,
  className = '',
  style,
}) => {
  const dataitem = {
    nameJob: 'Senior Bussiness Analyt',
    img: 'https://salt.topdev.vn/7kUrThD-rbfujjLNFpGIM1ZWxi0imMeQciVOpaKyfwo/fit/384/1000/ce/1/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI0LzEwLzE1L1RvcERldi1MT0dPLS0tUHJpbWUtVGVjaC1IUi1BZG1pbi0xNzI4OTgwNzkzLmpwZw',
    nameCompany: 'PRIME TECH SOLUTION COMPANY LIMITED',
    salary: '1600 USD',
    position: 'Senior',
    address: 'Quận Gò Vấp, Hồ Chí Minh',
  };
  return (
    <div className=" my-2 flex rounded cursor-pointer border border-solid transition-all hover:shadow-md border-primary p-[16px] bg-[rgb(254,238,235)] p-[16px] w-full">
      <div className="w-[140px] h-[120px] flex items-center justify-center bg-white">
        <img className="w-[80px] h-[80px]" src={dataitem.img} />
      </div>
      <div className="px-4 flex-1">
        <div className=" border-b-2 pb-4 ">
          <h2 className="text-lg font-bold text-primary">{dataitem.nameJob}</h2>
          <h2 className="text-gray-600 text-base my-1">
            {dataitem.nameCompany}
          </h2>
          <div className="flex gap-[12px]  mt-1">
            <p className="text-sm text-primary">
              {`Lên tới ${dataitem.salary}`}
            </p>
            <p className="text-sm text-gray-500">-</p>
            <p className="text-sm text-gray-500">{`    ${dataitem.position}`}</p>
          </div>
          <p className="text-gray-500 text-base">{dataitem.address}</p>
          <ul className="text-base text-gray-600  pl-[10px] mt-2">
            <li className="">
              - Salary: Up to 4.000 USD depending on experience and
              qualifications.{' '}
            </li>
            <li>
              - Attractive and competitive salary and bonus schemes in the
              market.{' '}
            </li>
          </ul>
        </div>
        <div className="flex justify-between mt-2">
          <div>
            <MyTag title="SQL" />
            <MyTag title="SQL" />
            <MyTag title="SQL" />
            <MyTag title="SQL" />
          </div>
          <span className="text-sm text-gray-400 whitespace-nowrap py-2">
            Đăng 12h trước
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyCardjobBasic;
