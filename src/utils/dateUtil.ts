/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';
import moment from 'moment';
import { Moment } from 'moment';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';



export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

export function convertHashYMDtoDMY(date: string) {
  if (!date) return '';

  const dateString = date;
  const dateParts = dateString.split('-');
  return dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
}

export function convertHashYMDtoDMYHHmm(date: string) {
  if (!date) return '';

  const dateString = date.slice(0, 10);
  const time = date.slice(11, 16);
  const dateParts = dateString.split('-');
  return dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0] + ' ' + time;
}


export function dateDifference(d1?: string, d2?: string){
  if(!d1 || !d2) return '-';
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  const diffTime = Math.abs(Number(date2 || 0) - Number(date1));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if(diffTime < 1) return 1;
  return diffDays;
};


export const convertToYYYYMMDD = (dateStr: string): string => {
  return dayjs(dateStr, 'DD/MM/YYYY').format('YYYY-MM-DD');
};

function convertDate(dateStr: string): string {
  const [day, month, year] = dateStr.split('/').map(Number);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function isDateInRange(date: string, startDate: string | Date, endDate: string | Date): boolean {
   if(!date) return true;
  const targetDate = new Date(convertDate(date));
  const start = new Date(startDate);
  const end = new Date(endDate);

  return targetDate >= start && targetDate <= end;
}

export const hasOverlap = (range1: [string, string], range2: [string, string]): boolean => {
  const start = moment(range1[0], 'YYYY-MM-DD');
	const end = moment(range1[1], 'YYYY-MM-DD');
	const itemStart = moment(range2[0], 'YYYY-MM-DD');
	const itemEnd = moment(range2[1], 'YYYY-MM-DD');

	return (
		itemStart.isSameOrBefore(end) && itemEnd.isSameOrAfter(start)
	);
};