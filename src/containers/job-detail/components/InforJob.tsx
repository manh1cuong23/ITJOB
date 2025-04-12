import { title } from 'process';
import React, { useEffect, useState } from 'react';
interface Props {
  title?: string;
  description?: string;
  Icon?: any;
}
const InforJob: React.FC<Props> = ({ title, description, Icon }) => {
  return (
    <div className="flex items-center m-4 gap-[16px]">
      <div className="w-[20px] h-[20px] border bg-gray-100 flex rounded-full items-center justify-center">
        {Icon && <Icon className="w-[16px] h-[16px] text-primary" />}
      </div>
      <div>
        <h1 className="text-[#ccc] text-[13px]">{title || 'Vị trí'}</h1>
        <h1 className="text-[15px]">{description || 'Nhân viên'}</h1>
      </div>
    </div>
  );
};

export default InforJob;
