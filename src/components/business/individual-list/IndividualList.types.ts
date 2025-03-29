
import { IRateInfoItem } from "../rate-info/type";
import { ISpecialServiceList } from "../special-service/type";

export interface IndividualListItem {
  // id: string;
	bookingStatus?: number;
	bookingNo?: string;
	createdBy?: string;
	hotelId: string;
	roomNo: string;
  No: string;
  sourceId: string;
  arrivalDate: string;
  departureDate: string;
  roomType: string;
  package: string;
  rate: number;
  remark: string;
  adults: number;
  numChildren: number;
	rateInfos: IRateInfoItem[];
	specialServices: ISpecialServiceList[];
	bookingGuestInfos?: any;
	channelName?: string;
	bookingSourceCode?: string;
	evoucherCode?: string;
}

export interface IPackage {
  code: string;
  description: string;
  name: string;
  packages: any;
  status: string;
}
