import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // chỉ persist slice 'auth'
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
// const store = configureStore({
//   reducer: rootReducer,
// });
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);
export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;

export type AppStore = typeof store;
