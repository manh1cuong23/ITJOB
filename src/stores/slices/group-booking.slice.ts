import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '..';

const initialState = {
  individualData: [],
  generalInfoData: [],
  guestSelected: [],
	roomSearch: [],
};

const groupBookingSlice = createSlice({
  name: 'group-booking',
  initialState,
  reducers: {
    setIndividualData(state, action) {
      state.individualData = action.payload;
    },
    setGeneralInfoData(state, action) {
      state.generalInfoData = action.payload;
    },
    setGuestSelected(state, action) {
      state.guestSelected = action.payload;
    },
    setRoomSearch(state, action) {
      state.roomSearch = action.payload;
    },
  },
});

export const selectIndividualData = (state: AppState) => state.groupBooking.individualData;
export const selectGeneralInfoData = (state: AppState) => state.groupBooking.generalInfoData;
export const selectGuestSelected = (state: AppState) => state.groupBooking.guestSelected;
export const selectRoomSearch = (state: AppState) => state.groupBooking.roomSearch;
export const { setIndividualData, setGeneralInfoData, setGuestSelected, setRoomSearch } = groupBookingSlice.actions;
export default groupBookingSlice.reducer;