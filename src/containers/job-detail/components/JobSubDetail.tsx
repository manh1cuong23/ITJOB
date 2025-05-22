import React, { useEffect, useState } from 'react';
import InforJob from './InforJob';
import MyTag from '@/components/basic/tags/tag';
import MyCardjobBasic from '@/components/basic/card/CardjobBasic';
import { MyButton } from '@/components/basic/button';
import {
  cities,
  educationLevels,
  experienceLevels,
  genders,
  levels,
} from '@/constants/job';
import { ReactComponent as ChildSvg } from '@/assets/icons/mdi--user-outline.svg';
import { ReactComponent as DateSvg } from '@/assets/icons/uil--calender.svg';
import { ReactComponent as UserSvg } from '@/assets/icons/ic_profile_update.svg';
import { ReactComponent as BagSvg } from '@/assets/icons/material-symbols--experiment-outline.svg';
import { ReactComponent as EducatiponSvg } from '@/assets/icons/mdi--education-outline.svg';
import { ReactComponent as PlaceSvg } from '@/assets/icons/ic--outline-place.svg';
import { ReactComponent as GenderSvg } from '@/assets/icons/mdi-light--gender-male.svg';
import { formatCurrency, getLabelsFromOptions } from '@/utils/helper';
import ApplyJobModal from '@/components/business/modal/apply-job';
import { formatDateNew } from '@/utils/formatDate';
import { MyCardjob } from '@/components/basic/card';

interface Props {
  data: any;
  isApply?: boolean;
  setForceUpdate: any;
  listJob?: any;
}
const JobSubDetail: React.FC<Props> = ({
  data,
  listJob,
  isApply,
  setForceUpdate,
}) => {
  const [open, setOpen] = useState(false);

  let datak: any = [];
  if (data && data) {
    datak = [
      {
        title: 'Vị trí',
        description: levels.find((item, index) => item.value == data.level)
          ?.label,
        Icon: EducatiponSvg,
      },
      {
        title: 'Hạn nộp',
        description: formatDateNew(data?.deadline),
        Icon: DateSvg,
      },
      {
        title: 'Số lượng tuyển',
        description: data?.num_of_employees,
        Icon: ChildSvg,
      },
      {
        title: 'Giới tính',
        description: getLabelsFromOptions(genders, data?.gender).join(', '),
        Icon: GenderSvg,
      },
      {
        title: 'Kinh nghiệm',
        description: experienceLevels.find(
          (item, index) => item.value == data.year_experience
        )?.label,
        Icon: BagSvg,
      },
      {
        title: 'Bằng Cấp',
        description: educationLevels.find(
          (item, index) => item.value == data.education
        )?.label,
        Icon: EducatiponSvg,
      },
      {
        title: 'Nơi làm việc',
        description: getLabelsFromOptions(cities, data?.city).join(', '),
        Icon: PlaceSvg,
      },
      {
        title: 'Lĩnh Vực',
        description: data?.fields_info
          ? data?.fields_info.map((item: any) => item.name).join(', ')
          : '',
        Icon: ChildSvg,
      },
    ];
  }

  return (
    <div className="w-2/3 rounded-md">
      <div className="mr-4 bg-white">
        <img
          className="w-full h-[200px] object-cover"
          src={
            data?.background ||
            data?.employer_info?.cover_photo ||
            'https://salt.topdev.vn/75VadizXM8hmNkdG26qUXYwIAVX3KcVcqvehkraKrMQ/fit/828/1000/ce/1/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzAyLzIwL1RvcERldi1hN2UyZmMyZmE5Y2IyOGQzZDMyM2Y2ODgyNDIxNDU3OS0xNzQwMDQ0NzQyLnBuZw'
          }
        />

        <div>
          <div className="flex items-center gap-[16px] p-[16px] border-b">
            <img
              className="w-[50px] h-[50px] object-contain border"
              src={
                data?.employer_info?.avatar ||
                'https://vawr.vn/images/logo-google.png'
              }
            />
            <div>
              <h1 className="text-[22px] font-medium">{data?.name}</h1>
              <p className="!mt-2 text-[18px]">
                {data?.salary &&
                  `${
                    formatCurrency(data?.salary[0]) +
                    ' - ' +
                    formatCurrency(data?.salary[1])
                  }`}
              </p>
            </div>
            <MyButton
              className="w-[200px] !h-[50px] mx-auto"
              disabled={isApply}>
              <div
                className="text-[18px]"
                onClick={() => {
                  setOpen(true);
                }}>
                {isApply ? 'Đã ứng tuyển' : 'Ứng tuyển'}
              </div>
            </MyButton>
          </div>
          <div className=" p-[16px] border-b">
            <h1 className="text-[22px] font-medium">Thông tin tuyển dụng</h1>
            <div className="flex flex-wrap ">
              {datak &&
                datak.length > 0 &&
                datak.map((item: any, index: number) => (
                  <div key={index} className="w-1/3">
                    <InforJob
                      title={item.title}
                      Icon={item.Icon}
                      description={item.description}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className=" p-[16px] border-b">
            <h1 className="text-[22px] font-medium">Mô tả công việc</h1>
            <div dangerouslySetInnerHTML={{ __html: data?.description }} />
          </div>
          <div className=" p-[16px] border-b">
            <h1 className="text-[22px] font-medium">Kỹ Năng</h1>
            <div className="my-4">
              {data?.skills_info &&
                data?.skills_info.map((item: any) => (
                  <MyTag title={item.name} className="mr-2" />
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mr-4">
        <h1 className="text-[22px] font-medium mt-4 mb-2">Việc làm tương tự</h1>
        {listJob?.map((item: any, index: number) => (
          <MyCardjob key={index} data={item} />
        ))}
      </div>
      <ApplyJobModal
        title={`Ứng tuyển vị trí ${data?.name}`}
        setForceUpdate={setForceUpdate}
        id={data?._id}
        open={open}
        setOpen={setOpen}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};

export default JobSubDetail;
