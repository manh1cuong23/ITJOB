import React from 'react';
import {
  DownOutlined,
  FacebookOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { MyButton } from '@/components/basic/button';
import CardJobRec from '@/components/basic/card/CardJobRec';
import MyTag from '@/components/basic/tags/tag';
interface Props {}
const gioithie = [
  {
    title: 'Mô hình công ty',
    descriptiopn: 'Dịch vụ tư vấn giải đáp',
  },

  {
    title: 'Lĩnh vực công ty',
    descriptiopn: 'Dịch vụ và tư vấn công ty',
  },
  {
    title: 'Quy mô công ty',
    descriptiopn: '300 - 500 người',
  },
  {
    title: 'Địa chỉ',
    descriptiopn: 'Hoàng Mai, Hà Nội',
  },
  {
    title: 'Thời gian làm việc',
    descriptiopn: 'Thứ 2- Thứ 6',
  },
  {
    title: 'làm việc ngoài giờ',
    descriptiopn: 'Không có OT',
  },
];
const RecruiterContainer: React.FC<Props> = ({}) => (
  <div className="">
    <div className=" mt-[20px] mx-auto w-[1260px]">
      <div className="flex  gap-[40px] bg-white">
        <div className="flex items-center p-4 gap-[20px] flex-1 ">
          <img
            className="w-[160px] h-[160px] object-contain rounded-sm border"
            src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMGdvREE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--49f107dff1850ed1ff3ede3c7e0a1b99659f1d83/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcEFhb3ciLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--bb0ebae071595ab1791dc0ad640ef70a76504047/elca-logo.jpg "
          />
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-[28px]">ELCA</h1>
            <div className="flex items-center gap-[16px]">
              <div>
                <p className="text-[14px]">Quận Bình Thạnh, TP Hồ Chí Minh</p>
              </div>
              <div>
                <p className="text-[14px]">3 việc làm đang tuyển dụng</p>
              </div>
            </div>
            <div>
              <MyButton className="w-[160px] !h-[50px]">
                <p className="text-[14px]">Viết đánh giá</p>
              </MyButton>
              <MyButton buttonType="outline" className="w-[160px] !h-[50px]">
                <p className="text-[14px]">Theo dõi</p>
              </MyButton>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="mt-[20px]  w-2/3">
          <div className="bg-white px-4 flex items-center">
            <div className="px-2 py-[24px] mr-4">
              <h1 className="text-[16px] font-bold text-primary">Giới thiệu</h1>
            </div>
            <div className="px-2 py-4 mr-4">
              <h1 className="text-[16px] font-bold ">Đánh giá</h1>
            </div>
            <div className="px-2 py-4 mr-4">
              <h1 className="text-[16px] font-bold ">Giới thiệu</h1>
            </div>
          </div>
          <div className="mt-4 bg-white px-4  py-4">
            <h1 className="font-bold text-[24px] pb-4 border-b">
              Thông tin chung
            </h1>
            <div className="mt-4 flex flex-wrap">
              {gioithie.map((item, index) => (
                <div className="w-1/3">
                  <div className="m-2">
                    <h1 className=" text-[14px] text-gray-600">{item.title}</h1>
                    <h1 className=" text-[16px] text-black">
                      {item.descriptiopn}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-white px-4 py-4">
            <h1 className="font-bold text-[24px] pb-4 border-b">
              Giới thiệu công ty
            </h1>
            <h1 className="text-[16px] text-black mt-4 text-justify pb-4 border-b">
              ELCA is a leading Swiss Information Technology Services Company 57
              years of global history, 27 years of growth in Vietnam, 9
              countries, 2200+ experts. Since 1998, our Vietnam team of
              engineers, business analysts, software architects, designers, and
              consultants have provided tailor-made and standardized solutions
              to support the digital transformation of customers in Switzerland.
              Our activity spans across multiple fields of leading-edge
              technologies. Our offices are now in Switzerland (Pully
              (headquarters), Zurich, Geneva, Bern, Basel), France (Paris), UK
              (London), Spain (Madrid, Granada), Mauritius (Saint-Pierre), Italy
              (Palermo, Bolzano), and Vietnam (Ho Chi Minh City).
            </h1>
            <div className="py-4">
              <div className="flex items-center justify-center py-2 horver:bg-red-500 gap-[2px] text-[#0e2eed] border w-[200px]">
                <FacebookOutlined className="text-[16px]" />
                <h1 className="text-center text-[16px]  font-bold">
                  Website công ty
                </h1>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white px-4  py-4">
            <h1 className="font-bold text-[24px] pb-4 border-b">Chuyên môn</h1>
            <div className="mt-4">
              <h1 className="text-[16px] font-medium">Our key skills</h1>
              <div className="flex gap-[16px] mt-4">
                <MyTag title="Java" />
                <MyTag title="Java" />
                <MyTag title="Java" />
                <MyTag title="Java" />
                <MyTag title="Java" />
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white px-4  py-4">
            <h1 className="font-bold text-[24px] pb-4 border-b">
              Tại sao bạn thích làm ở đây
            </h1>
            <div className="mt-4">
              <h1 className="text-[16px] font-medium">Our key skills</h1>
              <div className="flex gap-[16px] mt-4">
                <MyTag title="Java" />
                <MyTag title="Java" />
                <MyTag title="Java" />
                <MyTag title="Java" />
                <MyTag title="Java" />
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white px-4  py-4">
            <h1 className="font-bold text-[24px] pb-4 border-b">Địa điểm</h1>
            <div className="mt-4">
              <h1 className="text-[16px] font-medium">Our key skills</h1>
              <div className="flex gap-[16px] mt-4">
                <MyTag title="Java" />
                <MyTag title="Java" />
                <MyTag title="Java" />
                <MyTag title="Java" />
                <MyTag title="Java" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3 mt-[20px]">
          <div className="ml-4">
            <h1 className="text-[22px] font-bold">
              3 Việc làm đang tuyển dụng
            </h1>
            <div className="mt-[20px] h-[600px] overflow-auto">
              <div className="mb-[16px]">
                <CardJobRec />
              </div>
              <div className="mb-[16px]">
                <CardJobRec />
              </div>
              <div className="mb-[16px]">
                <CardJobRec />
              </div>
              <div className="mb-[16px]">
                <CardJobRec />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default RecruiterContainer;
