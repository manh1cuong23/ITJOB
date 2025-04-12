import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import { ReactComponent as MailSvg } from '@/assets/icons/basil--gmail-outline.svg';
import { ReactComponent as PlaceSvg } from '@/assets/icons/ic--outline-place.svg';
import { ReactComponent as PhoneSvg } from '@/assets/icons/mdi-light--phone.svg';
import { ReactComponent as CalendearSvg } from '@/assets/icons/ic_calendar.svg';
import { getLableSingle } from '@/utils/helper';
import { educationLevels, levels } from '@/constants/job';

interface Props {
  data?: any;
  isShowJob?: boolean;
}

const BackgroundCandidate: React.FC<Props> = ({ data, isShowJob = false }) => {
  console.log('data', data);
  return (
    <div className="">
      <h1 className="ml-[20px] text-[16px] text-[#2f4ba0] mb-2">
        <span className="text-gray-500 text-[15px]">Vị trí: </span>{' '}
        {data?.feature_job_position}
      </h1>

      <div className="flex gap-[60px] ml-[20px] ">
        <div className="flex flex-col flex-1">
          <div>
            <h1 className="font-medium ">{data?.candidate_info?.name}</h1>
          </div>
          <div className="flex my-1 gap-[10px] items-center ml-2">
            <MailSvg />
            <p>{data?.name}</p>
          </div>
          <div className="flex my-1 gap-[10px] items-center ml-2">
            <MailSvg />
            <p>{data?.email}</p>
          </div>

          <div className="flex my-1 gap-[10px] items-center ml-2">
            <PhoneSvg />
            <p>{data?.phone_number}</p>
          </div>
          <div className="flex my-1 gap-[10px] items-center ml-2">
            <CalendearSvg />
            <p>23/12/2003</p>
          </div>
        </div>
        <div className="flex flex-col w-1/2">
          <h1 className="font-medium ">Địa chỉ</h1>
          <div className="flex gap-[10px] items-center ml-2">
            <PlaceSvg />
            <p>{data?.address}</p>
          </div>
          <h1 className="font-medium ">Học vấn</h1>
          <div className="flex gap-[10px] items-center ml-2">
            <MailSvg />
            <p>{getLableSingle(data?.education, educationLevels)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundCandidate;
