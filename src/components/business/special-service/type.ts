export interface ISpecialServiceList {
  hotelId: string;
  serviceCode: string;
  serviceName: string;
  description: string;
  price: number;
  remark: string;
  id: string;
  createdBy: string;
  createdDate: string;
  deletedDate: any;
  deletedBy: any;
  deleted: string;
  totalAmount: number;
  quantity: number;
  fromDate: string;
  toDate: string;
  no: string;
  roomNo?: string;
}
export interface ISpecialServiceListCustomTotal extends ISpecialServiceList {
  total: number;
}
