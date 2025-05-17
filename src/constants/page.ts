// Mảng chứa các cặp URL và tiêu đề trang
export const pageTitles: { url: string; title: string; regex?: RegExp }[] = [
  { url: '/recruiter/management/job', title: 'Quản lý trang tuyển dụng' },
  { url: '/admin/users', title: 'Quản lý tài khoản' },
  { url: '/admin/jobs', title: 'Quản lý tin tuyển dụng' },
  { url: '/admin/envalutions', title: 'Quản lý đánh giá công ty' },
  { url: '/recruiter/management/transaction', title: 'Quản lý giao dịch' },
  { url: '/admin/management/transaction', title: 'Quản lý giao dịch' },
  { url: '/admin/management/package', title: 'Quản lý gói tuyển dụng' },

  {
    url: '/recruiter/jobs/results/:id',
    title: 'Quản lý ứng viên',
    regex: /^\/recruiter\/jobs\/results\/([a-f0-9]+)$/,
  },
  {
    url: '/recruiter/cv/:cvId/detail/:detailId',
    title: 'Xem thông tin ứng viên',
    regex: /^\/recruiter\/cv\/([a-f0-9]+)\/detail\/([a-f0-9]+)$/,
  },
  { url: '/recruiter/candicate', title: 'Tìm kiếm ứng viên' },
  { url: '/admin/management/package', title: 'Quản lý gói tuyển dụng' },
  { url: '/recruiter/profile', title: 'Thông tin công ty' },
  {
    url: '/recruiter/cv/:cvId/detail/invite',
    title: 'Mời ứng viên',
    regex: /^\/recruiter\/cv\/([a-f0-9]+)\/detail\/invite$/,
  },
  { url: '/dashboard', title: 'Trang chủ' },
  { url: '/admin/management/blog', title: 'Quản lý blog' },
];

export const STATUS_BOOKING = {
  WARNING: 1,
  REJECTED: 2,
  CONFIRMED: 3,
  CHECKED_IN: 4,
  CHECK_OUT: 5,
  CANCELED: 6,
  CLOSED: 7,
};

export const ROLE_GUEST = {
  MAIN: 1, // khách chính
  SECONDARY: 2, // khách phụ
  NON_RESIDENT: 3, // khách đặt phòng, không lưu trú
  OTHER: 4, // khách khác
};

export const optionsOverView = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];
