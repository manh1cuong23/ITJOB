import { ISource } from '@/utils/formatSelectSource';
import { IError } from '../booking-info/type';

export interface IRateInfoItem {
  id?: string;
  No: string;
  hotelId?: number;
  sourceName: string;
  sourceId: string;
  date: string;
  roomType: string;
  guest: string;
  package: string;
  rate: number;
  remark: string;
  adults: number;
  children: number;
  ratePlanCode: string;
  packageCode: string;
  allotmentNo: string;
  roomTypeId: number;
  roomTypeCode: string;
  bookingItemId: number;
}

export interface IPackage {
  code: string;
  description: string;
  name: string;
  packages: any;
  status: string;
}

export interface IRateInfoProps {
  rateInfoList: IRateInfoItem[];
  setTotalRoomCharge?: React.Dispatch<React.SetStateAction<number>>;
  setRateInfoList?: React.Dispatch<React.SetStateAction<IRateInfoItem[]>>;
  errorRateInfor?: IError[];
  setRateInfoSelected?: any;
  isView?: boolean;
	childNum?: number;
  adultNum?: number;
	arrDeptDate?: [string, string] | null;
}
