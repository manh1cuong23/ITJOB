import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RememberedCredentialsState {
  username: string;
  password: string;
  remember: boolean;
}

const initialState: RememberedCredentialsState = {
  username: '',
  password: '',
  remember: false,
};

const rememberedCredentialsSlice = createSlice({
  name: 'rememberedCredentials',
  initialState,
  reducers: {
    setRememberedCredentials: (state, action: PayloadAction<RememberedCredentialsState>) => {
      return action.payload;
    },
    clearRememberedCredentials: () => {
      return initialState;
    },
  },
});

export const { setRememberedCredentials, clearRememberedCredentials } = rememberedCredentialsSlice.actions;
export interface RootState {
  rememberedCredentials: RememberedCredentialsState;
}

export const selectRememberedCredentials = (state: RootState) => state.rememberedCredentials;
export default rememberedCredentialsSlice.reducer;