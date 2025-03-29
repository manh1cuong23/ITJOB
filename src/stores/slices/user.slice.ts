import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import store, { AppState } from '@/stores';

import { getGlobalState } from '@/utils/getGloabal';
import { Role } from '@/interface/user/login';

const initialState = {
  ...getGlobalState(),
  listUser: [] as API.UserEntity[],
  role: (localStorage.getItem('username') || '') as Role,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setListUser(state, action: PayloadAction<API.UserEntity[]>) {
      state.listUser = action.payload;
    },
  },
});

// Selectors
export const selectListUser = (state: AppState) =>
  state.user.listUser;

export const { setListUser } = userSlice.actions;
export default userSlice.reducer;
