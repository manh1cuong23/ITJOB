import { ISource } from '@/utils/formatSelectSource';

export type InputData = {
  code: string;
  id: number;
  status: string;
  [key: string]: any; // Để xử lý các trường khác không xác định
};
export type CombinedData = {
  id?: number;
  rateCode: ISource;
  roomType: ISource;
  packagePlan: ISource;
  cost_rate: string;
  rack_rate: string;
  distribution_rate: string;
};
