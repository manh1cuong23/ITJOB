import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '..';

const initialState = {
  bookingGuestInfos: [],
  bookingItems: {},
};

const viewGroupSlice = createSlice({
  name: 'view-group',
  initialState,
  reducers: {
    setBookingGuestInfos(state, action) {
      state.bookingGuestInfos = action.payload;
    },
    setBookingItems(state, action) {
      state.bookingItems = action.payload;
    },

	}
});

export const selectBookingGuestInfos = (state: AppState) => state.viewGroup.bookingGuestInfos;
export const selectBookingItems = (state: AppState) => state.viewGroup.bookingItems;
export const { setBookingGuestInfos, setBookingItems} = viewGroupSlice.actions;
export default viewGroupSlice.reducer;