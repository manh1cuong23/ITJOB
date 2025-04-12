import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import { ReactComponent as MailSvg } from '@/assets/icons/basil--gmail-outline.svg';
import { ReactComponent as PlaceSvg } from '@/assets/icons/ic--outline-place.svg';
import { ReactComponent as PhoneSvg } from '@/assets/icons/mdi-light--phone.svg';
import { ReactComponent as CalendearSvg } from '@/assets/icons/ic_calendar.svg';
import { Link } from 'react-router-dom';

interface Props {
  data?: any;
  isShowJob?: boolean;
}

const InterviewInfo: React.FC<Props> = ({ data, isShowJob = false }) => {
  console.log('data', data);
  return (
    <div className="">
      <div className="flex flex-col">
        <h1 className="font-medium ">Địa điểm phỏng vấn</h1>
        <div className="flex gap-[10px] items-center ml-2">
          <PlaceSvg />
          {/* <p>Tại công ty</p> */}
          <Link to="https://meet.google.com/mqa-ohnh-agm?pli=1" target="_blank">
            Meet
          </Link>
        </div>
        <h1 className="font-medium ">Thời gian</h1>
        <div className="flex gap-[10px] items-center ml-2">
          <CalendearSvg />
          <p>14:00 12-12-2003</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewInfo;
