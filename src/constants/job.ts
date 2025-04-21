import { Option } from '@/components/basic/select/SingleSelectSearchCustom';

export const levels: Option[] = [
  { label: 'Intern', value: 0 },
  { label: 'Fresher', value: 1 },
  { label: 'Junior', value: 2 },
  { label: 'Middle', value: 3 },
  { label: 'Senior', value: 4 },
  { label: 'Lead', value: 5 },
];

export const educationLevels: Option[] = [
  { label: 'HighSchool', value: 0 },
  { label: 'College', value: 1 },
  { label: 'University', value: 2 },
  { label: 'Master', value: 3 },
  { label: 'Doctor', value: 4 },
];

export const experienceLevels: Option[] = [
  { label: 'Dưới 1 năm', value: 0 },
  { label: '1 - 3 năm', value: 1 },
  { label: '3 - 5 năm', value: 2 },
  { label: '5 - 10 năm', value: 3 },
  { label: 'Hơn 10 năm', value: 4 },
];
export const genders: Option[] = [
  { label: 'Nam', value: 1 },
  { label: 'Nư', value: 2 },
];
export const jobTypes: Option[] = [
  { label: 'FullTime', value: 0 },
  { label: 'PartTime', value: 1 },
  { label: 'Remote', value: 2 },
  { label: 'Hybrid', value: 3 },
];
export const cities: Option[] = [
  { label: 'Hà Nội', value: 1 },
  { label: 'TP Hồ Chí Minh', value: 2 },
  { label: 'Đà Nẵng', value: 3 },
  { label: 'Hải Phòng', value: 4 },
  { label: 'Cần Thơ', value: 5 },
  { label: 'Bình Dương', value: 6 },
  { label: 'Đà Lạt', value: 7 },
  { label: 'Nha Trang', value: 8 },
  { label: 'Quy Nhơn', value: 9 },
];
export const jobStatusOptions: Option[] = [
  { label: 'Đã tạo', value: 0 },
  { label: 'Đang tuyển', value: 1 },
  { label: 'Dừng tuyển', value: 2 },
];

export const interviewsStatus: Option[] = [
  { label: 'Chưa xem', value: 0 },
  { label: 'Xác nhận', value: 1 },
  { label: 'Từ chối', value: 2 },
];

export const englishSkillOptions: Option[] = [
  { label: 'Không biết', value: 0 },
  { label: 'Cơ bản', value: 1 },
  { label: 'Giao tiếp', value: 2 },
  { label: 'Khá', value: 3 },
  { label: 'Tốt', value: 4 },
  { label: 'Thành thạo', value: 5 },
];

export const JobStatusOptions = [
  { label: 'Khởi tạo', value: 0 },
  { label: 'Đang tuyển dụng', value: 1 },
  { label: 'Đã dừng', value: 2 },
];

export enum ApplyStatus {
  Pending,
  Approved,
  Interview,
  Rejected,
  Canceled,
  Passed,
  Failed,
  CandidateRejectInvite,
  CandidateAcceptInvite,
  WaitingCandidateAcceptSchedule,
  WaitingEmployerAcceptSchedule,
  WaitingCandidateAcceptInvite,
}

export const applyStatusOptions: { label: string; value: number }[] = [
  { label: 'Mới', value: ApplyStatus.Pending },
  { label: 'Phù hợp', value: ApplyStatus.Approved },
  { label: 'Phỏng vấn', value: ApplyStatus.Interview },
  { label: 'Từ chối', value: ApplyStatus.Rejected },
  { label: 'Đã huỷ', value: ApplyStatus.Canceled },
  { label: 'Đậu', value: ApplyStatus.Passed },
  { label: 'Rớt', value: ApplyStatus.Failed },
  {
    label: 'Ứng viên từ chối lời mời',
    value: ApplyStatus.CandidateRejectInvite,
  },
  {
    label: 'Ứng viên chấp nhận lời mời',
    value: ApplyStatus.CandidateAcceptInvite,
  },
  {
    label: 'Chờ ứng viên xác nhận lịch',
    value: ApplyStatus.WaitingCandidateAcceptSchedule,
  },
  {
    label: 'Chờ nhà tuyển dụng xác nhận lịch',
    value: ApplyStatus.WaitingEmployerAcceptSchedule,
  },
  {
    label: 'Chờ ứng viên xác nhận lời mời',
    value: ApplyStatus.WaitingCandidateAcceptInvite,
  },
];

export const OtOption = [
  { label: 'Có làm thêm ngoài giờ', value: 1 },
  { label: 'Không làm thêm ngoài giờ', value: 0 },
];
