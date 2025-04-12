import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { MyButton } from '@/components/basic/button';
import { SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import InputSelectPlace from './InputSelectPlace';
import FilterSearchDashBoard from '../filterSearch-dashboard/FilterSearchDashBoard';
import { MyFormItem } from '@/components/basic/form-item';
interface Props {
  handleSeach?: (data: any) => void;
}
const InputSearchDashBoard: React.FC<Props> = ({ handleSeach }) => {
  const [form] = Form.useForm();
  const handleClick = async () => {
    const data = await form.validateFields();

    console.log('data', data);
    handleSeach && handleSeach(data);
  };
  return (
    <div className="mx-auto w-[1260px]">
      <Form form={form}>
        <div className="w-100 h-[72px] rounded-lg text-center bg-white  flex justify-between items-center px-[16px] py-[8px] gap-x-[16px]">
          <div>
            <MyButton
              className="!h-[50px]  !text-8xl"
              icon={<UnorderedListOutlined className="!text-[16px]" />}>
              <p className="!text-[16px]">Bộ lọc</p>
            </MyButton>
          </div>
          <div className="border-l w-1/2 flex-1 ">
            <MyFormItem name="key">
              <Input
                name="key"
                placeholder="Vị trí tuyển dụng, tên công ty"
                className="h-[42px]  !border-none !outline-none "
              />
            </MyFormItem>
          </div>
          <MyButton
            onClick={handleClick}
            className="!h-[50px]  !text-8xl"
            icon={<SearchOutlined className="!text-[16px]" />}>
            <p className="!text-[16px]">Tìm kiếm</p>
          </MyButton>
        </div>
        <FilterSearchDashBoard />
      </Form>
    </div>
  );
};

export default InputSearchDashBoard;
