import { IndividualListItem } from './IndividualList.types';

export interface FormatedDataSourceItem extends IndividualListItem {
  specialServiceCharge: number;
  total: number;
}

export const IndividualListFormatDataSource = (
  individualList: IndividualListItem[]
): FormatedDataSourceItem[] => {
  return individualList.length > 0
    ? individualList.map(item => {
        const specialServiceCharge = item.specialServices.reduce(
          (sum: number, service: any) =>
            sum + (isNaN(service.totalAmount) ? 0 : service.totalAmount),
          0
        );

        const total = specialServiceCharge + (item.rate || 0);

        return {
          ...item,
          specialServiceCharge,
          total,
        };
      })
    : [];
};
