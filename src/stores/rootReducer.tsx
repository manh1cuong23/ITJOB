import { combineReducers } from '@reduxjs/toolkit';
import tagsViewReducer from './slices/tags-view.slice';
import globalReducer from './slices/global.slice';
import userReducer from './slices/user.slice';
import authReducer from './slices/auth.slice';
import groupBookingReducer from './slices/group-booking.slice';
import viewGroupReducer from './slices/view-group.slice';

const rootReducer = combineReducers({
  tagsView: tagsViewReducer,
  user: userReducer,
  global: globalReducer,
  auth: authReducer,
  groupBooking: groupBookingReducer,
  viewGroup: viewGroupReducer,
});

export default rootReducer;
