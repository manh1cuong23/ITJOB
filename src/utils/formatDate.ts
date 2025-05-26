import moment from 'moment';
import dayjs from 'dayjs';

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
export function formatDateToYMD(isoString: string) {
  return new Date(isoString).toISOString().split('T')[0];
}

export const formatDateUS = (inputString?: string) => {
  if (!inputString) return '';
  const date = new Date(inputString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};
export const formatDateTable = (dateString: string) => {
  if (!dateString) return '-';
  if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    return dateString;
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const [day, month, year] = dateString.split('/');
      const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

      if (isNaN(parsedDate.getTime())) {
        return '-';
      }
      return dateString;
    }
    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và đảm bảo có 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (tháng bắt đầu từ 0)
    const year = date.getFullYear(); // Lấy năm

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};
export function convertDateString(dateStr: string): string {
  // Tách ngày, tháng, năm từ chuỗi
  const [year, month, day] = dateStr.split('-').map(Number);

  // Tạo đối tượng Date (chú ý tháng trong Date bắt đầu từ 0, nên cần trừ đi 1)
  const date = new Date(Date.UTC(year, month - 1, day));

  // Chuyển thành chuỗi ISO
  return date.toISOString();
}

export function formatDateToISO(dateStr: string): string {
  // Tạo đối tượng Date từ chuỗi ngày
  const date = new Date(dateStr);

  // Trả về chuỗi ISO
  return date.toISOString();
}
export const checkAndformatDate = (date: string) => {
  // Kiểm tra định dạng YYYY-MM-DD
  const yyyymmddRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (yyyymmddRegex.test(date)) {
    return date;
  }

  // Kiểm tra định dạng DD/MM/YYYY
  const ddmmyyyyRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (ddmmyyyyRegex.test(date)) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`; // Format lại thành YYYY-MM-DD
  }

  return ''; // Trả về chuỗi rỗng nếu định dạng không hợp lệ
};

export function formatDateNew(isoString: string) {
  return dayjs(isoString).format('DD/MM/YYYY');
}
export function formatDateTime(isoDate: string): string {
  return dayjs(isoDate).format('DD/MM/YYYY HH:mm:ss');
}
