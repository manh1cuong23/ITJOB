export interface Locales<T = any> {
  /** Việt Nam */
  vi_VN: T;
  /** English */
  en_US: T;
}

export type Language = keyof Locales;

export interface PageData<T> {
  pageNumber: number;
  pageSize: number;
  total: number;
  data: T[];
}
export interface PageDataDto<T> {
  totalCount: number;
  items: T[];
}
