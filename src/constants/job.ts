import { Option } from '@/components/basic/select/SingleSelectSearchCustom';
import { TypeUser } from '@/interface/common/type';

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

export enum JobStatus {
  Created,
  Recuriting,
  Stopped,
}

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
  { label: 'An Giang', value: 1 },
  { label: 'Bà Rịa - Vũng Tàu', value: 2 },
  { label: 'Bắc Giang', value: 3 },
  { label: 'Bắc Kạn', value: 4 },
  { label: 'Bạc Liêu', value: 5 },
  { label: 'Bắc Ninh', value: 6 },
  { label: 'Bến Tre', value: 7 },
  { label: 'Bình Dương', value: 8 },
  { label: 'Bình Định', value: 9 },
  { label: 'Bình Phước', value: 10 },
  { label: 'Bình Thuận', value: 11 },
  { label: 'Cà Mau', value: 12 },
  { label: 'Cao Bằng', value: 13 },
  { label: 'Cần Thơ', value: 14 },
  { label: 'Đà Nẵng', value: 15 },
  { label: 'Đắk Lắk', value: 16 },
  { label: 'Đắk Nông', value: 17 },
  { label: 'Điện Biên', value: 18 },
  { label: 'Đồng Nai', value: 19 },
  { label: 'Đồng Tháp', value: 20 },
  { label: 'Gia Lai', value: 21 },
  { label: 'Hà Giang', value: 22 },
  { label: 'Hà Nam', value: 23 },
  { label: 'Hà Nội', value: 24 },
  { label: 'Hà Tĩnh', value: 25 },
  { label: 'Hải Dương', value: 26 },
  { label: 'Hải Phòng', value: 27 },
  { label: 'Hậu Giang', value: 28 },
  { label: 'Hòa Bình', value: 29 },
  { label: 'Hưng Yên', value: 30 },
  { label: 'Khánh Hòa', value: 31 },
  { label: 'Kiên Giang', value: 32 },
  { label: 'Kon Tum', value: 33 },
  { label: 'Lai Châu', value: 34 },
  { label: 'Lâm Đồng', value: 35 },
  { label: 'Lạng Sơn', value: 36 },
  { label: 'Lào Cai', value: 37 },
  { label: 'Long An', value: 38 },
  { label: 'Nam Định', value: 39 },
  { label: 'Nghệ An', value: 40 },
  { label: 'Ninh Bình', value: 41 },
  { label: 'Ninh Thuận', value: 42 },
  { label: 'Phú Thọ', value: 43 },
  { label: 'Phú Yên', value: 44 },
  { label: 'Quảng Bình', value: 45 },
  { label: 'Quảng Nam', value: 46 },
  { label: 'Quảng Ngãi', value: 47 },
  { label: 'Quảng Ninh', value: 48 },
  { label: 'Quảng Trị', value: 49 },
  { label: 'Sóc Trăng', value: 50 },
  { label: 'Sơn La', value: 51 },
  { label: 'Tây Ninh', value: 52 },
  { label: 'Thái Bình', value: 53 },
  { label: 'Thái Nguyên', value: 54 },
  { label: 'Thanh Hóa', value: 55 },
  { label: 'Thừa Thiên Huế', value: 56 },
  { label: 'Tiền Giang', value: 57 },
  { label: 'TP. Hồ Chí Minh', value: 58 },
  { label: 'Trà Vinh', value: 59 },
  { label: 'Tuyên Quang', value: 60 },
  { label: 'Vĩnh Long', value: 61 },
  { label: 'Vĩnh Phúc', value: 62 },
  { label: 'Yên Bái', value: 63 },
];
export const jobStatusOptions: Option[] = [
  { label: 'Đang chờ duyệt', value: 0 },
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
  { label: 'Đã ứng tuyển', value: ApplyStatus.Pending },
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
export const userTypeOptions: Option[] = [
  { label: 'Chưa xác định', value: TypeUser.Undifine },
  { label: 'Ứng viên', value: TypeUser.User },
  { label: 'Nhà tuyển dụng', value: TypeUser.Employer },
  { label: 'Quản trị viên', value: TypeUser.Admin },
];
export const statusAccounts: Option[] = [
  { label: 'Đang hoạt động', value: 1 },
  { label: 'Không hoạt động', value: 0 },
];
