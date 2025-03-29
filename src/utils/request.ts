import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message as $message } from 'antd';
import axios from 'axios';
import { isString } from './common';

export interface RequestOptions extends AxiosRequestConfig {
  isReturnResult?: boolean;
  successMsg?: string;
  errorMsg?: string;
  showSuccessMsg?: boolean;
  requestType?: 'json' | 'form';
}

const UNKNOWN_ERROR = 'Unknown error, please try again!';
export const baseApiUrl = `${String(import.meta.env.VITE_BASE_URL)}/`;

const axiosInstance = axios.create({
  baseURL: baseApiUrl,
  timeout: 15000,
});

// Thêm token vào request headers nếu có
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      // config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['x-token'] = `${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Xử lý lỗi và hiển thị thông báo
axiosInstance.interceptors.response.use(
  response => {
    // if (Array.isArray(response.data) && response.data.length === 0) {
    //   return Promise.reject(new Error('No data returned from the server.'));
    // }
    return response;
  },
  (error: AxiosError) => {
    if (!axios.isCancel(error)) {
      console.error('Axios Error:', error);
      const url = error.config?.url; // 🔥 Lấy URL request
      const method = error.config?.method?.toUpperCase(); // 🔥 Lấy method của request lỗ
      console.error(`Lỗi API: ${method} ${url} - ${error.response?.status}`);
      let errMsg = UNKNOWN_ERROR;
      const responseData = error.response?.data;

      if (responseData?.errors?.length) {
        errMsg =
          responseData.errors.map((err: any) => err.message).join(', ') ||
          UNKNOWN_ERROR;
      } else if (responseData?.message) {
        errMsg = responseData.message;
      }

      if (error.response?.status === 401) {
        // localStorage.clear();
        // window.location.href = '/login';
      }
      if (method === 'DELETE') {
        errMsg = 'Cannot delete record because there is related data!';
      }
      if (
        responseData?.errors?.some(
          (error: { code: number }) =>
            ![499, 453, 451, 452, 606, 608, 611, 615, 613].includes(error.code)
        )
      ) {
        $message.error(errMsg);
      }
    }
    return Promise.resolve(error.response);
  }
);

// Hàm request chính
export async function request<T = any>(
  urlOrConfig: string | RequestOptions,
  config: RequestOptions = {}
): Promise<T> {
  const url = isString(urlOrConfig) ? urlOrConfig : urlOrConfig.url!;
  const finalConfig = isString(urlOrConfig) ? config : urlOrConfig;

  try {
    const {
      requestType,
      isReturnResult = false,
      successMsg,
      showSuccessMsg,
      ...rest
    } = finalConfig;

    const response = (await axiosInstance.request({
      url,
      ...rest,
      headers: {
        ...rest.headers,
        ...(requestType === 'form'
          ? { 'Content-Type': 'multipart/form-data' }
          : {}),
      },
    })) as AxiosResponse<{
      result: T;
      isSuccess: boolean;
      errors?: { message: string }[];
    }>;

    const { data } = response;
    if (data.isSuccess && successMsg) {
      $message.success(successMsg);
    } else if (showSuccessMsg && data.errors?.length) {
      data.errors.forEach(error => $message.success(error.message));
    }

    return isReturnResult ? data.result : (data as unknown as T);
  } catch (error) {
    console.log('check err', error);
    return Promise.reject(error);
  }
}
