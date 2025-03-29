import { FormatedDataSourceItem } from './IndividualList.formatData';

interface Totals {
  totalAdults: number;
  totalChildren: number;
  totalRate: number;
  specialServiceCharge: number;
  total: number;
}

export const IndividualListCalculateTotals = (
  formatedDataSource: FormatedDataSourceItem[]
): Totals => {
  return formatedDataSource.reduce(
    (acc, item) => {
      acc.totalAdults += item.adults;
      acc.totalChildren += item.numChildren;
      acc.totalRate += item.rate;
      acc.specialServiceCharge += item.specialServiceCharge;
      acc.total += item.total;
      return acc;
    },
    {
      totalAdults: 0,
      totalChildren: 0,
      totalRate: 0,
      specialServiceCharge: 0,
      total: 0,
    }
  );
};
