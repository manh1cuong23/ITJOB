import React, { ReactNode } from 'react';
import './style.less';
import MyTag from '../tags/tag';
interface MyCardProps {
  title?: string | ReactNode;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CardMiniCompany: React.FC<MyCardProps> = ({
  title,
  children,
  className = '',
  style,
}) => {
  const dataitem = {
    nameJob: 'Senior Bussiness Analyt',
    img: 'https://salt.topdev.vn/7kUrThD-rbfujjLNFpGIM1ZWxi0imMeQciVOpaKyfwo/fit/384/1000/ce/1/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI0LzEwLzE1L1RvcERldi1MT0dPLS0tUHJpbWUtVGVjaC1IUi1BZG1pbi0xNzI4OTgwNzkzLmpwZw',
    nameCompany: 'PRIME TECH SOLUTION ',
    salary: '1600 USD',
    position: 'Senior',
    address: 'Quận Gò Vấp, Hồ Chí Minh',
  };
  return (
    <div className="p-2 flex gap-[16px] border border-solid bg-white transition-all border-[rgb(229,229,229] hover:shadow-md ">
      <div className="w-[80px] h-[100px] flex items-center justify-center bg-white">
        <img className="w-[80px] h-[80px]" src={dataitem.img} />
      </div>
      <div className="flex  flex-col justify-center">
        <h2 className="text-lg font-bold mb-2 transition hover:text-primary">
          {dataitem.nameJob}
        </h2>
        <h2 className="text-gray-600 text-sm ">{dataitem.nameCompany}</h2>
        <div className="mt-1">
          <MyTag className="text-blue" title="Java" />
          <MyTag className="text-blue" title="Java" />
          <MyTag className="text-blue" title="Java" />
        </div>
      </div>
    </div>
  );
};

export default CardMiniCompany;
