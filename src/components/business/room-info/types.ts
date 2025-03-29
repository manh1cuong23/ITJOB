import { ISpecialServiceList } from "../special-service/type";
import { IPackage, IRateInfoItem } from "../rate-info/type";
import { IndividualListItem } from "../individual-list/IndividualList.types";

export interface IRoomInfoProps{
		isEdit?: boolean;
    bookingData?: any;
    onSearch?: (value: any) => void;
		arrDeptDate?: [string, string] | null;
    specialServiceList: ISpecialServiceList[];
    setSpecialServiceList: React.Dispatch<React.SetStateAction<ISpecialServiceList[]>>;
    rateInfoList?: IRateInfoItem[];
    setRateInfoList?: React.Dispatch<React.SetStateAction<IRateInfoItem[]>>;
		setPackages: React.Dispatch<React.SetStateAction<IPackage[]>>;
		setIndividualList?: React.Dispatch<React.SetStateAction<IndividualListItem[]>>;
		setHotelIdSelected?: React.Dispatch<React.SetStateAction<string | null>>;
		setRoomSearch?: React.Dispatch<React.SetStateAction<any[]>>;
		roomSearch?: any[];
		individualList?: IndividualListItem[];
    adultNum?: number;
    childNum?: number;
		isGroup?: boolean;
		setHotelId?: React.Dispatch<React.SetStateAction<number>>;
    setHotelSelected: React.Dispatch<React.SetStateAction<string | null>>;
  }
export interface IListRoom{
		hotelId: string;
    id: string;
    packageName: string;
    sourceName: string;
    sourceId: string;
    rate: string;
    roomTypeName: string;
    availableRooms: number;
    roomTypeId: number;
    roomTypeCode:string;
    ratePlanCode: string;
    packageCode: string;
    allotmentNo: string;
  }