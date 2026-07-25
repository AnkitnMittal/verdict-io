import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

/* Configure the Redux store */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    /* Future reducers: problems, submissions, etc. */
  },
});
