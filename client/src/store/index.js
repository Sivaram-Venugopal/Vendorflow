import { configureStore } from '@reduxjs/toolkit';
import healthReducer from './slices/healthSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    health: healthReducer,
    auth: authReducer,
  },
});

export default store;
