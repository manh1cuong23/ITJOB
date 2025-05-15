import React, { ReactNode } from 'react';
import './style.less';
import MyTag from '../tags/tag';
import { cities, experienceLevels, levels } from '@/constants/job';
import { Navigate, NavLink } from 'react-router-dom';
import { formatCurrency } from '@/utils/helper';
import { formatDateNew } from '@/utils/formatDate';
interface MyCardProps {
  title?: string | ReactNode;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  data?: any;
}

const MyCardjob: React.FC<MyCardProps> = ({
  title,
  children,
  className = '',
  style,
  data,
}) => {
  console.log('cdata', data);
  // const level =
  return (
    <NavLink to={`/${data?._id}/job-detail`}>
      <div className=" mb-6 flex rounded border border-solid transition-all hover:shadow-md border-primary p-[16px] bg-[rgb(254,238,235)] p-[16px]">
        <div className="w-[140px] h-[120px] flex items-center justify-center bg-white">
          <img
            className="w-[80px] h-[80px]"
            src={
              data?.employer_info?.avatar ||
              'https://img.freepik.com/free-vector/contact-icon-3d-vector-illustration-blue-button-with-user-profile-symbol-networking-sites-apps-cartoon-style-isolated-white-background-online-communication-digital-marketing-concept_778687-1715.jpg'
            }
          />
        </div>
        <div className="px-4 flex-1">
          <div className=" border-b-2 pb-4 ">
            <h2 className="text-lg font-bold text-primary">{data?.name}</h2>
            <h2 className="text-gray-600 text-base my-1">
              {data?.employer_info.name}
            </h2>
            <div className="flex gap-[12px]  mt-1">
              <p className="text-sm text-primary">{`Mức lương từ ${formatCurrency(
                data?.salary[0]
              )} đến ${formatCurrency(data?.salary[1])}`}</p>
              <p className="text-sm text-gray-500">-</p>
              <p className="text-sm text-gray-500">{`    ${levels
                .filter((item: any) => item.value == data.level)
                .map((item: any) => item.label)}`}</p>
            </div>
            <p className="text-gray-500 text-base py-2">
              {cities.find((item: any) => item.value == data.city)?.label}
            </p>
            <ul className="text-base text-gray-600  pl-[10px] mt-2">
              <li className="">
                Số lượng tuyển dụng:{' '}
                <span className="text-black text-[14px] ml-2">
                  {data?.num_of_employees}
                </span>
              </li>
              <li>
                Kinh nghiệm:
                <span className="text-black text-[14px] ml-2">
                  {
                    experienceLevels.find(
                      (item: any) => item.value == data.year_experience
                    )?.label
                  }
                </span>
              </li>
            </ul>
          </div>
          <div className="flex justify-between mt-2">
            <div>
              {data?.skills_info?.length > 0 &&
                data?.skills_info?.map((item: any, index: number) => (
                  <MyTag title={item?.name} className="mr-2" />
                ))}
            </div>
            <span className="text-sm text-gray-400 whitespace-nowrap py-2">
              {formatDateNew(data?.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default MyCardjob;
