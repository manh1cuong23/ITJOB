import { ISource } from '@/utils/formatSelectSource';
import { IListRoom } from '../room-info/types';
import { IRoomInfoData } from '@/containers/booking/view-booking/type';
import { ISpecialServiceList } from '../special-service/type';
import { IRateInfoItem } from '../rate-info/type';
import { IndividualListItem } from '../individual-list/IndividualList.types';

export interface Options {
  value: number | string;
  text: string;
}

export interface IError {
  field: string;
  row: number;
	message?: string;
}

export interface IBookingInfoProps {
  bookingData?: any;
  arrDeptDate?: [string, string] | null;
  setRoomInfoData?: React.Dispatch<
    React.SetStateAction<IRoomInfoData | undefined>
  >;
  childNum?: number;
  adultNum?: number;
  setSpecialSvcAmt: React.Dispatch<React.SetStateAction<number>>;
  setTotalRoomCharge: React.Dispatch<React.SetStateAction<number>>;
  setSpecialServiceData: React.Dispatch<
    React.SetStateAction<ISpecialServiceList[]>
  >;
	setHotelId?: React.Dispatch<React.SetStateAction<number>>;
  specialServiceData: ISpecialServiceList[];
  rateInfoList: IRateInfoItem[];
  setRateInfoList: React.Dispatch<React.SetStateAction<IRateInfoItem[]>>;
  errorRateInfor?: IError[];
  errorSpecialService?: IError[];
  isEdit?: boolean;
  individualList?: IndividualListItem[];
  // hotelList: ISource[];
  // roomTypeList: ISource[];
  // roomList?: IListRoom[];
}