import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '..';
import { useDispatch } from 'react-redux';

interface State {
  theme: 'light' | 'dark';
  loading: boolean;
  username?: string;
}

const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'dark' : 'light';
const userTheme = localStorage.getItem('theme') as State['theme'];

const initialState: State = {
  theme: userTheme || systemTheme,
  loading: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setGlobalState(state, action: PayloadAction<Partial<State>>) {
      Object.assign(state, action.payload);

      if (action.payload.theme) {
        const body = document.body;

        if (action.payload.theme === 'light') {
          if (!body.hasAttribute('theme-mode')) {
            body.setAttribute('theme-mode', 'light');
          }
        } else {
          if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');
          }
        }
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setGlobalState,setLoading } = globalSlice.actions;

// Selector
export const selectLoading = (state: AppState) => state.global.loading;
// sử dụng: const loading = useSelector(selectLoading);

export default globalSlice.reducer;
