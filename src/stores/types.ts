export interface IBaseMiddlewareRequest<T> {
  data?: T;
  onSuccess?: (data?: any) => void;
  onError?: (error?: any) => void;
  requestWithLoading?: boolean;
  forSelect?: boolean;
  approve?: boolean;
  reject?: boolean;
}
