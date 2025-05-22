import ResultInterview from '@/components/business/modal/apply-result/ResultInterview';
import BookInterviewModal from '@/components/business/modal/book-interview/BookInterviewModal';
import { ApplyStatus } from '@/constants/job';
import { Tag } from 'antd';
import { useState } from 'react';

interface Option {
  label: string;
  value: number;
}

interface StatusTagProps {
  value: number;
  statusColorMap: Record<number, string>;
  statusOptions: Option[];
  id: string;
  dataSuggest?: any;
  setForceUpdate: any;
  name?: any;
}

const StatusTag: React.FC<StatusTagProps> = ({
  value,
  dataSuggest,
  statusColorMap,
  name,
  statusOptions,
  setForceUpdate,
  id,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openResult, setOpenResult] = useState<boolean>(false);
  const color = statusColorMap[value];
  const label =
    statusOptions.find(option => option.value === value)?.label || 'Không rõ';

  return (
    <div className="">
      <Tag
        style={{
          color,
          backgroundColor: `${color}20`,
          borderColor: color,
          fontWeight: 500,
          padding: '4px 12px',
          borderRadius: '8px',
        }}>
        {label}
      </Tag>
      {value == ApplyStatus.Approved && (
        <div className="pt-2" onClick={() => setOpen(true)}>
          <a className="text-underline  hover:underline">Tạo cuộc phỏng vấn</a>
        </div>
      )}
      {dataSuggest && value == ApplyStatus.WaitingEmployerAcceptSchedule && (
        <div className="pt-2" onClick={() => setOpen(true)}>
          <a className="text-underline  hover:underline">
            Gợi ý phỏng vấn của ứng viên
          </a>
        </div>
      )}
      {value == ApplyStatus.Interview && (
        <div className="pt-2" onClick={() => setOpenResult(true)}>
          <a className="text-underline  hover:underline">
            Đánh giá kết quả phỏng vấn
          </a>
        </div>
      )}
      <BookInterviewModal
        setForceUpdate={setForceUpdate}
        isEmployerCreate={value == ApplyStatus.Approved}
        id={id}
        open={open}
        title={
          ApplyStatus.Approved
            ? 'Hẹn lịch phỏng vấn'
            : 'Gợi ý phỏng vấn của ứng viên'
        }
        isViewMode={
          value == ApplyStatus.WaitingCandidateAcceptSchedule ||
          value == ApplyStatus.WaitingEmployerAcceptSchedule
        }
        onCancel={() => {
          setOpen(false);
        }}
      />
      <ResultInterview
        setForceUpdate={setForceUpdate}
        id={id}
        open={openResult}
        title="Gợi ý phỏng vấn của ứng viên"
        isViewMode={true}
        name={name}
        onCancel={() => {
          setOpenResult(false);
        }}
      />
    </div>
  );
};

export default StatusTag;
