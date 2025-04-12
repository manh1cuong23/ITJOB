import { ColumnType } from 'antd/lib/table';
import { S } from 'mockjs';

export interface Options {
  value: number | string;
  text: string;
}
export interface OptionsCommon {
  value: number | string;
  lable: string;
}

export interface SelectOptions {
  type: 'select';
  options: Options[];
}

export interface fieldsComsite extends ColumnType<S> {
  label: string;
  dataIndex: string;
  type: ColumnOfType;
}

export interface CompositeOptions {
  type: 'composite';
  fields: fieldsComsite[];
}

export type ColumnOfType = 'string' | SelectOptions | 'date' | CompositeOptions;
//Old  interface
export interface ICellActive {
  code: string;
  date: string;
  id: number;
}

export interface CommonState {
  cellsActive: ICellActive[];
}
export interface KeyLabel {
  key: string;
  label: string;
}

export enum TypeUser {
  Undifine,
  User,
  Employer,
  Admin,
}
