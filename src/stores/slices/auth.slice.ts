import type { Role } from '@/interface/user/login';
import type { Locale, UserState } from '@/interface/user/user';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import { getGlobalState } from '@/utils/getGloabal';
import { AppState } from '..';

const initialState: UserState = {
  ...getGlobalState(),
  locale: (localStorage.getItem('locale')! || 'en_US') as Locale,
  newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
  logged: localStorage.getItem('token') ? true : false,
  menuList: [],
  username: localStorage.getItem('username') || '',
  role: (localStorage.getItem('username') || '') as Role,
  token: '',
  userInfo: null as any,
  perms: [] as any[],
	passWord: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserItem(state, action: PayloadAction<Partial<UserState>>) {
      const { username } = action.payload;

      if (username !== state.username) {
        localStorage.setItem('username', action.payload.username || '');
      }

      Object.assign(state, action.payload);
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setPerms(state, action: PayloadAction<string[]>) {
      state.perms = action.payload;
    },
    // setMenus(state, action: PayloadAction<any>) {
    //   state.menuList = sortMenus(action.payload);
    // },
    setUserInfo(state, action: PayloadAction<Partial<API.UserEntity> | null>) {
      state.userInfo = action.payload;
    },
    setLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload;
      localStorage.setItem('locale', action.payload);
    },
    setNewUser(state, action: PayloadAction<boolean>) {
      state.newUser = action.payload;
      localStorage.setItem('newUser', JSON.stringify(action.payload));
    },
    clearLoginStatus(state) {
      state.token = '';
      state.perms = [];
      state.userInfo = null;
      state.menuList = [];
      localStorage.clear();
    },
		setPassWord(state, action: PayloadAction<string>) {
			state.passWord = action.payload;
		}
  },
});

// Selectors
export const selectToken = (state: AppState) => state.auth.token;
export const selectPerms = (state: AppState) => state.auth.perms;
export const selectUserInfo = (state: AppState) => state.auth.userInfo;
export const selectLocale = (state: AppState) => state.auth.locale;
export const selectNewUser = (state: AppState) => state.auth.newUser;
export const selectPassWord = (state: AppState) => state.auth.passWord;

export const { setUserItem, setToken, setPerms, setUserInfo, setLocale, setNewUser, clearLoginStatus, setPassWord } = authSlice.actions;

export default authSlice.reducer;
