import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import { ReactComponent as MailSvg } from '@/assets/icons/basil--gmail-outline.svg';
import { ReactComponent as PlaceSvg } from '@/assets/icons/ic--outline-place.svg';
import { ReactComponent as PhoneSvg } from '@/assets/icons/mdi-light--phone.svg';
import { ReactComponent as CalendearSvg } from '@/assets/icons/ic_calendar.svg';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@/utils/formatDate';

interface Props {
  data2?: any;
}

const InterviewInfo: React.FC<Props> = ({ data2 }) => {
  const isObjectNotEmpty = (obj: any) =>
    obj &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    Object.keys(obj).length > 0;

  const hasFinalSchedule = isObjectNotEmpty(data2?.interview_final_schedule);
  const hasSuggestSchedule = isObjectNotEmpty(
    data2?.interview_employee_suggest_schedule
  );

  // Chọn theo ưu tiên: nếu có final_schedule thì lấy, ngược lại lấy suggest_schedule
  const data = hasFinalSchedule
    ? data2.interview_final_schedule
    : hasSuggestSchedule
    ? data2.interview_employee_suggest_schedule
    : null;
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
