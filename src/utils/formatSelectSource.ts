import { ReactNode } from 'react';
export interface ISource {
  label: string;
  value: any;
  disabled?: boolean;
  id?: number;
  packages?: any;
  marketSegmentId?: number;
  status?: any;
}
export interface ICustomSource extends ISource {
  phoneNumber: string;
}
export function formatObjectLabelValue(objects: any[]) {
  var formatedObjectArr: ISource[] = [];
  for (const obj of objects) {
    var tempObj: any = {};
    if (!tempObj['label']) {
      tempObj['label'] = '';
    }
    if (!tempObj['value']) {
      tempObj['value'] = '';
    }
    tempObj['value'] = obj.id;
    tempObj['label'] = obj.name;
    formatedObjectArr.push(tempObj);
  }
  return formatedObjectArr;
}
