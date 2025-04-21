import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import { ReactComponent as MailSvg } from '@/assets/icons/basil--gmail-outline.svg';
import { ReactComponent as PlaceSvg } from '@/assets/icons/ic--outline-place.svg';
import { ReactComponent as PhoneSvg } from '@/assets/icons/mdi-light--phone.svg';
import { ReactComponent as CalendearSvg } from '@/assets/icons/ic_calendar.svg';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@/utils/formatDate';

interface Props {
  data?: any;
}

const InterviewInfo: React.FC<Props> = ({ data }) => {
  return (
    <div className="">
      <div className="flex flex-col">
        <h1 className="font-medium ">Địa điểm phỏng vấn</h1>
        <div className="flex gap-[10px] items-center ml-2">
          <PlaceSvg />
          {data?.address}
          <Link to={data?.address} target="_blank">
            Meet
          </Link>
        </div>
        <h1 className="font-medium ">Thời gian</h1>
        <div className="flex gap-[10px] items-center ml-2">
          <CalendearSvg />
          <p>{formatDateTime(data?.date)}</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewInfo;
