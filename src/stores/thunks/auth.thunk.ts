import { IBaseMiddlewareRequest } from '../types';
import { createAsyncThunk, type Dispatch } from '@reduxjs/toolkit';
import Api from '@/api/features';
import { clearLoginStatus } from '../slices/auth.slice';

interface ILoginRequest extends IBaseMiddlewareRequest<any> {
  params: any;
}

// typed wrapper async thunk function demo, no extra feature, just for powerful typings
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ params, onSuccess, onError }: ILoginRequest) => {
    try {
      // Gọi API để đăng nhập
      const response = await Api.auth.authLogin(params) as any;
      if (response.data.access_token) {
        onSuccess?.(response);
        // Lưu token vào localStorage
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('username', params.username);

        return response;
      } else {
        onError?.(response);
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
