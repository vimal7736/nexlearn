import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import examReducer from './examSlice';
import resultReducer from './resultSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
    result: resultReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;