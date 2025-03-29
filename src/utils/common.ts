import { baseApiUrl } from './request';

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<T, K>);
}
export function isString(value: any): value is string {
  return typeof value === 'string' || value instanceof String;
}
export const getAvatarUrl = (path: string) => {
  return /^https?:\/\//.test(path) ? path : baseApiUrl + path;
};
export const formatNumberMoney = (num: number | undefined) => {
  if (num === undefined) return 'N/A';
  return new Intl.NumberFormat('vi-VN').format(num);
};
export function transformObject<T extends Record<string, any>>(
  obj: T
): { key: keyof T; value: T[keyof T] }[] {
  return Object.entries(obj).map(([key, value]) => ({
    key: key as keyof T,
    value: value as T[keyof T],
  }));
}
export const calculateTotalPrice = (services: any) => {
  let totalPrice = 0;
  services.forEach((service: any) => {
    totalPrice += service.price;
  });
  return totalPrice;
};

export const removeVietnameseTones = (str: string) => {
  return str
    .normalize('NFD') // Tách tổ hợp ký tự có dấu
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};
export function generateUniqueString() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const isValidText = (value: string) => {
  return (
    value !== null &&
    value !== undefined &&
    value !== '' &&
    !Number.isNaN(value)
  );
};

export function isAllEmptyStrings(arr: string[]) {
  return arr.every(item => item === '');
}
