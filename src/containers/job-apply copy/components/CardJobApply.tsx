import { DownOutlined, EditOutlined, RightOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ReactComponent as DolasSvg } from '@/assets/icons/ic_dollar.svg';
import { MyButton } from '@/components/basic/button';
export default function CardJobApply() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white px-4 py-6 flex justify-between mt-[10px]">
      <div className="flex items-center gap-[16px]">
        <img
          className="w-[80px] h-[80px] object-cover rounded-base"
          src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMzhxREE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--96410be9fc35379f21c6201ae00c2d6c44be6feb/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcGFXbHAiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--20b0435834affc851fb8b496383cefc8135158a8/goline-corporation-logo.jpg"
        />
        <div>
          <h1 className="text-[17px] font-bold text-[#626262]">
            React js developer
          </h1>
          <h1 className="text-[15px] font-medium mt-2">Goline Coroption</h1>
          <h1 className="text-[15px] text-[#a6a6a6]">Hà Nội</h1>
          <div className="text-[16px] font-bold mt-1 text-[#0ab305] flex gap-[16px] items-center">
            <DolasSvg className="text-[#0ab305]" />
            <h1>5 - 10 triệu</h1>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-[14px] text-black">Lời mời vào ngày 25-09-2025</h1>
        <div className="mt-2">
          <MyButton>Xác nhận</MyButton>
          <MyButton buttonType="secondary">Từ chối</MyButton>
        </div>
      </div>
    </div>
  );
}
