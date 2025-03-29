// Mảng chứa các cặp URL và tiêu đề trang
export const pageTitles: { url: string; title: string; regex?: RegExp }[] = [
  { url: '/my-allotment', title: 'My Allotment' },
  { url: '/room-availability', title: 'Room Availability' },
  { url: '/inventory-input', title: 'Inventory Input' },
  { url: '/guest-profile', title: 'Guest Profile' },
  { url: '/hotel-list', title: 'Hotel' },
  { url: '/room-type', title: 'Room Type' },
  { url: '/package-service', title: 'Package Service' },
  { url: '/dashboard', title: 'Dashboard' },
  { url: '/booking', title: 'Booking Approval' },
  { url: '/package-plan', title: 'Package Plan' },
  { url: '/rate-code', title: 'Rate Code' },
  { url: '/rate-plan', title: 'Rate Plan' },
  { url: '/service', title: 'Service' },
	{ url: '/room-rate', title: 'Room Rate' },
  {
    url: '/booking/view-individual/:id',
    title: 'View Individual Booking',
    regex: /^\/booking\/view-individual\/(\d+)$/,
  },
  {
    url: '/booking/individual-view/:id',
    title: 'View Individual Booking',
    regex: /^\/booking\/individual-view\/(B\d+\.\d+%23\d+)$/,
  },
  {
    url: '/booking/view-group/:id',
    title: 'View Group Booking',
    regex: /^\/booking\/view-group\/(\d+)$/,
  },
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
