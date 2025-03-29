import React from 'react';
import { MyButton } from '@/components/basic/button';
import {
  CloseOutlined,
  DownOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';

const InputSelectPlace: React.FC = () => {
  return (
    <div className="h-[42px] !border-none !outline-none flex items-center gap-[6px] px-4 justify-between">
      <EnvironmentOutlined className="mr-4" />
      <div className="flex items-center">
        <MyButton buttonType="outline" children="Hà Nội" shape="round" />
        <MyButton buttonType="outline" children="Hà Nội" shape="round" />
      </div>
      <div className="ml-4 flex items-center gap-[8px]">
        <Button
          className="h-[24px] !w-[24px] rounded-full p-0"
          // shape="round"
          icon={<CloseOutlined className="h-[10px] w-[10px]" />}
        />
        <DownOutlined />
      </div>
      {/* <UpOutlined /> */}
    </div>
  );
};

export default InputSelectPlace;
