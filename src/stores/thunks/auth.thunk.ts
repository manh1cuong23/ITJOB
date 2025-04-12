import { IBaseMiddlewareRequest } from '../types';
import { createAsyncThunk, type Dispatch } from '@reduxjs/toolkit';
import { clearLoginStatus } from '../slices/auth.slice';
import jwtDecode from 'jwt-decode';
import { authLogin } from '@/api/features/auth';
interface ILoginRequest extends IBaseMiddlewareRequest<any> {
  params: any;
}

// typed wrapper async thunk function demo, no extra feature, just for powerful typings
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ params, onSuccess, onError }: ILoginRequest) => {
    try {
      // Gọi API để đăng nhập
      const response = (await authLogin(params)) as any;

      if (response?.result?.accessToken) {
        const accessToken = response.result.accessToken;
        const decoded = accessToken && (jwtDecode(accessToken) as any);
        onSuccess?.(decoded.payload);
        // Lưu token vào localStorage
        localStorage.setItem('token', response.result.accessToken);
        localStorage.setItem('refreshToken', response.result.refreshToken);
        localStorage.setItem('username', decoded.payload.userId);
        return response;
      } else {
        onError?.(response.message);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      dispatch(clearLoginStatus());
    } catch (error) {
      throw error;
    }
  }
);
